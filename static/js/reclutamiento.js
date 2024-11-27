function agregarDatos() {
    var area = document.getElementById("areaInput").value;
    var cargo = document.getElementById("cargoInput").value;

    // Solo agregar si ambos campos están llenos
    if (area && cargo) {
        // Crear una nueva caja para cada conjunto de datos
        var nuevaCaja = document.createElement("div");
        nuevaCaja.classList.add("caja"); // Establecer una clase para la nueva caja

        var areaDiv = document.createElement("div");
        var cargoDiv = document.createElement("div");

        areaDiv.id = "AREA";
        areaDiv.textContent = area;  // Aquí se agrega el texto del área

        cargoDiv.id = "CARGO";
        cargoDiv.textContent = "Área: " + cargo;  // Aquí se agrega el texto del cargo

        // Agregar los divs de área y cargo a la nueva caja
        nuevaCaja.appendChild(areaDiv);
        nuevaCaja.appendChild(cargoDiv);

        // Agregar la nueva caja a la caja principal
        document.getElementById("CajadeAspiranes").appendChild(nuevaCaja);

        // Guardar los datos en localStorage con un timestamp
        let datos = JSON.parse(localStorage.getItem('datos')) || [];
        datos.push({ area: area, cargo: cargo, timestamp: Date.now() });
        localStorage.setItem('datos', JSON.stringify(datos));

        // Limpiar los campos de entrada
        document.getElementById("areaInput").value = "";
        document.getElementById("cargoInput").value = "";
    }
}

function cargarDatos() {
    let datos = JSON.parse(localStorage.getItem('datos')) || [];

    const now = Date.now();
    // Filtrar los datos que tienen más de 24 horas
    datos = datos.filter(item => now - item.timestamp <= 24 * 60 * 60 * 1000);

    // Mostrar los datos guardados en nuevas cajas
    var cajadeAspiranes = document.getElementById("CajadeAspiranes");

    datos.forEach(item => {
        // Crear una nueva caja para cada conjunto de datos
        var nuevaCaja = document.createElement("div");
        nuevaCaja.classList.add("caja");

        var areaDiv = document.createElement("div");
        var cargoDiv = document.createElement("div");

        areaDiv.id = "AREA";
        areaDiv.textContent = item.area;

        cargoDiv.id = "CARGO";
        cargoDiv.textContent = "Área: " + item.cargo;

        // Agregar los divs de área y cargo a la nueva caja
        nuevaCaja.appendChild(areaDiv);
        nuevaCaja.appendChild(cargoDiv);

        // Agregar la nueva caja a la caja principal
        cajadeAspiranes.appendChild(nuevaCaja);
    });

    // Volver a guardar los datos filtrados en localStorage
    localStorage.setItem('datos', JSON.stringify(datos));
}

// Cargar los datos cuando la página se carga
window.onload = cargarDatos;