function sortTable(columnIndex) {
    var table = document.getElementById("employeeTable");
    var rows = Array.prototype.slice.call(table.rows, 1);
    var isNumeric = !isNaN(rows[0].cells[columnIndex].innerText);

    rows.sort(function(a, b) {
        var cellA = a.cells[columnIndex].innerText.toLowerCase();
        var cellB = b.cells[columnIndex].innerText.toLowerCase();

        if (isNumeric) {
            return parseFloat(cellA) - parseFloat(cellB);
        } else {
            return cellA.localeCompare(cellB);
        }
    });

    rows.forEach(function(row) {
        table.appendChild(row);
    });
}
