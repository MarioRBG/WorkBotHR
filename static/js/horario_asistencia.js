// Ordenar por tabla horario de asistencia
function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch, orderSelect, columnIndex;
    table = document.getElementById("dataTable");
    switching = true;
    orderSelect = document.getElementById("orderSelect");
    columnIndex = orderSelect.value;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnIndex];
            y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}