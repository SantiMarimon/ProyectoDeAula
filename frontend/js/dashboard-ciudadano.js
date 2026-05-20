var todasLasPeticiones = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(false)) return;
    var rol = localStorage.getItem('userRole');
    if (rol === 'ADMIN') { window.location.href = 'dashboard-admin.html'; return; }
    setTimeout(loadUserInitial, 100);
    var nombre = localStorage.getItem('userName') || '';
    if (nombre) document.getElementById('saludo').textContent = 'Bienvenido, ' + nombre;
    cargarPeticiones();
    mostrarBienvenida();
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
    document.getElementById('statusFilter').addEventListener('change', aplicarFiltros);
    document.getElementById('typeFilter').addEventListener('change', aplicarFiltros);
    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

async function mostrarBienvenida() {
    if (localStorage.getItem('nuevoRegistro') !== 'true') return;
    localStorage.removeItem('nuevoRegistro');

    var mensaje = '¡Bienvenido al sistema PQRS! Aquí puedes registrar tus peticiones, quejas, reclamos y sugerencias.';
    try {
        var config = await apiFetch('/api/configuracion');
        if (config && config.mensajeBienvenida) mensaje = config.mensajeBienvenida;
    } catch (e) { /* usa mensaje por defecto */ }

    var toast = document.createElement('div');
    toast.id = 'toastBienvenida';
    toast.style.cssText = 'position:fixed; top:80px; right:20px; z-index:9999; background:white; border-left:4px solid var(--primary); border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.15); padding:20px 24px; max-width:360px; animation:slideIn 0.3s ease;';
    toast.innerHTML =
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">' +
            '<div>' +
                '<div style="font-weight:700; color:var(--primary); margin-bottom:6px;"><i class="fas fa-hand-wave"></i> ¡Bienvenido!</div>' +
                '<div style="color:var(--gray-700); font-size:0.9rem; line-height:1.5;">' + mensaje + '</div>' +
            '</div>' +
            '<button onclick="this.closest(\'#toastBienvenida\').remove()" style="background:none; border:none; color:var(--gray-400); cursor:pointer; font-size:1.25rem; line-height:1; flex-shrink:0;">×</button>' +
        '</div>';

    var style = document.createElement('style');
    style.textContent = '@keyframes slideIn { from { transform:translateX(120%); opacity:0; } to { transform:translateX(0); opacity:1; } }';
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode) {
            toast.style.transition = 'opacity 0.5s ease';
            toast.style.opacity = '0';
            setTimeout(function() { if (toast.parentNode) toast.remove(); }, 500);
        }
    }, 6000);
}

async function cargarPeticiones() {
    document.getElementById('petitionsList').innerHTML = '<p style="text-align:center; color:var(--gray-500); padding:40px;">Cargando peticiones...</p>';
    try {
        todasLasPeticiones = await apiFetch('/api/peticiones/mis-peticiones');
        actualizarStats(todasLasPeticiones);
        renderLista(todasLasPeticiones);
    } catch (err) {
        showMsg('alertBox', 'No se pudieron cargar las peticiones: ' + err.message, 'danger');
        document.getElementById('petitionsList').innerHTML = '';
    }
}

function actualizarStats(lista) {
    document.getElementById('statTotal').textContent = lista.length;
    document.getElementById('statResueltas').textContent = lista.filter(function(p) { return p.estado === 'RESUELTA'; }).length;
    document.getElementById('statAsignadas').textContent = lista.filter(function(p) { return p.estado === 'ASIGNADA'; }).length;
    document.getElementById('statPendientes').textContent = lista.filter(function(p) { return p.estado === 'PENDIENTE'; }).length;
}

function aplicarFiltros() {
    var busqueda = document.getElementById('searchInput').value.toLowerCase();
    var estado = document.getElementById('statusFilter').value;
    var tipo = document.getElementById('typeFilter').value;
    var filtradas = todasLasPeticiones.filter(function(p) {
        var coincideTexto = !busqueda || (p.descripcion && p.descripcion.toLowerCase().includes(busqueda));
        var coincideEstado = !estado || p.estado === estado;
        var coincideTipo = !tipo || p.tipoPeticion === tipo;
        return coincideTexto && coincideEstado && coincideTipo;
    });
    renderLista(filtradas);
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    renderLista(todasLasPeticiones);
}

function renderLista(lista) {
    var contenedor = document.getElementById('petitionsList');
    if (lista.length === 0) {
        contenedor.innerHTML = '<div class="card"><div class="card-body" style="text-align:center; padding:60px; color:var(--gray-500);"><i class="fas fa-inbox" style="font-size:3rem; margin-bottom:20px; display:block;"></i>No se encontraron peticiones.</div></div>';
        return;
    }
    contenedor.innerHTML = lista.map(function(p) { return buildCard(p); }).join('');
}

function buildCard(p) {
    var claseEstado = estadoCardClass(p.estado);
    var desc = p.descripcion || '';
    var descCorta = desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
    var fecha = formatDate(p.fechaCreacion);
    var tipo = p.tipoPeticion ? (p.tipoPeticion.charAt(0) + p.tipoPeticion.slice(1).toLowerCase()) : '--';
    return (
        '<div class="petition-card ' + claseEstado + '" style="margin-bottom:20px;">' +
            '<div class="petition-header">' +
                '<div>' +
                    '<div class="petition-title">' + tipo + '</div>' +
                    '<div class="petition-id">' + shortId(p.id) + '</div>' +
                '</div>' +
                estadoBadge(p.estado) +
            '</div>' +
            '<div class="petition-content">' +
                (p.asunto ? '<p style="font-weight:600; color:var(--gray-800); margin-bottom:6px;">' + p.asunto + '</p>' : '') +
                '<p class="petition-description">' + descCorta + '</p>' +
                '<div class="petition-meta">' +
                    '<div class="petition-meta-item"><span class="petition-meta-label">Tipo</span><span class="petition-meta-value">' + tipo + '</span></div>' +
                    '<div class="petition-meta-item"><span class="petition-meta-label">Fecha</span><span class="petition-meta-value">' + fecha + '</span></div>' +
                    (p.responsable ? '<div class="petition-meta-item"><span class="petition-meta-label">Responsable</span><span class="petition-meta-value">' + p.responsable.nombre + '</span></div>' : '') +
                '</div>' +
            '</div>' +
            '<div class="petition-footer">' +
                '<div style="font-size:0.875rem; color:var(--gray-500);">Creada el ' + fecha + '</div>' +
                '<div class="petition-actions">' +
                    (p.estado === 'PENDIENTE'
                        ? '<button class="btn btn-sm btn-secondary" onclick="editPetition(\'' + p.id + '\')">' +
                              '<i class="fas fa-edit"></i> Editar' +
                          '</button> '
                        : '') +
                    '<button class="btn btn-sm btn-primary" onclick="window.location.href=\'ver-peticion.html?id=' + p.id + '\'">' +
                        '<i class="fas fa-eye"></i> Ver' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}
