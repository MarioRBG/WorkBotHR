
        document.addEventListener("DOMContentLoaded", function () {
            // Selecciona el campo de búsqueda y la lista de empleados
            const searchInput = document.getElementById("buscador");
            const empleados = document.querySelectorAll(".empleados_P");
    
            // Agrega el evento para filtrar empleados
            searchInput.addEventListener("input", function () {
                const searchValue = searchInput.value.toLowerCase();
    
                empleados.forEach((empleado) => {
                    const empleadoText = empleado.textContent.toLowerCase();
    
                    if (empleadoText.includes(searchValue)) {
                        empleado.style.display = ""; // Mostrar empleado
                    } else {
                        empleado.style.display = "none"; // Ocultar empleado
                    }
                });
            });
        });
