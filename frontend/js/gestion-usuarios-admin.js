var todosLosUsuarios = [];

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(true)) return;
    loadUserInitial();
    cargarUsuarios();
});

async function cargarUsuarios() {
    try {
        todosLosUsuarios = await apiFetch('/api/miembros');
        renderTabla(todosLosUsuarios);
        var conMudanza = todosLosUsuarios.filter(function(m) { return m.notificaMudanza && m.activo; });
        if (conMudanza.length > 0) {
            mostrarModalMudanza(conMudanza);
        }
    } catch (err) {
        showMsg('alertBox', 'Error al cargar los usuarios: ' + err.message, 'danger');
    }
}

function filtrarUsuarios() {
    var busqueda = document.getElementById('searchUsuarios').value.toLowerCase();
    var rol = document.getElementById('filtroRol').value;
    var filtrados = todosLosUsuarios.filter(function(m) {
        var nombre = ((m.nombreMiembro || '') + ' ' + (m.apellidoMiembro || '')).toLowerCase();
        var correo = (m.correoMiembro || '').toLowerCase();
        var coincideTexto = !busqueda || nombre.includes(busqueda) || correo.includes(busqueda);
        var coincideRol = !rol || m.rol === rol;
        return coincideTexto && coincideRol;
    });
    renderTabla(filtrados);
}

function renderTabla(lista) {
    var miId = localStorage.getItem('miembroId');
    var html = lista.map(function(m) {
        var esSuspendido = m.activo === false;
        var esYo = m.id === miId;
        return (
            '<tr>' +
                '<td style="padding:15px 20px; font-weight:600;">' + (m.nombreMiembro || '') + ' ' + (m.apellidoMiembro || '') + '</td>' +
                '<td style="padding:15px 20px; color:var(--gray-600);">' + (m.correoMiembro || '') + '</td>' +
                '<td style="padding:15px 20px;">' +
                    '<span class="badge ' + (m.rol === 'ADMIN' ? 'badge-primary' : 'badge-gray') + '">' +
                        (m.rol === 'ADMIN' ? 'Administrador' : 'Residente') +
                    '</span>' +
                '</td>' +
                '<td style="padding:15px 20px;">' +
                    '<span class="badge ' + (esSuspendido ? 'badge-danger' : 'badge-success') + '">' +
                        (esSuspendido ? 'Suspendido' : 'Activo') +
                    '</span>' +
                '</td>' +
                '<td style="padding:15px 20px;">' +
                    (esYo
                        ? '<span style="color:var(--gray-400); font-size:0.875rem;">Tú</span>'
                        : '<div style="display:flex; gap:8px; flex-wrap:wrap;">' +
                              '<button class="btn btn-sm btn-secondary" onclick="cambiarRol(\'' + m.id + '\', \'' + m.rol + '\')" title="' + (m.rol === 'ADMIN' ? 'Hacer Residente' : 'Hacer Admin') + '">' +
                                  '<i class="fas fa-exchange-alt"></i> ' + (m.rol === 'ADMIN' ? 'Residente' : 'Admin') +
                              '</button>' +
                              '<button class="btn btn-sm ' + (esSuspendido ? 'btn-primary' : 'btn-warning') + '" onclick="suspenderUsuario(\'' + m.id + '\', ' + esSuspendido + ')">' +
                                  '<i class="fas fa-' + (esSuspendido ? 'user-check' : 'user-slash') + '"></i> ' + (esSuspendido ? 'Activar' : 'Suspender') +
                              '</button>' +
                              '<button class="btn btn-sm btn-danger" onclick="eliminarUsuario(\'' + m.id + '\', \'' + (m.nombreMiembro || '') + '\')">' +
                                  '<i class="fas fa-trash"></i>' +
                              '</button>' +
                          '</div>'
                    ) +
                '</td>' +
            '</tr>'
        );
    }).join('');
    document.getElementById('tablaUsuarios').innerHTML = html || '<tr><td colspan="5" style="padding:30px; text-align:center; color:var(--gray-500);">No hay usuarios.</td></tr>';
}

async function cambiarRol(id, rolActual) {
    var nuevoRol = rolActual === 'ADMIN' ? 'RESIDENTE' : 'ADMIN';
    var label = nuevoRol === 'ADMIN' ? 'Administrador' : 'Residente';
    if (!confirm('¿Cambiar el rol de este usuario a ' + label + '?')) return;
    try {
        await apiFetch('/api/miembros/' + id + '/rol', {
            method: 'PUT',
            body: JSON.stringify({ rol: nuevoRol })
        });
        showMsg('alertBox', 'Rol actualizado correctamente.', 'success');
        cargarUsuarios();
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al cambiar el rol.', 'danger');
    }
}

async function suspenderUsuario(id, esSuspendido) {
    var accion = esSuspendido ? 'activar' : 'suspender';
    if (!confirm('¿Deseas ' + accion + ' este usuario?')) return;
    try {
        // Si está suspendido (activo=false) → activar (activo=true) y viceversa
        var nuevoEstado = !esSuspendido;
        await apiFetch('/api/miembros/' + id + '/suspender', {
            method: 'PUT',
            body: JSON.stringify({ activo: nuevoEstado })
        });
        showMsg('alertBox', 'Usuario ' + (nuevoEstado ? 'activado' : 'suspendido') + ' correctamente.', 'success');
        cargarUsuarios();
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al cambiar el estado del usuario.', 'danger');
    }
}

async function eliminarUsuario(id, nombre) {
    if (!confirm('¿Eliminar permanentemente a ' + nombre + '? Esta acción no se puede deshacer.')) return;
    try {
        await apiFetch('/api/miembros/' + id, { method: 'DELETE' });
        showMsg('alertBox', 'Usuario eliminado correctamente.', 'success');
        cargarUsuarios();
    } catch (err) {
        showMsg('alertBox', err.message || 'Error al eliminar el usuario.', 'danger');
    }
}

function mostrarModalMudanza(usuarios) {
    var existente = document.getElementById('modalMudanza');
    if (existente) existente.remove();

    var lista = usuarios.map(function(u) {
        return '<div style="padding:10px 0; border-bottom:1px solid var(--gray-200);">' +
            '<div style="font-weight:600; color:var(--gray-800);">' + (u.nombreMiembro || '') + ' ' + (u.apellidoMiembro || '') + '</div>' +
            '<div style="color:var(--gray-500); font-size:0.9rem;">' + (u.correoMiembro || '') + '</div>' +
        '</div>';
    }).join('');

    var modal = document.createElement('div');
    modal.id = 'modalMudanza';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;';
    modal.innerHTML =
        '<div style="background:white; border-radius:12px; padding:40px; width:100%; max-width:480px; box-shadow:0 20px 60px rgba(0,0,0,0.3);">' +
            '<div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">' +
                '<div style="width:48px; height:48px; border-radius:50%; background:rgba(255,193,7,0.15); display:flex; align-items:center; justify-content:center;">' +
                    '<i class="fas fa-exclamation-triangle" style="color:var(--warning); font-size:1.25rem;"></i>' +
                '</div>' +
                '<div>' +
                    '<h3 style="margin:0; font-size:1.25rem; color:var(--gray-900);">Advertencia de Mudanza</h3>' +
                    '<p style="margin:0; color:var(--gray-500); font-size:0.9rem;">Usuarios que han notificado su mudanza</p>' +
                '</div>' +
            '</div>' +
            '<p style="color:var(--gray-600); margin-bottom:16px;">Los siguientes usuarios ya <strong>no se encuentran viviendo en el barrio Policarpa</strong>. Puede proceder con la suspensión o eliminación de sus cuentas:</p>' +
            '<div style="max-height:200px; overflow-y:auto; margin-bottom:24px;">' + lista + '</div>' +
            '<button type="button" onclick="document.getElementById(\'modalMudanza\').remove()" class="btn btn-primary" style="width:100%;">' +
                '<i class="fas fa-check"></i> Entendido, revisar usuarios' +
            '</button>' +
        '</div>';

    document.body.appendChild(modal);
}
