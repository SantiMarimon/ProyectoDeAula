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
    if (!requireAuth(true)) return;
    loadUserInitial();
    cargarPerfilAdmin();
    cargarConfigJAC();

    document.getElementById('fotoInput').addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        subirFotoAdmin(file);
    });

    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

// ── PERFIL ADMIN ──────────────────────────────────────────────

async function subirFotoAdmin(file) {
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
        var av = document.getElementById('avatarGrande');
        av.innerHTML = '<img src="' + data.url + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
        showMsg('alertBox', 'Foto actualizada correctamente.', 'success');
    } catch (err) {
        showMsg('alertBox', err.message || 'No se pudo subir la foto.', 'danger');
    }
}

async function cargarPerfilAdmin() {
    try {
        var id = localStorage.getItem('miembroId');
        var m = await apiFetch('/api/miembros/' + id);
        if (m.fotoPerfil) {
            var av = document.getElementById('avatarGrande');
            av.innerHTML = '<img src="' + m.fotoPerfil + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
        } else {
            document.getElementById('avatarGrande').textContent = m.nombreMiembro ? m.nombreMiembro.charAt(0).toUpperCase() : 'A';
        }
        document.getElementById('nombreCompleto').textContent = (m.nombreMiembro || '') + ' ' + (m.apellidoMiembro || '');
        document.getElementById('correoLabel').textContent = m.correoMiembro || '';
        document.getElementById('firstName').value = m.nombreMiembro || '';
        document.getElementById('lastName').value = m.apellidoMiembro || '';
        document.getElementById('email').value = m.correoMiembro || '';
        document.getElementById('phone').value = m.telMiembro || '';
        document.getElementById('address').value = m.direccion || '';
    } catch (err) {
        showMsg('alertBox', 'Error al cargar el perfil: ' + err.message, 'danger');
    }
}

document.getElementById('perfilForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var id = localStorage.getItem('miembroId');
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
        var data = await apiFetch('/api/miembros/' + id, {
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
    var cp = document.getElementById('confirmPassword').value;
    if (np !== cp) { showMsg('alertBox', 'Las contraseñas no coinciden.', 'danger'); return; }
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Actualizando...';
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

async function eliminarCuenta() {
    if (!confirm('¿Estás seguro? Esta acción eliminará tu cuenta permanentemente.')) return;
    try {
        await apiFetch('/api/auth/mi-cuenta', { method: 'DELETE' });
        localStorage.clear();
        window.location.href = 'index.html';
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al eliminar la cuenta.', 'danger');
    }
}

// ── CONFIGURACIÓN JAC ─────────────────────────────────────────

async function cargarConfigJAC() {
    try {
        var config = await apiFetch('/api/configuracion');
        document.getElementById('jacNombre').value = config.nombreJac || '';
        document.getElementById('jacDireccion').value = config.direccion || '';
        document.getElementById('jacTelefono').value = config.telefono || '';
        document.getElementById('jacMensaje').value = config.mensajeBienvenida || '';
    } catch (err) {
        console.warn('No se pudo cargar la configuración JAC:', err.message);
    }
}

document.getElementById('jacForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = this.querySelector('[type="submit"]');
    btn.disabled = true; btn.textContent = 'Guardando...';
    try {
        await apiFetch('/api/configuracion', {
            method: 'PUT',
            body: JSON.stringify({
                nombreJac: document.getElementById('jacNombre').value.trim(),
                direccion: document.getElementById('jacDireccion').value.trim(),
                telefono: document.getElementById('jacTelefono').value.trim(),
                mensajeBienvenida: document.getElementById('jacMensaje').value.trim()
            })
        });
        showMsg('alertBox', 'Configuración de la JAC guardada correctamente.', 'success');
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al guardar la configuración.', 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save"></i> Guardar Configuración';
    }
});

