function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(false)) return;
    loadUserInitial();

    var rol = localStorage.getItem('userRole') || '';

    if (rol === 'ADMIN') {
        document.getElementById('navInicio').href = 'dashboard-admin.html';
        document.getElementById('navLink').href = 'dashboard-admin.html';
        document.getElementById('navLink').textContent = 'Dashboard';
    }

    cargarPerfil();
    cargarStats(rol);

    if (rol !== 'ADMIN') {
        var zona = document.getElementById('zonaPeligro');
        if (zona) zona.style.display = 'none';
    }

    document.getElementById('fotoInput').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        subirFoto(file);
    });

    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

async function subirFoto(file) {
    try {
        var formData = new FormData();
        formData.append('file', file);
        var token = localStorage.getItem('token');
        var resp = await fetch('/api/upload/foto-perfil', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token },
            body: formData
        });
        if (!resp.ok) throw new Error('Error al subir la foto');
        var data = await resp.json();
        actualizarAvatar(data.url);
        localStorage.setItem('userFoto', data.url);
        showMsg('alertBox', 'Foto actualizada correctamente.', 'success');
    } catch (err) {
        showMsg('alertBox', err.message || 'No se pudo subir la foto.', 'danger');
    }
   
}

function actualizarAvatar(url) {
    var av = document.getElementById('avatarGrande');
    av.style.background = 'none';
av.style.backgroundImage = 'none';
    av.innerHTML = '<img src="' + url + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';

    var avSmall = document.getElementById('userInitial');
    if (avSmall) {
        avSmall.closest('.user-avatar').style.padding = '0';
        avSmall.closest('.user-avatar').style.overflow = 'hidden';
        avSmall.closest('.user-avatar').innerHTML = '<img src="' + url + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
    }
}

async function cargarPerfil() {
    try {
        var m = await apiFetch('/api/auth/mi-perfil');
        if (m.fotoPerfil) {
            localStorage.setItem('userFoto', m.fotoPerfil);
            actualizarAvatar(m.fotoPerfil);
        } else {
            document.getElementById('avatarGrande').textContent = m.nombreMiembro ? m.nombreMiembro.charAt(0).toUpperCase() : 'U';
        }
        document.getElementById('nombreCompleto').textContent = (m.nombreMiembro || '') + ' ' + (m.apellidoMiembro || '');
        document.getElementById('correoLabel').textContent = m.correoMiembro || '';
        document.getElementById('rolLabel').textContent = m.rol === 'ADMIN' ? 'Administrador' : 'Residente';

        document.getElementById('firstName').value = m.nombreMiembro || '';
        document.getElementById('lastName').value = m.apellidoMiembro || '';
        document.getElementById('email').value = m.correoMiembro || '';
        document.getElementById('phone').value = m.telMiembro || '';
        document.getElementById('address').value = m.direccion || '';

        if (m.rol !== 'ADMIN' && !m.notificaMudanza) {
            var zona = document.getElementById('zonaMudanza');
            if (zona) zona.style.display = '';
        }
        if (m.notificaMudanza) {
            var zona = document.getElementById('zonaMudanza');
            if (zona) {
                zona.style.display = '';
                document.getElementById('btnMudanza').style.display = 'none';
                document.getElementById('alertMudanza').style.display = '';
                document.getElementById('alertMudanza').innerHTML =
                    '<div class="alert alert-warning">' +
                        '<i class="fas fa-clock"></i> ' +
                        'Ya has notificado tu mudanza. Un administrador revisará tu cuenta próximamente.' +
                    '</div>';
            }
        }
    } catch (err) {
        showMsg('alertBox', 'Error al cargar el perfil: ' + err.message, 'danger');
    }
}

async function cargarStats(rol) {
    try {
        var endpoint = rol === 'ADMIN' ? '/api/peticiones' : '/api/peticiones/mis-peticiones';
        var peticiones = await apiFetch(endpoint);
        document.getElementById('statTotal').textContent = peticiones.length;
        document.getElementById('statResueltas').textContent = peticiones.filter(function(p) { return p.estado === 'RESUELTA'; }).length;
        document.getElementById('statPendientes').textContent = peticiones.filter(function(p) { return p.estado === 'PENDIENTE'; }).length;
    } catch (err) {
        document.getElementById('statTotal').textContent = '--';
        document.getElementById('statResueltas').textContent = '--';
        document.getElementById('statPendientes').textContent = '--';
    }
}

document.getElementById('personalForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Guardando...';
    try {
        var data = await apiFetch('/api/auth/mi-perfil', {
            method: 'PUT',
            body: JSON.stringify({
                nombreMiembro: document.getElementById('firstName').value.trim(),
                apellidoMiembro: document.getElementById('lastName').value.trim(),
                correoMiembro: document.getElementById('email').value.trim(),
                telMiembro: document.getElementById('phone').value.trim(),
                direccion: document.getElementById('address').value.trim()
            })
        });
        localStorage.setItem('userName', data.nombreMiembro || document.getElementById('firstName').value.trim());
        showMsg('alertBox', 'Perfil actualizado correctamente.', 'success');
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al actualizar el perfil.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
});

document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var np = document.getElementById('newPassword').value;
    var cp = document.getElementById('confirmNewPassword').value;
    if (np !== cp) { showMsg('alertBox', 'Las contraseñas no coinciden.', 'danger'); return; }
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Actualizando...';
    try {
        await apiFetch('/api/auth/cambiar-password', {
            method: 'PUT',
            body: JSON.stringify({ nuevaPassword: np })
        });
        showMsg('alertBox', 'Contraseña actualizada correctamente.', 'success');
        this.reset();
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al cambiar la contraseña.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-key"></i> Actualizar Contraseña';
    }
});

function cancelEdit() {
    if (confirm('¿Descartar cambios?')) location.reload();
}

async function notificarMudanza() {
    if (!confirm('¿Confirma que desea notificar su mudanza del barrio Policarpa? Un administrador revisará su cuenta y podrá proceder con su suspensión o eliminación.')) return;
    var btn = document.getElementById('btnMudanza');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    try {
        await apiFetch('/api/auth/notificar-mudanza', { method: 'PUT' });
        document.getElementById('alertMudanza').style.display = '';
        document.getElementById('alertMudanza').innerHTML =
            '<div class="alert alert-success">' +
                '<i class="fas fa-check-circle"></i> ' +
                'Su notificación de mudanza ha sido registrada exitosamente. Un administrador de la JAC del Barrio Policarpa revisará su caso y se comunicará con usted sobre el estado de su cuenta.' +
            '</div>';
        btn.style.display = 'none';
    } catch (err) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-truck-moving"></i> Notificar Mudanza';
        document.getElementById('alertMudanza').style.display = '';
        document.getElementById('alertMudanza').innerHTML =
            '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> ' + (err.message || 'Error al registrar la notificación.') + '</div>';
    }
}
