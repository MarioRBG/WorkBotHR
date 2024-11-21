let nominaData = [];

        function loadExcel() {
            const file = document.getElementById('excelFile').files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                nominaData = XLSX.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });

                // Limpieza de datos
                nominaData = nominaData.map(row => ({
                    Matricula: row.Matricula ? row.Matricula.trim() : '',
                    Empleado: row.Empleado ? row.Empleado.trim() : '',
                    Departamento: row.Departamento ? row.Departamento.trim() : '',
                    Fecha: row.Fecha ? row.Fecha : '',
                    HorasExtras: row.HorasExtras ? row.HorasExtras : 0,
                    Sueldo: row.Sueldo ? row.Sueldo : 0,
                    Estado: row.Estado ? row.Estado.trim() : '',
                }));

                renderTable();
                syncWithNomina();
            };

            reader.readAsArrayBuffer(file);
        }

        function renderTable() {
            const tbody = document.getElementById('nominaTableBody');
            tbody.innerHTML = '';
            nominaData.forEach((row) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${row.Matricula}</td>
                        <td>${row.Empleado}</td>
                        <td>${row.Departamento}</td>
                        <td>${row.Fecha}</td>
                        <td>${row.HorasExtras}</td>
                        <td>${row.Sueldo}</td>
                        <td>${row.Estado}</td>
                    `;
                tbody.appendChild(tr);
            });
        }

        function syncWithNomina() {
            localStorage.setItem('nominaData', JSON.stringify(nominaData));
        }

        document.getElementById('searchInput').addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            const filteredData = nominaData.filter(row =>
                Object.values(row).some(value =>
                    value.toString().toLowerCase().includes(searchTerm)
                )
            );
            renderFilteredTable(filteredData);
        });

        function renderFilteredTable(filteredData) {
            const tbody = document.getElementById('nominaTableBody');
            tbody.innerHTML = '';
            filteredData.forEach((row) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                        <td>${row.Matricula}</td>
                        <td>${row.Empleado}</td>
                        <td>${row.Departamento}</td>
                        <td>${row.Fecha}</td>
                        <td>${row.HorasExtras}</td>
                        <td>${row.Sueldo}</td>
                        <td>${row.Estado}</td>
                    `;
                tbody.appendChild(tr);
            });
        }