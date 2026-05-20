function switchTab(tab, btn) {
    document.querySelectorAll('.auth-tab-content').forEach(function(el) { el.classList.remove('active'); });
    document.querySelectorAll('.auth-tab').forEach(function(el) { el.classList.remove('active'); });
    document.getElementById(tab).classList.add('active');
    btn.classList.add('active');
    hideMsg();
}

function showMsg(msg, type) {
    var box = document.getElementById('alertBox');
    box.style.display = '';
    var icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    box.innerHTML = '<div class="alert alert-' + (type || 'danger') + '"><i class="fas fa-' + icon + '"></i> ' + msg + '</div>';
}

function hideMsg() {
    var box = document.getElementById('alertBox');
    box.style.display = 'none';
    box.innerHTML = '';
}

function guardarSesion(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', data.correo);
    localStorage.setItem('userRole', data.rol);
    localStorage.setItem('userName', data.nombre);
    localStorage.setItem('miembroId', data.miembroId);
}

async function cargarFotoPerfil() {
    try {
        var perfil = await apiFetch('/api/auth/mi-perfil');
        if (perfil && perfil.fotoPerfil) {
            localStorage.setItem('userFoto', perfil.fotoPerfil);
        } else {
            localStorage.removeItem('userFoto');
        }
    } catch(e) {
        localStorage.removeItem('userFoto');
    }
}

function redirigirPorRol(rol) {
    if (rol === 'ADMIN') {
        window.location.href = 'dashboard-admin.html';
    } else {
        window.location.href = 'dashboard-ciudadano.html';
    }
}

function abrirModalPassword() {
    document.getElementById('recCorreo').value = '';
    document.getElementById('recPassword').value = '';
    document.getElementById('recConfirm').value = '';
    hideModalMsg();
    document.getElementById('modalOlvidePassword').style.display = 'flex';
}

function cerrarModalPassword() {
    document.getElementById('modalOlvidePassword').style.display = 'none';
}

function showModalMsg(msg, type) {
    var box = document.getElementById('modalAlertBox');
    box.style.display = '';
    var icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    box.innerHTML = '<div class="alert alert-' + (type || 'danger') + '"><i class="fas fa-' + icon + '"></i> ' + msg + '</div>';
}

function hideModalMsg() {
    var box = document.getElementById('modalAlertBox');
    box.style.display = 'none';
    box.innerHTML = '';
}

async function cambiarPasswordRecuperacion() {
    hideModalMsg();
    var correo = document.getElementById('recCorreo').value.trim();
    var np = document.getElementById('recPassword').value;
    var cp = document.getElementById('recConfirm').value;

    if (!correo) { showModalMsg('Ingresa tu correo electrónico.', 'danger'); return; }
    if (!np) { showModalMsg('Ingresa la nueva contraseña.', 'danger'); return; }
    if (np.length < 6) { showModalMsg('La contraseña debe tener al menos 6 caracteres.', 'danger'); return; }
    if (np !== cp) { showModalMsg('Las contraseñas no coinciden.', 'danger'); return; }

    var btn = document.getElementById('btnCambiarPassword');
    btn.disabled = true;
    btn.textContent = 'Actualizando...';

    try {
        await apiFetch('/api/auth/recuperar-password', {
            method: 'POST',
            body: JSON.stringify({ correo: correo, nuevaPassword: np })
        });
        showModalMsg('Contraseña actualizada correctamente. Ya puedes iniciar sesión.', 'success');
        setTimeout(cerrarModalPassword, 2500);
    } catch (err) {
        var msg = err.message || 'Error al actualizar la contraseña.';
        if (msg.includes('404') || msg.toLowerCase().includes('registrado') || msg.includes('Correo no registrado')) {
            msg = 'El correo no está registrado en el sistema.';
        }
        showModalMsg(msg, 'danger');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Cambiar Contraseña';
    }
}

document.addEventListener('click', function(e) {
    var modal = document.getElementById('modalOlvidePassword');
    if (modal && modal.style.display !== 'none' && e.target === modal) {
        cerrarModalPassword();
    }
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMsg();
    var btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.textContent = 'Ingresando...';

    try {
        var data = await apiFetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                correo: document.getElementById('correo').value,
                password: document.getElementById('password').value
            })
        });
        guardarSesion(data);
        await cargarFotoPerfil();
        redirigirPorRol(data.rol);
    } catch (err) {
        showMsg(err.message || 'Correo o contraseña incorrectos', 'danger');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-arrow-right"></i> Ingresar';
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    hideMsg();

    var pass = document.getElementById('regPassword').value;
    var confirm = document.getElementById('confirmPassword').value;
    if (pass !== confirm) {
        showMsg('Las contraseñas no coinciden.', 'danger');
        return;
    }

    var btn = document.getElementById('btnRegister');
    btn.disabled = true;
    btn.textContent = 'Registrando...';

    try {
        var data = await apiFetch('/api/auth/registro', {
            method: 'POST',
            body: JSON.stringify({
                nombreMiembro: document.getElementById('nombre').value,
                apellidoMiembro: document.getElementById('apellido').value,
                telMiembro: document.getElementById('telefono').value,
                correoMiembro: document.getElementById('regCorreo').value,
                password: pass
            })
        });
        guardarSesion(data);
        await cargarFotoPerfil();
        localStorage.setItem('nuevoRegistro', 'true');
        redirigirPorRol(data.rol);
    } catch (err) {
        showMsg(err.message || 'Error al registrar. Verifica los datos.', 'danger');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Registrarse';
    }
});