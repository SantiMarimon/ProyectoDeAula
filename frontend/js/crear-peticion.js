var archivosSeleccionados = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(false)) return;
    setTimeout(loadUserInitial, 100);
    setupFileUpload();
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
        if (file.size > 10 * 1024 * 1024) {
            showMsg('alertBox', 'El archivo "' + file.name + '" supera 10MB.', 'danger');
            return;
        }
        archivosSeleccionados.push(file);
        var lista = document.getElementById('fileList');
        var item = document.createElement('div');
        item.className = 'file-item';
        item.dataset.nombre = file.name;
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

async function enviarPeticion() {
    hideMsg('alertBox');

    var tipo = document.getElementById('petitionType').value;
    var asunto = document.getElementById('subject').value.trim();
    var desc = document.getElementById('description').value.trim();

    if (!tipo) { showMsg('alertBox', 'Selecciona el tipo de petición.', 'danger'); return; }
    if (!asunto) { showMsg('alertBox', 'Escribe el asunto de tu petición.', 'danger'); return; }
    if (!desc) { showMsg('alertBox', 'Escribe la descripción de tu petición.', 'danger'); return; }

    var btn = document.getElementById('btnEnviar');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        var cuerpo = {
            tipoPeticion: tipo,
            asunto: asunto,
            descripcion: desc,
            area: document.getElementById('department').value || null,
            ubicacion: document.getElementById('location').value.trim() || null,
            fechaHecho: document.getElementById('incidentDate').value || null,
            personaInvolucrada: document.getElementById('personInvolved').value.trim() || null,
            contactoNombre: document.getElementById('contactName').value.trim() || null,
            contactoEmail: document.getElementById('contactEmail').value.trim() || null,
            contactoTelefono: document.getElementById('contactPhone').value.trim() || null
        };

        var peticion = await apiFetch('/api/peticiones', {
            method: 'POST',
            body: JSON.stringify(cuerpo)
        });

        if (archivosSeleccionados.length > 0) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo archivos...';
            var token = localStorage.getItem('token');
            for (var i = 0; i < archivosSeleccionados.length; i++) {
                try {
                    var formData = new FormData();
                    formData.append('file', archivosSeleccionados[i]);
                    formData.append('peticionId', peticion.id);
                    var res = await fetch(API_BASE + '/api/upload/evidencia', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + token },
                        body: formData
                    });
                    if (!res.ok) console.warn('No se pudo subir:', archivosSeleccionados[i].name);
                    else await res.json();
                } catch (e) {
                    console.warn('Error subiendo archivo:', archivosSeleccionados[i].name, e);
                }
            }
        }

        window.location.href = 'dashboard-ciudadano.html';

    } catch (err) {
        showMsg('alertBox', err.message || 'Error al enviar la petición.', 'danger');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Petición';
    }
}

function cancelar() {
    if (confirm('¿Cancelar? Se perderán los cambios.')) {
        window.location.href = 'dashboard-ciudadano.html';
    }
}
