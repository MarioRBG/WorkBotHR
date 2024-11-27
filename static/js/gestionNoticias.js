function toggleContenido(elemento) {
    const contenidoExpandido = elemento.nextElementSibling;
    if (contenidoExpandido.style.display === 'block') {
        contenidoExpandido.style.display = 'none';
        elemento.textContent = 'Leer más';
    } else {
        contenidoExpandido.style.display = 'block';
        elemento.textContent = 'Leer menos';
    }
}

function agregarRecordatorio() {
    const input = document.getElementById('nuevoRecordatorio');
    const texto = input.value.trim();
    
    if (texto) {
        const lista = document.querySelector('.recordatorios-list');
        const nuevoLi = document.createElement('li');
        nuevoLi.innerHTML = texto + ' <span class="eliminar-recordatorio" onclick="eliminarRecordatorio(this)">×</span>';
        lista.appendChild(nuevoLi);
        input.value = '';
    }
}

function eliminarRecordatorio(elemento) {
    elemento.parentElement.remove();
}