
function previewImage(event) {
    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(event.target.files[0]);
    preview.style.display = 'block';
}
    const matricula = Math.floor(Math.random() * 100000);

function eliminarCambios() {
    document.getElementById('creacionEmpleados').reset();
}

