var peticionId = null;
var archivosSeleccionados = [];

function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(true)) return;
    setTimeout(loadUserInitial, 100);

    var params = new URLSearchParams(window.location.search);
    peticionId = params.get('id');
    if (!peticionId) {
        showMsg('alertBox', 'No se especificó una petición.', 'danger');
        return;
    }

    cargarPeticion(peticionId);
    cargarMiembros();
    setupFileUpload();

    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

function setupFileUpload() {
    var zona = document.getElementById('fileUpload');
    var input = document.getElementById('fileInput');
    if (!zona || !input) return;
    zona.addEventListener('click', function() { input.click(); });
    zona.addEventListener('dragover', function(e) { e.preventDefault(); zona.classList.add('active'); });
    zona.addEventListener('dragleave', function() { zona.classList.remove('active'); });
    zona.addEventListener('drop', function(e) {
        e.preventDefault();
        zona.classList.remove('active');
        agregarArchivos(e.dataTransfer.files);
    });
    input.addEventListener('change', function(e) {
        agregarArchivos(e.target.files);
        input.value = '';
    });
}

function agregarArchivos(files) {
    Array.from(files).forEach(function(file) {
        archivosSeleccionados.push(file);
        var lista = document.getElementById('fileList');
        var item = document.createElement('div');
        item.className = 'file-item';
        var icono = file.type.includes('image') ? '🖼️' : file.type.includes('pdf') ? '📄' : '📎';
        item.innerHTML =
            '<div class="file-item-name">' +
                '<div class="file-item-icon">' + icono + '</div>' +
                '<div class="file-item-info">' +
                    '<div class="file-item-filename">' + file.name + '</div>' +
                    '<div class="file-item-size">' + (file.size / 1024).toFixed(1) + ' KB</div>' +
                '</div>' +
            '</div>' +
            '<button type="button" class="file-item-remove" onclick="quitarArchivo(this, \'' + file.name + '\')"><i class="fas fa-trash"></i></button>';
        lista.appendChild(item);
    });
}

function quitarArchivo(btn, nombre) {
    archivosSeleccionados = archivosSeleccionados.filter(function(f) { return f.name !== nombre; });
    btn.closest('.file-item').remove();
}

async function cargarPeticion(id) {
    try {
        var p = await apiFetch('/api/peticiones/' + id);
        document.getElementById('subtitulo').textContent = 'Petición ' + shortId(p.id);
        document.getElementById('campoId').textContent = shortId(p.id);
        var tipo = p.tipoPeticion ? (p.tipoPeticion.charAt(0) + p.tipoPeticion.slice(1).toLowerCase()) : '--';
        document.getElementById('campoTipo').textContent = tipo;
        document.getElementById('campoAsunto').textContent = p.asunto || '--';
        document.getElementById('campoEstado').innerHTML = estadoBadge(p.estado);
        document.getElementById('campoFecha').textContent = formatDate(p.fechaCreacion);
        document.getElementById('campoSolicitante').textContent = p.miembro ? p.miembro.nombre : '--';
        document.getElementById('campoDescripcion').textContent = p.descripcion || '--';

        if (p.area) { document.getElementById('campoAreaDiv').style.display = ''; document.getElementById('campoArea').textContent = p.area; }
        if (p.ubicacion) { document.getElementById('campoUbicacionDiv').style.display = ''; document.getElementById('campoUbicacion').textContent = p.ubicacion; }
        if (p.fechaHecho) { document.getElementById('campoFechaHechoDiv').style.display = ''; document.getElementById('campoFechaHecho').textContent = formatDate(p.fechaHecho); }
        if (p.personaInvolucrada) { document.getElementById('campoPersonaDiv').style.display = ''; document.getElementById('campoPersona').textContent = p.personaInvolucrada; }

        if (p.contactoNombre || p.contactoEmail || p.contactoTelefono) {
            document.getElementById('campoContactoDiv').style.display = '';
            if (p.contactoNombre) document.getElementById('campoContactoNombre').textContent = p.contactoNombre;
            if (p.contactoEmail) document.getElementById('campoContactoEmail').textContent = p.contactoEmail;
            if (p.contactoTelefono) document.getElementById('campoContactoTelefono').textContent = p.contactoTelefono;
        }

        if (p.responsable) {
            document.getElementById('responsable').value = p.responsable.id || '';
        }

        if (p.evidencias && p.evidencias.length > 0) {
            var card = document.getElementById('evidenciasCard');
            if (card) {
                card.style.display = '';
                var html = '<div style="display:flex; flex-wrap:wrap; gap:12px;">';
                p.evidencias.forEach(function(ev) {
                    var esImagen = ev.url && ev.url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i);
                    if (esImagen) {
                        html += '<a href="' + ev.url + '" target="_blank">' +
                            '<img src="' + ev.url + '" style="width:80px; height:80px; object-fit:cover; border-radius:6px; border:1px solid var(--gray-200);" title="' + (ev.nombreArchivo || '') + '">' +
                            '</a>';
                    } else {
                        html += '<a href="' + ev.url + '" target="_blank" style="display:flex; align-items:center; gap:6px; padding:8px 12px; background:var(--gray-100); border-radius:6px; font-size:0.875rem; color:var(--primary); text-decoration:none;">' +
                            '<i class="fas fa-file"></i> ' + (ev.nombreArchivo || 'Archivo') + '</a>';
                    }
                });
                html += '</div>';
                document.getElementById('evidenciasContenido').innerHTML = html;
            }
        }
    } catch (err) {
        showMsg('alertBox', 'Error al cargar la petición: ' + err.message, 'danger');
    }
}

async function cargarMiembros() {
    try {
        var miembros = await apiFetch('/api/miembros');
        var select = document.getElementById('responsable');
        miembros.filter(function(m) { return m.rol === 'ADMIN'; }).forEach(function(m) {
            var opt = document.createElement('option');
            opt.value = m.id;
            opt.textContent = m.nombreMiembro + ' ' + m.apellidoMiembro;
            select.appendChild(opt);
        });
    } catch (err) {
        console.warn('No se pudieron cargar los miembros:', err.message);
    }
}

async function enviarRespuesta() {
    hideMsg('alertBox');

    var texto = document.getElementById('respuesta').value.trim();
    var nuevoEstado = document.getElementById('nuevoEstado').value;
    var responsableId = document.getElementById('responsable').value;
    var observacion = document.getElementById('observacion').value.trim();

    if (!texto && nuevoEstado === 'RESUELTA') {
        showMsg('alertBox', 'Debes escribir una respuesta para marcar la petición como resuelta.', 'danger');
        return;
    }
    if (!nuevoEstado) { showMsg('alertBox', 'Selecciona el nuevo estado de la petición.', 'danger'); return; }

    var btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        if (archivosSeleccionados.length > 0) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo archivos...';
            var token = localStorage.getItem('token');
            for (var i = 0; i < archivosSeleccionados.length; i++) {
                try {
                    var formData = new FormData();
                    formData.append('file', archivosSeleccionados[i]);
                    formData.append('peticionId', peticionId);
                    var res = await fetch(API_BASE + '/api/upload/evidencia', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token },
                        body: formData
                    });
                    if (!res.ok) console.warn('No se pudo subir:', archivosSeleccionados[i].name);
                    else await res.json();
                } catch (e) {
                    console.warn('Error subiendo:', archivosSeleccionados[i].name, e);
                }
            }
        }

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando respuesta...';

        if (texto) {
            await apiFetch('/api/peticiones/' + peticionId + '/respuestas', {
                method: 'POST',
                body: JSON.stringify({ texto: texto })
            });
        }

        var cuerpoEstado = { nuevoEstado: nuevoEstado };
        if (responsableId) cuerpoEstado.responsableId = responsableId;
        if (observacion) cuerpoEstado.observacion = observacion;
        var fechaResolucion = document.getElementById('resolutionDate').value;
        if (fechaResolucion) cuerpoEstado.fechaEstimadaResolucion = fechaResolucion;

        await apiFetch('/api/peticiones/' + peticionId + '/estado', {
            method: 'PUT',
            body: JSON.stringify(cuerpoEstado)
        });

        window.location.href = 'peticiones-admin.html';

    } catch (err) {
        showMsg('alertBox', err.message || 'Error al enviar la respuesta.', 'danger');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Respuesta';
    }
}
