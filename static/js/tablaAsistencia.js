document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const btnNuevaEntrada = document.getElementById('btnNuevaEntrada');
    const entryForm = document.getElementById('entryForm');
    const btnGuardar = document.getElementById('btnGuardar');
    const btnCancelar = document.getElementById('btnCancelar');
    const tableBody = document.getElementById('tableBody');
    const filterDate = document.getElementById('filterDate');

    // Array para almacenar registros
    let registros = JSON.parse(localStorage.getItem('registros')) || [];

    // Mostrar/Ocultar formulario
    btnNuevaEntrada.addEventListener('click', () => {
        entryForm.classList.toggle('hidden');
        limpiarFormulario();
    });

    btnCancelar.addEventListener('click', () => {
        entryForm.classList.add('hidden');
        limpiarFormulario();
    });

    // Guardar nuevo registro
    btnGuardar.addEventListener('click', () => {
        const fecha = document.getElementById('fecha').value;
        const matricula = document.getElementById('matricula').value;
        const nombre = document.getElementById('nombre').value;
        const horaEntrada = document.getElementById('horaEntrada').value;
        const horaSalida = document.getElementById('horaSalida').value;

        if (!validarFormulario(fecha, matricula, nombre, horaEntrada, horaSalida)) {
            mostrarNotificacion('Por favor complete todos los campos correctamente', 'error');
            return;
        }

        const nuevoRegistro = {
            id: Date.now(),
            fecha,
            matricula,
            nombre,
            horaEntrada,
            horaSalida,
            totalHoras: calcularTotalHoras(horaEntrada, horaSalida)
        };

        registros.push(nuevoRegistro);
        guardarRegistros();
        actualizarTabla();
        entryForm.classList.add('hidden');
        limpiarFormulario();
        mostrarNotificacion('Registro guardado exitosamente', 'success');
    });

    // Filtrar registros
    filterDate.addEventListener('change', () => {
        actualizarTabla();
    });

    // Funciones auxiliares
    function calcularTotalHoras(entrada, salida) {
        const [horaEntrada, minEntrada] = entrada.split(':');
        const [horaSalida, minSalida] = salida.split(':');
        
        const totalMinutos = 
            (parseInt(horaSalida) * 60 + parseInt(minSalida)) - 
            (parseInt(horaEntrada) * 60 + parseInt(minEntrada));
        
        return Math.round(totalMinutos / 60) + ' horas';
    }

    function validarFormulario(fecha, matricula, nombre, horaEntrada, horaSalida) {
        return fecha && matricula && nombre && horaEntrada && horaSalida;
    }

    function limpiarFormulario() {
        document.getElementById('fecha').value = '';
        document.getElementById('matricula').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('horaEntrada').value = '';
        document.getElementById('horaSalida').value = '';
    }

    function guardarRegistros() {
        localStorage.setItem('registros', JSON.stringify(registros));
    }

    function actualizarTabla() {
        const filtroSeleccionado = filterDate.value;
        let registrosFiltrados = [...registros];

        if (filtroSeleccionado !== 'all') {
            const hoy = new Date();
            registrosFiltrados = registros.filter(registro => {
                const fechaRegistro = new Date(registro.fecha);
                switch (filtroSeleccionado) {
                    case 'today':
                        return fechaRegistro.toDateString() === hoy.toDateString();
                    case 'week':
                        const unaSemanaMenos = new Date(hoy.setDate(hoy.getDate() - 7));
                        return fechaRegistro >= unaSemanaMenos;
                    case 'month':
                        return fechaRegistro.getMonth() === hoy.getMonth() &&
                               fechaRegistro.getFullYear() === hoy.getFullYear();
                }
            });
        }

        tableBody.innerHTML = '';
        registrosFiltrados.forEach(registro => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatearFecha(registro.fecha)}</td>
                <td>${registro.matricula}</td>
                <td>${registro.nombre}</td>
                <td>${registro.horaEntrada}</td>
                <td>${registro.horaSalida}</td>
                <td>${registro.totalHoras}</td>
                <td>
                    <button class="btn-danger" onclick="eliminarRegistro(${registro.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    function mostrarNotificacion(mensaje, tipo) {
        // Implementar sistema de notificaciones aquí
        alert(mensaje);
    }

    // Función global para eliminar registros
    window.eliminarRegistro = (id) => {
        if (confirm('¿Está seguro de eliminar este registro?')) {
            registros = registros.filter(registro => registro.id !== id);
            guardarRegistros();
            actualizarTabla();
            mostrarNotificacion('Registro eliminado exitosamente', 'success');
        }
    };

    // Cargar registros iniciales
    actualizarTabla();
});