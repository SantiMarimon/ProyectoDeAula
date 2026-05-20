function toggleUserDropdown() {
    document.querySelector('.user-dropdown').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    if (!requireAuth(true)) return;
    loadUserInitial();
    cargarDatos();
    document.addEventListener('click', function(e) {
        var menu = document.querySelector('.user-menu');
        if (menu && !menu.contains(e.target)) {
            var dd = document.querySelector('.user-dropdown');
            if (dd) dd.classList.remove('active');
        }
    });
});

async function cargarDatos() {
    try {
        var stats = await apiFetch('/api/peticiones?modo=stats');
        var peticiones = stats.recientes || [];

        document.getElementById('statTotal').textContent = stats.total || 0;
        document.getElementById('statResueltas').textContent = stats.resueltas || 0;
        document.getElementById('statAsignadas').textContent = stats.asignadas || 0;
        document.getElementById('statPendientes').textContent = stats.pendientes || 0;

        var total = stats.total || 0;
        var pendientes = stats.pendientes || 0;
        var asignadas = stats.asignadas || 0;
        var resueltas = stats.resueltas || 0;

        renderResumenEstados(total, pendientes, asignadas, resueltas);
        renderResumenTipos(stats.porTipo || {});
        renderTablaRecientes(peticiones.slice(0, 5));

    } catch (err) {
        showMsg('alertBox', 'Error al cargar los datos: ' + err.message, 'danger');
    }
}

function barraProgreso(valor, total, color) {
    var pct = total > 0 ? Math.round((valor / total) * 100) : 0;
    return (
        '<div style="display:flex; justify-content:space-between; margin-bottom:4px;">' +
            '<span>' + pct + '%</span><span>' + valor + '</span>' +
        '</div>' +
        '<div style="background:var(--gray-200); border-radius:4px; height:8px; margin-bottom:16px;">' +
            '<div style="background:' + color + '; width:' + pct + '%; height:8px; border-radius:4px;"></div>' +
        '</div>'
    );
}

function renderResumenEstados(total, pendientes, asignadas, resueltas) {
    document.getElementById('resumenEstados').innerHTML = (
        '<div style="font-weight:600; color:var(--gray-700); margin-bottom:6px;">Pendiente</div>' +
        barraProgreso(pendientes, total, 'var(--warning)') +
        '<div style="font-weight:600; color:var(--gray-700); margin-bottom:6px;">Asignada</div>' +
        barraProgreso(asignadas, total, 'var(--primary)') +
        '<div style="font-weight:600; color:var(--gray-700); margin-bottom:6px;">Resuelta</div>' +
        barraProgreso(resueltas, total, 'var(--success)')
    );
}

var outsideLabelsPlugin = {
    id: 'outsideLabels',
    afterDatasetDraw: function(chart) {
        if (chart.config.type !== 'pie') return;
        var ctx = chart.ctx;
        var dataset = chart.data.datasets[0];
        var meta = chart.getDatasetMeta(0);
        var total = dataset.data.reduce(function(a, b) { return (a || 0) + (b || 0); }, 0);

        meta.data.forEach(function(arc, i) {
            var value = dataset.data[i] || 0;
            if (value === 0) return;

            var midAngle = (arc.startAngle + arc.endAngle) / 2;
            var cx = arc.x;
            var cy = arc.y;
            var outerRadius = arc.outerRadius;
            var isRight = Math.cos(midAngle) >= 0;

            // Punto en el borde del arco
            var x1 = cx + Math.cos(midAngle) * outerRadius;
            var y1 = cy + Math.sin(midAngle) * outerRadius;
            // Fin de línea diagonal (20px hacia afuera)
            var x2 = cx + Math.cos(midAngle) * (outerRadius + 20);
            var y2 = cy + Math.sin(midAngle) * (outerRadius + 20);
            // Fin de línea horizontal (10px)
            var x3 = x2 + (isRight ? 10 : -10);
            var y3 = y2;

            ctx.save();
            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            var pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            var label = chart.data.labels[i];
            ctx.fillStyle = '#374151';
            ctx.font = '12px sans-serif';
            ctx.textBaseline = 'middle';
            ctx.textAlign = isRight ? 'left' : 'right';
            ctx.fillText(label + ' ' + pct + '%', x3 + (isRight ? 4 : -4), y3);
            ctx.restore();
        });
    }
};

function renderResumenTipos(porTipo) {
    if (window.chartTipos) window.chartTipos.destroy();

    var total = (porTipo.PETICION || 0) + (porTipo.QUEJA || 0) + (porTipo.RECLAMO || 0) + (porTipo.SUGERENCIA || 0);

    var ctx = document.getElementById('graficaTipos').getContext('2d');
    window.chartTipos = new Chart(ctx, {
        type: 'pie',
        plugins: [outsideLabelsPlugin],
        data: {
            labels: ['Petición', 'Queja', 'Reclamo', 'Sugerencia'],
            datasets: [{
                data: [
                    porTipo.PETICION   || 0,
                    porTipo.QUEJA      || 0,
                    porTipo.RECLAMO    || 0,
                    porTipo.SUGERENCIA || 0
                ],
                backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981'],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 30 },
            animation: { duration: 600 },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { padding: 16, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var val = context.parsed;
                            var pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                            return ' ' + context.label + ': ' + val + ' peticiones (' + pct + '%)';
                        }
                    }
                }
            }
        }
    });
}

function renderTablaRecientes(lista) {
    if (lista.length === 0) {
        document.getElementById('tablaRecientes').innerHTML = '<tr><td colspan="7" style="padding:30px; text-align:center; color:var(--gray-500);">No hay peticiones.</td></tr>';
        return;
    }
    var filas = lista.map(function(p) {
        var desc = p.asunto || p.descripcion || '';
        var descCorta = desc.length > 40 ? desc.substring(0, 40) + '...' : desc;
        return (
            '<tr>' +
                '<td style="padding:15px 20px;"><strong>' + shortId(p.id) + '</strong></td>' +
                '<td style="padding:15px 20px; max-width:200px;">' + descCorta + '</td>' +
                '<td style="padding:15px 20px;">' + tipoBadge(p.tipoPeticion) + '</td>' +
                '<td style="padding:15px 20px;">' + (p.miembro ? p.miembro.nombre : '--') + '</td>' +
                '<td style="padding:15px 20px;">' + estadoBadge(p.estado) + '</td>' +
                '<td style="padding:15px 20px;">' +
                    formatDate(p.fechaCreacion) +
                    '<br><span style="font-size:0.8rem; color:var(--gray-500);">' + formatTime(p.fechaCreacion) + '</span>' +
                '</td>' +
                '<td style="padding:15px 20px;">' +
                    (p.estado !== 'RESUELTA'
                        ? '<button class="btn btn-sm btn-primary" onclick="window.location.href=\'responder-peticion.html?id=' + p.id + '\'" title="Responder"><i class="fas fa-reply"></i></button> '
                        : '') +
                    '<button class="btn btn-sm btn-secondary" onclick="window.location.href=\'ver-peticion.html?id=' + p.id + '\'" title="Ver"><i class="fas fa-eye"></i></button>' +
                '</td>' +
            '</tr>'
        );
    });
    document.getElementById('tablaRecientes').innerHTML = filas.join('');
}
