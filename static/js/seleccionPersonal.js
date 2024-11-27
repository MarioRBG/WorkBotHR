function agregarDatos() {
    var nombre = document.getElementById("nombreInput").value;
    var cargo = document.getElementById("cargoInput").value;
    var area = document.getElementById("areaInput").value;
    var fecha = document.getElementById("fechaInput").value;
    var telefono = document.getElementById("telefonoInput").value;

    // Validar que todos los campos estén llenos
    if (nombre && cargo && area && fecha && telefono) {
        // Crear un objeto con los datos y el timestamp
        var datos = {
            nombre: nombre,
            cargo: cargo,
            area: area,
            fecha: fecha,
            telefono: telefono,
            timestamp: Date.now()
        };

        // Obtener datos anteriores en localStorage (si existen)
        let datosAlmacenados = JSON.parse(localStorage.getItem('entrevistas')) || [];

        // Agregar el nuevo dato al array
        datosAlmacenados.push(datos);

        // Guardar los datos actualizados en localStorage
        localStorage.setItem('entrevistas', JSON.stringify(datosAlmacenados));

        // Mostrar los datos en la caja de la página principal
        mostrarDatosEnCaja(datos);

        // Limpiar los campos de entrada
        document.getElementById("nombreInput").value = "";
        document.getElementById("cargoInput").value = "";
        document.getElementById("areaInput").value = "";
        document.getElementById("fechaInput").value = "";
        document.getElementById("telefonoInput").value = "";
    }
}

// Función para mostrar los datos en la caja dentro de la página principal (seleccion_de_personal.html)
function mostrarDatosEnCaja(datos) {
    var cajadeEntrevistas = document.getElementById("CajadeEntrevistas");

    var nuevaCaja = document.createElement("div");
    nuevaCaja.classList.add("caja1");

    var nombreDiv = document.createElement("div");
    nombreDiv.id = "Nombre";
    nombreDiv.textContent = "Nombre: " + datos.nombre;

    var cargoDiv = document.createElement("div");
    cargoDiv.id = "Cargo";
    cargoDiv.textContent = "Cargo: " + datos.cargo;

    var areaDiv = document.createElement("div");
    areaDiv.id = "Area";
    areaDiv.textContent = "Área: " + datos.area;

    var fechaDiv = document.createElement("div");
    fechaDiv.id = "Fecha";
    fechaDiv.textContent = "Fecha de la Entrevista: " + datos.fecha;

    var telefonoDiv = document.createElement("div");
    telefonoDiv.id = "Telefono";
    telefonoDiv.textContent = "Teléfono: " + datos.telefono;

    // Añadir los datos al div
    nuevaCaja.appendChild(nombreDiv);
    nuevaCaja.appendChild(cargoDiv);
    nuevaCaja.appendChild(areaDiv);
    nuevaCaja.appendChild(fechaDiv);
    nuevaCaja.appendChild(telefonoDiv);

    // Añadir la caja con los datos a la caja principal
    cajadeEntrevistas.appendChild(nuevaCaja);
}