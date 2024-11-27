document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    let empleados = JSON.parse(localStorage.getItem('empleados')) || [];

    // Referencias al DOM
    const formularioEmpleado = document.getElementById('formularioEmpleado');
    const cuerpoTabla = document.getElementById('cuerpoTabla');

    // Función para agregar un empleado
    function agregarEmpleado(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const departamento = document.getElementById('departamento').value;
        const tipoHorario = document.getElementById('tipoHorario').value;
        
        let horarios = generarHorarios(tipoHorario);

        const nuevoEmpleado = {
            id: Date.now(),
            nombre,
            departamento,
            tipoHorario,
            horarios
        };
        
        empleados.push(nuevoEmpleado);
        guardarEnLocalStorage();
        actualizarTablaHorarios();
        formularioEmpleado.reset();
    }

    // Función para guardar en localStorage
    function guardarEnLocalStorage() {
        localStorage.setItem('empleados', JSON.stringify(empleados));
    }

    // Función para generar horarios según el tipo
    function generarHorarios(tipo) {
        const horarios = {
            lunes: '',
            martes: '',
            miercoles: '',
            jueves: '',
            viernes: ''
        };

        switch(tipo) {
            case 'regular':
                horarios.lunes = '9:00 - 18:00';
                horarios.martes = '9:00 - 18:00';
                horarios.miercoles = '9:00 - 18:00';
                horarios.jueves = '9:00 - 18:00';
                horarios.viernes = '9:00 - 18:00';
                break;
            case 'rotativo':
                horarios.lunes = '7:00 - 16:00';
                horarios.martes = '14:00 - 23:00';
                horarios.miercoles = '22:00 - 7:00';
                horarios.jueves = '7:00 - 16:00';
                horarios.viernes = '14:00 - 23:00';
                break;
            case 'flexible':
                horarios.lunes = 'Flexible';
                horarios.martes = 'Flexible';
                horarios.miercoles = 'Flexible';
                horarios.jueves = 'Flexible';
                horarios.viernes = 'Flexible';
                break;
        }
        return horarios;
    }

    // Función para editar horario
    function editarHorario(id, dia) {
        const empleado = empleados.find(emp => emp.id === id);
        if (empleado && empleado.tipoHorario === 'flexible') {
            const nuevoHorario = prompt('Ingrese el nuevo horario (formato HH:MM - HH:MM):', empleado.horarios[dia]);
            if (nuevoHorario) {
                empleado.horarios[dia] = nuevoHorario;
                guardarEnLocalStorage();
                actualizarTablaHorarios();
            }
        }
    }

    // Función para actualizar la tabla de horarios
    function actualizarTablaHorarios() {
        cuerpoTabla.innerHTML = '';
        
        empleados.forEach(empleado => {
            const tr = document.createElement('tr');
            const esFlexible = empleado.tipoHorario === 'flexible';
            
            tr.innerHTML = `
                <td>${empleado.nombre}<br><small>${empleado.departamento}</small></td>
                <td class="${esFlexible ? 'horario-editable' : ''}" 
                    onclick="${esFlexible ? `editarHorario(${empleado.id}, 'lunes')` : ''}"
                    style="${esFlexible ? 'cursor: pointer;' : ''}">${empleado.horarios.lunes}</td>
                <td class="${esFlexible ? 'horario-editable' : ''}"
                    onclick="${esFlexible ? `editarHorario(${empleado.id}, 'martes')` : ''}"
                    style="${esFlexible ? 'cursor: pointer;' : ''}">${empleado.horarios.martes}</td>
                <td class="${esFlexible ? 'horario-editable' : ''}"
                    onclick="${esFlexible ? `editarHorario(${empleado.id}, 'miercoles')` : ''}"
                    style="${esFlexible ? 'cursor: pointer;' : ''}">${empleado.horarios.miercoles}</td>
                <td class="${esFlexible ? 'horario-editable' : ''}"
                    onclick="${esFlexible ? `editarHorario(${empleado.id}, 'jueves')` : ''}"
                    style="${esFlexible ? 'cursor: pointer;' : ''}">${empleado.horarios.jueves}</td>
                <td class="${esFlexible ? 'horario-editable' : ''}"
                    onclick="${esFlexible ? `editarHorario(${empleado.id}, 'viernes')` : ''}"
                    style="${esFlexible ? 'cursor: pointer;' : ''}">${empleado.horarios.viernes}</td>
            `;
            
            // Agregar botones de acción
            const tdAcciones = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.className = 'boton-eliminar';
            btnEliminar.onclick = () => eliminarEmpleado(empleado.id);
            tdAcciones.appendChild(btnEliminar);
            
            if (esFlexible) {
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'boton-editar';
                btnEditar.onclick = () => editarTodosLosHorarios(empleado.id);
                tdAcciones.appendChild(btnEditar);
            }
            
            tr.appendChild(tdAcciones);
            cuerpoTabla.appendChild(tr);
        });
    }

    // Función para editar todos los horarios de un empleado
    function editarTodosLosHorarios(id) {
        const empleado = empleados.find(emp => emp.id === id);
        if (empleado && empleado.tipoHorario === 'flexible') {
            const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
            dias.forEach(dia => {
                const nuevoHorario = prompt(`Ingrese el horario para ${dia} (formato HH:MM - HH:MM):`, empleado.horarios[dia]);
                if (nuevoHorario) {
                    empleado.horarios[dia] = nuevoHorario;
                }
            });
            guardarEnLocalStorage();
            actualizarTablaHorarios();
        }
    }

    // Función para eliminar empleado
    function eliminarEmpleado(id) {
        if (confirm('¿Está seguro de eliminar este empleado?')) {
            empleados = empleados.filter(emp => emp.id !== id);
            guardarEnLocalStorage();
            actualizarTablaHorarios();
        }
    }

    // Hacer las funciones disponibles globalmente
    window.editarHorario = editarHorario;
    window.eliminarEmpleado = eliminarEmpleado;
    window.editarTodosLosHorarios = editarTodosLosHorarios;

    // Event Listeners
    formularioEmpleado.addEventListener('submit', agregarEmpleado);

    // Inicializar la tabla
    actualizarTablaHorarios();
});