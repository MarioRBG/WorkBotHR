function completarCapacitacion(id) {
    fetch(`/completar/${id}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById(`info-${id}`).remove();
        });
    return false;
}