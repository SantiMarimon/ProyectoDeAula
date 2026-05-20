var todasLasPeticiones = [];
var paginaActual = 0;
var tamañoPagina = 20;
var totalPaginas = 0;
var totalElementos = 0;
var filtrosActivos = { busqueda: '', estado: '', tipo: '', area: '' };

function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(true)) return;
    loadUserInitial();
    cargarPeticiones();
    document.getElementById('searchInput').addEventListener('input', aplicarFiltros);
    document.getElementById('areaFilter').addEventListener('change', aplicarFiltros);
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

async function cargarPeticiones(page) {
    page = page || 0;
    paginaActual = page;
    document.getElementById('tablaCuerpo').innerHTML =
        '<tr><td colspan="7" style="padding:40px; text-align:center; color:var(--gray-500);"><i class="fas fa-spinner fa-spin"></i> Cargando...</td></tr>';

    try {
        var busqueda = document.getElementById('searchInput').value.trim();
        var estado = document.getElementById('statusFilter').value;
        var tipo = document.getElementById('typeFilter').value;
        var area = document.getElementById('areaFilter').value;

        var params = '?page=' + page + '&size=' + tamañoPagina;
        if (busqueda) params += '&busqueda=' + encodeURIComponent(busqueda);
        if (estado)   params += '&estado='   + encodeURIComponent(estado);
        if (tipo)     params += '&tipo='     + encodeURIComponent(tipo);
        if (area)     params += '&area='     + encodeURIComponent(area);

        var data = await apiFetch('/api/peticiones' + params);
        var lista = data.content || [];
        totalPaginas = data.totalPages || 1;
        totalElementos = data.totalElements || 0;

        renderTabla(lista);
        renderPaginacion();
    } catch (err) {
        showMsg('alertBox', 'Error al cargar las peticiones: ' + err.message, 'danger');
        document.getElementById('tablaCuerpo').innerHTML = '<tr><td colspan="7" style="padding:30px; text-align:center; color:var(--danger);">Error al cargar.</td></tr>';
    }
}

function renderPaginacion() {
    var contenedor = document.getElementById('paginacion');
    if (!contenedor) return;

    if (totalPaginas === 0) { contenedor.innerHTML = ''; return; }

    var ultima = totalPaginas - 1;

    // Calcular ventana de 5 botones centrada en la página actual
    var inicio = Math.max(0, paginaActual - 2);
    var fin = Math.min(ultima, inicio + 4);
    if (fin - inicio < 4) inicio = Math.max(0, fin - 4);

    var html = '<div style="display:flex; align-items:center; justify-content:space-between; padding:15px 20px; border-top:1px solid var(--gray-200);">' +
        '<div style="color:var(--gray-500); font-size:0.875rem;">Página ' + (paginaActual + 1) + ' de ' + totalPaginas + ' (' + totalElementos + ' peticiones)</div>' +
        '<div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">';

    var esPrimera = paginaActual === 0;
    var esUltima  = paginaActual >= ultima;

    // Primera y Anterior
    html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(0)" ' + (esPrimera ? 'disabled' : '') + ' title="Primera">«</button>';
    html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(' + (paginaActual - 1) + ')" ' + (esPrimera ? 'disabled' : '') + '>‹ Anterior</button>';

    // "1 ..." antes de la ventana
    if (inicio > 0) {
        html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(0)">1</button>';
        if (inicio > 1) html += '<span style="padding:0 4px; color:var(--gray-400); line-height:2;">…</span>';
    }

    // Botones numerados
    for (var i = inicio; i <= fin; i++) {
        html += '<button class="btn btn-sm ' + (i === paginaActual ? 'btn-primary' : 'btn-secondary') + '" onclick="cargarPeticiones(' + i + ')">' + (i + 1) + '</button>';
    }

    // "... N" después de la ventana
    if (fin < ultima) {
        if (fin < ultima - 1) html += '<span style="padding:0 4px; color:var(--gray-400); line-height:2;">…</span>';
        html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(' + ultima + ')">' + totalPaginas + '</button>';
    }

    // Siguiente y Última
    html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(' + (paginaActual + 1) + ')" ' + (esUltima ? 'disabled' : '') + '>Siguiente ›</button>';
    html += '<button class="btn btn-sm btn-secondary" onclick="cargarPeticiones(' + ultima + ')" ' + (esUltima ? 'disabled' : '') + ' title="Última">»</button>';

    html += '</div></div>';
    contenedor.innerHTML = html;
}

function aplicarFiltros() {
    paginaActual = 0;
    cargarPeticiones(0);
}

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('areaFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('typeFilter').value = '';
    paginaActual = 0;
    cargarPeticiones(0);
}

function renderTabla(lista) {
    if (lista.length === 0) {
        document.getElementById('tablaCuerpo').innerHTML = '<tr><td colspan="7" style="padding:40px; text-align:center; color:var(--gray-500);">No se encontraron peticiones.</td></tr>';
        return;
    }
    var filas = lista.map(function(p) {
        var desc = p.asunto || p.descripcion || '';
        var descCorta = desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
        var puedeResponder = p.estado !== 'RESUELTA';
        return (
            '<tr>' +
                '<td style="padding:15px 20px;"><strong>' + shortId(p.id) + '</strong></td>' +
                '<td style="padding:15px 20px;">' + descCorta + '</td>' +
                '<td style="padding:15px 20px;">' + tipoBadge(p.tipoPeticion) + '</td>' +
                '<td style="padding:15px 20px;">' + (p.miembro ? p.miembro.nombre : '--') + '</td>' +
                '<td style="padding:15px 20px;">' + estadoBadge(p.estado) + '</td>' +
                '<td style="padding:15px 20px;">' +
                    formatDate(p.fechaCreacion) +
                    '<br><span style="font-size:0.8rem; color:var(--gray-500);">' + formatTime(p.fechaCreacion) + '</span>' +
                '</td>' +
                '<td style="padding:15px 20px;">' +
                    (puedeResponder
                        ? '<button class="btn btn-sm btn-primary" onclick="window.location.href=\'responder-peticion.html?id=' + p.id + '\'" title="Responder"><i class="fas fa-reply"></i></button> '
                        : '') +
                    '<button class="btn btn-sm btn-secondary" onclick="window.location.href=\'ver-peticion.html?id=' + p.id + '\'" title="Ver"><i class="fas fa-eye"></i></button>' +
                '</td>' +
            '</tr>'
        );
    });
    document.getElementById('tablaCuerpo').innerHTML = filas.join('');
}
