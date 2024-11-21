document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const filter = searchInput.value.toLowerCase();
        const tableBody = document.getElementById('nominaTableBody');
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(function(row) {
            const cells = row.getElementsByTagName('td');
            let match = false;

            Array.from(cells).forEach(function(cell) {
                if (cell.textContent.toLowerCase().includes(filter)) {
                    match = true;
                }
            });

            if (match) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});
