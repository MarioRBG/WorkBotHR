document.addEventListener('DOMContentLoaded', function() {
    // Cargar la foto de perfil desde localStorage
    const fotoGuardada = localStorage.getItem('fotoPerfil');
    if (fotoGuardada) {
        document.getElementById('foto-perfil').src = fotoGuardada;
    }

    // Incrementar y mostrar el contador de inicio de sesión
    let sesionContador = parseInt(localStorage.getItem('sesionContador')) || 0;
    sesionContador++;
    localStorage.setItem('sesionContador', sesionContador);
    document.getElementById('contadorSesion').textContent = `Has iniciado sesión ${sesionContador} veces.`;
});

function cambiarFoto() {
    const inputFoto = document.getElementById('foto-nueva');
    const archivo = inputFoto.files[0];
    
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            const urlFoto = e.target.result;
            document.getElementById('foto-perfil').src = urlFoto; // Cambiar la imagen en la página
            localStorage.setItem('fotoPerfil', urlFoto); // Guardar en localStorage
        };
        lector.readAsDataURL(archivo);
    } else {
        alert("Por favor, selecciona una foto.");
    }
}

function guardarCambios() {
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const correoElectronico = document.getElementById('correoElectronico').value;
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;

    if (nombreCompleto) localStorage.setItem('nombreCompleto', nombreCompleto);
    if (correoElectronico) localStorage.setItem('correoElectronico', correoElectronico);
    if (nuevaContrasena) localStorage.setItem('contrasena', nuevaContrasena);

    alert("Los cambios se han guardado exitosamente.");
}

// header

document.addEventListener('DOMContentLoaded', function() {
    // Cargar la foto de perfil y nombre completo desde localStorage en la página de configuración
    const fotoGuardada = localStorage.getItem('fotoPerfil');
    const nombreGuardado = localStorage.getItem('nombreCompleto');
    
    if (fotoGuardada) {
        document.getElementById('foto-perfil').src = fotoGuardada;
    }
    if (nombreGuardado) {
        document.getElementById('nombreCompleto').value = nombreGuardado;
    }

    // Incrementar y mostrar el contador de inicio de sesión
    let sesionContador = parseInt(localStorage.getItem('sesionContador')) || 0;
    sesionContador++;
    localStorage.setItem('sesionContador', sesionContador);
    document.getElementById('contadorSesion').textContent = `Has iniciado sesión ${sesionContador} veces.`;

    // Actualizar el header al cargar la página
    actualizarHeader();
});

// Función para cambiar la foto de perfil y guardarla en localStorage
function cambiarFoto() {
    const inputFoto = document.getElementById('foto-nueva');
    const archivo = inputFoto.files[0];
    
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            const urlFoto = e.target.result;
            document.getElementById('foto-perfil').src = urlFoto; // Cambiar la imagen en la página
            localStorage.setItem('fotoPerfil', urlFoto); // Guardar en localStorage
            actualizarHeader(); // Actualizar el header automáticamente
        };
        lector.readAsDataURL(archivo);
    } else {
        alert("Por favor, selecciona una foto.");
    }
}

// Función para guardar el nombre completo en localStorage
function guardarCambios() {
    const nombreCompleto = document.getElementById('nombreCompleto').value;
    const correoElectronico = document.getElementById('correoElectronico').value;
    const nuevaContrasena = document.getElementById('nuevaContrasena').value;

    if (nombreCompleto) localStorage.setItem('nombreCompleto', nombreCompleto);
    if (correoElectronico) localStorage.setItem('correoElectronico', correoElectronico);
    if (nuevaContrasena) localStorage.setItem('contrasena', nuevaContrasena);

    alert("Los cambios se han guardado exitosamente.");
    actualizarHeader(); // Actualizar el header automáticamente con el nuevo nombre
}

// Función para actualizar el header con la nueva foto de perfil y nombre
function actualizarHeader() {
    const nombreGuardado = localStorage.getItem('nombreCompleto');
    const fotoGuardada = localStorage.getItem('fotoPerfil');

    // Actualizar el nombre en el header
    if (nombreGuardado) {
        const headerNombre = document.querySelector('#area_Dconfiguracion h2');
        if (headerNombre) headerNombre.textContent = nombreGuardado;
    }

    // Actualizar la foto en el header
    if (fotoGuardada) {
        const headerFoto = document.querySelector('#usuarioP img');
        if (headerFoto) headerFoto.src = fotoGuardada;
    }
}

function cerrarSesion() {
    window.location.href = "/login";
}