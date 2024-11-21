document.addEventListener("DOMContentLoaded", function() {
    // Cargar la foto de perfil y el nombre completo desde localStorage en el header
    const nombreGuardado = localStorage.getItem('nombreCompleto');
    const fotoGuardada = localStorage.getItem('fotoPerfil');
    
    if (nombreGuardado) {
        document.querySelector('#area_Dconfiguracion h2').textContent = nombreGuardado;
    }
    
    if (fotoGuardada) {
        document.querySelector('#usuarioP img').src = fotoGuardada;
    }
});
