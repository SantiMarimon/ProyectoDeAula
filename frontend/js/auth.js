function requireAuth(adminOnly) {
    if (!localStorage.getItem('token')) {
        window.location.href = 'index.html';
        return false;
    }
    if (adminOnly && localStorage.getItem('userRole') !== 'ADMIN') {
        window.location.href = 'dashboard-ciudadano.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}



function showMsg(boxId, msg, type) {
    var box = document.getElementById(boxId || 'alertBox');
    if (!box) return;
    var t = type || 'danger';
    var icono = t === 'success' ? 'check-circle' : 'exclamation-circle';
    box.style.display = '';
    box.innerHTML = '<div class="alert alert-' + t + '"><i class="fas fa-' + icono + '"></i> ' + msg + '</div>';
}

function hideMsg(boxId) {
    var box = document.getElementById(boxId || 'alertBox');
    if (box) box.style.display = 'none';
}
