function switchTab(tab, btn) {
    document.querySelectorAll('.auth-tab-content').forEach(function(el) { el.classList.remove('active'); });
    document.querySelectorAll('.auth-tab').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById(tab).classList.add('active');
    btn.classList.add('active');
}

function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(false)) return;
    loadUserInitial();

    var rol = localStorage.getItem('userRole');
    if (rol === 'ADMIN') {
        document.getElementById('navInicio').href = 'peticiones-admin.html';
        document.getElementById('navInicio').textContent = 'Peticiones';
        document.getElementById('navBrand').href = 'dashboard-admin.html';
    }

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) {
        showMsg('alertBox', 'No se especificó una petición.', 'danger');
        return;
    }

    window._peticionId = id;
    cargarPeticion(id);
    cargarHistorial(id);

    var inputAdmin = document.getElementById('inputEvidenciaAdmin');
    if (inputAdmin) {
        inputAdmin.addEventListener('change', function(e) {
            if (e.target.files[0]) subirEvidenciaAdmin(e.target.files[0]);
            e.target.value = '';
        });
    }

    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

async function cargarPeticion(id) {
    try {
        var p = await apiFetch('/api/peticiones/' + id);

        var subtitulo = document.getElementById('subtitulo');
        var campoId = document.getElementById('campoId');
        var campoTipo = document.getElementById('campoTipo');
        var campoFecha = document.getElementById('campoFecha');
        var campoSolicitante = document.getElementById('campoSolicitante');
        var campoDescripcion = document.getElementById('campoDescripcion');
        var badgeEstado = document.getElementById('badgeEstado');
        var campoEstado = document.getElementById('campoEstado');
        var contenedorResponsable = document.getElementById('contenedorResponsable');
        var campoResponsable = document.getElementById('campoResponsable');
        var petAsunto = document.getElementById('petAsunto');
        var btnEliminar = document.getElementById('btnEliminar');
        var campoUbicacion = document.getElementById('campoUbicacion');
        var campoFechaHecho = document.getElementById('campoFechaHecho');
        var campoPersona = document.getElementById('campoPersona');
        var campoContactoNombre = document.getElementById('campoContactoNombre');
        var campoContactoEmail = document.getElementById('campoContactoEmail');
        var campoContactoTelefono = document.getElementById('campoContactoTelefono');

        if (subtitulo) subtitulo.textContent = 'Petición ' + shortId(p.id);
        if (campoId) campoId.textContent = shortId(p.id);

        var tipo = p.tipoPeticion ? (p.tipoPeticion.charAt(0) + p.tipoPeticion.slice(1).toLowerCase()) : '--';
        if (campoTipo) campoTipo.textContent = tipo;
        if (campoFecha) campoFecha.textContent = formatDate(p.fechaCreacion);
        if (campoSolicitante) campoSolicitante.textContent = p.miembro ? p.miembro.nombre : '--';
        if (campoDescripcion) campoDescripcion.textContent = p.descripcion || '--';
        if (badgeEstado) badgeEstado.innerHTML = estadoBadge(p.estado);
        if (campoEstado) campoEstado.innerHTML = estadoBadge(p.estado);

        if (p.responsable) {
            if (contenedorResponsable) contenedorResponsable.style.display = '';
            if (campoResponsable) campoResponsable.textContent = p.responsable.nombre;
        }

        if (petAsunto) petAsunto.textContent = p.asunto || '--';

        var rol = localStorage.getItem('userRole');
        if (rol === 'ADMIN') {
            if (btnEliminar) btnEliminar.style.display = '';
        }

        if (campoUbicacion) campoUbicacion.textContent = p.ubicacion || 'No especificada';
        if (campoFechaHecho) campoFechaHecho.textContent = p.fechaHecho ? formatDate(p.fechaHecho) : 'No especificada';
        if (campoPersona) campoPersona.textContent = p.personaInvolucrada || 'No especificado';
        if (campoContactoNombre) campoContactoNombre.textContent = p.contactoNombre || '--';
        if (campoContactoEmail) campoContactoEmail.textContent = p.contactoEmail || '--';
        if (campoContactoTelefono) campoContactoTelefono.textContent = p.contactoTelefono || '--';

        renderRespuestas(p.respuestas || [], id);
        renderEvidencias(p.evidencias || []);
    } catch (err) {
        showMsg('alertBox', 'Error al cargar la petición: ' + err.message, 'danger');
    }
}

async function cargarHistorial(id) {
    try {
        var historial = await apiFetch('/api/peticiones/' + id + '/historial');
        renderHistorial(historial || []);
    } catch (err) {
        var tc = document.getElementById('timelineContenido');
        if (tc) tc.innerHTML = '<p style="color:var(--gray-500);">No se pudo cargar el historial.</p>';
    }
}

function renderHistorial(historial) {
    var contenedor = document.getElementById('timelineContenido');
    if (!contenedor) return;
    if (historial.length === 0) {
        contenedor.innerHTML = '<p style="color:var(--gray-500);">Sin cambios registrados aún.</p>';
        return;
    }
    var html = '<div class="petition-status-timeline">';
    historial.forEach(function(h) {
        var estadoLabel = h.estado === 'PENDIENTE' ? 'Pendiente' : h.estado === 'ASIGNADA' ? 'Asignada' : 'Resuelta';
        html += (
            '<div class="timeline-step active">' +
                '<div class="timeline-dot"><i class="fas fa-check" style="font-size:0.75rem;"></i></div>' +
                '<div class="timeline-label">' + estadoLabel + '</div>' +
                '<div class="text-sm text-muted">' + formatDateTime(h.fecha) + '</div>' +
                (h.responsable ? '<div class="text-sm text-muted">Por: ' + h.responsable.nombre + '</div>' : '') +
                (h.observacion ? '<div style="margin-top:5px; font-size:0.875rem; color:var(--gray-600);">' + h.observacion + '</div>' : '') +
            '</div>'
        );
    });
    html += '</div>';
    contenedor.innerHTML = html;
}

function renderEvidencias(evidencias) {
    var divResidente = document.getElementById('evidenciasResidente');
    var divAdmin = document.getElementById('evidenciasAdmin');
    if (!divResidente || !divAdmin) return;

    var peticionId = window._peticionId;
    var esAdmin = localStorage.getItem('userRole') === 'ADMIN';
    var residente = evidencias.filter(function(e) { return e.subidaPor === 'RESIDENTE'; });
    var admin = evidencias.filter(function(e) { return e.subidaPor === 'ADMIN'; });

    function itemEv(ev) {
        var esImagen = ev.url && /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(ev.url);
        if (esImagen) {
            return '<a href="' + ev.url + '" target="_blank">' +
                '<img src="' + ev.url + '" style="width:100px; height:100px; object-fit:cover; border-radius:6px; border:1px solid var(--gray-200);" title="' + (ev.nombreArchivo || '') + '">' +
                '</a>';
        }
        return '<a href="' + ev.url + '" target="_blank" style="display:flex; align-items:center; gap:6px; padding:8px 12px; background:var(--gray-100); border-radius:6px; font-size:0.875rem; color:var(--primary); text-decoration:none;">' +
            '<i class="fas fa-file"></i> ' + (ev.nombreArchivo || 'Archivo') + '</a>';
    }

    // Residente — sin cambios de comportamiento
    if (residente.length === 0) {
        divResidente.innerHTML = '<p style="color:var(--gray-500);">El residente no adjuntó evidencias.</p>';
    } else {
        var hr = '<div style="display:flex; flex-wrap:wrap; gap:12px;">';
        residente.forEach(function(ev) { hr += itemEv(ev); });
        divResidente.innerHTML = hr + '</div>';
    }

    // Admin — con botón Eliminar por evidencia y botón Subir al final
    var ha = '';
    if (admin.length === 0) {
        ha += '<p style="color:var(--gray-500);">El administrador no ha adjuntado evidencias.</p>';
    } else {
        ha += '<div style="display:flex; flex-wrap:wrap; gap:16px; align-items:flex-start;">';
        admin.forEach(function(ev) {
            var pid = encodeURIComponent(ev.publicId || '');
            ha += '<div style="display:flex; flex-direction:column; align-items:center; gap:6px;">';
            ha += itemEv(ev);
            if (esAdmin && ev.publicId) {
                ha += '<button class="btn btn-sm btn-danger" onclick="eliminarEvidenciaAdmin(\'' + peticionId + '\', \'' + pid + '\')">' +
                    '<i class="fas fa-trash"></i> Eliminar</button>';
            }
            ha += '</div>';
        });
        ha += '</div>';
    }
    if (esAdmin) {
        ha += '<div style="margin-top:16px;">' +
            '<button class="btn btn-sm btn-primary" id="btnSubirEvidenciaAdmin" onclick="document.getElementById(\'inputEvidenciaAdmin\').click()">' +
            '<i class="fas fa-upload"></i> Subir evidencia</button>' +
            '</div>';
    }
    divAdmin.innerHTML = ha;
}

async function eliminarEvidenciaAdmin(peticionId, publicIdEncoded) {
    if (!confirm('¿Eliminar esta evidencia?')) return;
    try {
        await apiFetch('/api/peticiones/' + peticionId + '/evidencias/' + publicIdEncoded, { method: 'DELETE' });
        cargarPeticion(peticionId);
    } catch (err) {
        showMsg('alertBox', 'Error al eliminar la evidencia: ' + err.message, 'danger');
    }
}

async function subirEvidenciaAdmin(file) {
    var btn = document.getElementById('btnSubirEvidenciaAdmin');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...'; }
    try {
        var token = localStorage.getItem('token');
        var formData = new FormData();
        formData.append('file', file);
        formData.append('peticionId', window._peticionId);
        var res = await fetch(API_BASE + '/api/upload/evidencia', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        if (!res.ok) {
            var data = await res.json();
            throw new Error(data.error || 'Error al subir el archivo');
        }
        cargarPeticion(window._peticionId);
    } catch (err) {
        showMsg('alertBox', 'Error al subir la evidencia: ' + err.message, 'danger');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-upload"></i> Subir evidencia'; }
    }
}

function renderRespuestas(respuestas, peticionId) {
    var contenedor = document.getElementById('respuestasContenido');
    if (respuestas.length === 0) {
        contenedor.innerHTML = '<p style="color:var(--gray-500);">Aún no hay respuestas para esta petición.</p>';
        return;
    }
    var esAdmin = localStorage.getItem('userRole') === 'ADMIN';
    var html = '';
    respuestas.forEach(function(r) {
        var iniciales = r.miembroNombre
            ? r.miembroNombre.split(' ').map(function(n) { return n[0]; }).join('').substring(0, 2).toUpperCase()
            : 'AD';
        var respuestaId = r.id || '';

        html += (
            '<div class="response-card" id="card-' + respuestaId + '">' +
                '<div class="response-header">' +
                    '<div class="response-author">' +
                        '<div class="response-avatar">' + iniciales + '</div>' +
                        '<div class="response-author-info">' +
                            '<div class="response-author-name">' + (r.miembroNombre || 'Administrador') + '</div>' +
                            '<div class="response-author-role">Administrador PQRS</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; align-items:center; gap:10px;">' +
                        '<div class="response-date">' + formatDateTime(r.fecha) + '</div>' +
                        (esAdmin && respuestaId
                            ? '<button class="btn btn-sm btn-secondary" onclick="iniciarEdicionRespuesta(\'' + peticionId + '\', \'' + respuestaId + '\')" id="btnEditar-' + respuestaId + '">' +
                              '<i class="fas fa-edit"></i> Editar</button>'
                            : '') +
                    '</div>' +
                '</div>' +
                '<div class="response-body" id="body-' + respuestaId + '"><p>' + r.texto + '</p></div>' +
            '</div>'
        );
    });
    contenedor.innerHTML = html;
}

function iniciarEdicionRespuesta(peticionId, respuestaId) {
    var body = document.getElementById('body-' + respuestaId);
    var btnEditar = document.getElementById('btnEditar-' + respuestaId);
    if (!body) return;

    var textoActual = body.querySelector('p').textContent;
    body.innerHTML =
        '<textarea id="textarea-' + respuestaId + '" style="width:100%; min-height:100px; padding:8px; border:1px solid var(--gray-300); border-radius:6px; font-size:0.95rem; resize:vertical;">' + textoActual + '</textarea>' +
        '<div style="display:flex; gap:8px; margin-top:8px;">' +
            '<button class="btn btn-sm btn-primary" onclick="guardarEdicionRespuesta(\'' + peticionId + '\', \'' + respuestaId + '\')"><i class="fas fa-save"></i> Guardar</button>' +
            '<button class="btn btn-sm btn-secondary" onclick="cancelarEdicionRespuesta(\'' + respuestaId + '\', \'' + textoActual.replace(/'/g, "\\'") + '\')"><i class="fas fa-times"></i> Cancelar</button>' +
        '</div>';
    if (btnEditar) btnEditar.style.display = 'none';
}

function cancelarEdicionRespuesta(respuestaId, textoOriginal) {
    var body = document.getElementById('body-' + respuestaId);
    var btnEditar = document.getElementById('btnEditar-' + respuestaId);
    if (body) body.innerHTML = '<p>' + textoOriginal + '</p>';
    if (btnEditar) btnEditar.style.display = '';
}

async function guardarEdicionRespuesta(peticionId, respuestaId) {
    var textarea = document.getElementById('textarea-' + respuestaId);
    if (!textarea) return;
    var nuevoTexto = textarea.value.trim();
    if (!nuevoTexto) { showMsg('alertBox', 'La respuesta no puede estar vacía.', 'danger'); return; }

    try {
        await apiFetch('/api/peticiones/' + peticionId + '/respuestas/' + respuestaId, {
            method: 'PUT',
            body: JSON.stringify({ texto: nuevoTexto })
        });
        cargarPeticion(peticionId);
    } catch (err) {
        showMsg('alertBox', 'Error al guardar la respuesta: ' + err.message, 'danger');
    }
}

async function eliminarPeticion() {
    if (!confirm('¿Eliminar esta petición? Esta acción no se puede deshacer.')) return;
    try {
        await apiFetch('/api/peticiones/' + window._peticionId, { method: 'DELETE' });
        window.location.href = 'dashboard-ciudadano.html';
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al eliminar la petición.', 'danger');
    }
}

