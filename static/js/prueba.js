let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingIndex = -1;

function renderTasks() {
    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';
    tasks.forEach((task, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Completado">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="updateTask(${index}, 'completed', this.checked)">
            </td>
            <td data-label="Elemento" class="${task.completed ? 'completed' : ''}">${task.element}</td>
            <td data-label="Estado" class="${task.completed ? 'completed' : ''}">${task.status}</td>
            <td data-label="Prioridad" class="${task.completed ? 'completed' : ''}">${task.priority}</td>
            <td data-label="Fecha" class="${task.completed ? 'completed' : ''}">${task.date}</td>
            <td data-label="Acciones">
                <button onclick="editTask(${index})" class="edit-button">Editar</button>
                <button onclick="deleteTask(${index})" class="delete-button">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addTask() {
    const newTask = {
        completed: false,
        element: document.getElementById('newTaskElement').value,
        status: document.getElementById('newTaskStatus').value,
        priority: document.getElementById('newTaskPriority').value,
        date: document.getElementById('newTaskDate').value
    };
    if (editingIndex === -1) {
        tasks.push(newTask);
    } else {
        tasks[editingIndex] = newTask;
        editingIndex = -1;
        document.getElementById('saveTaskButton').textContent = 'Guardar';
    }
    saveTasks();
    renderTasks();
    resetForm();
}

function updateTask(index, field, value) {
    tasks[index][field] = value;
    saveTasks();
    renderTasks();
}

function editTask(index) {
    const task = tasks[index];
    document.getElementById('newTaskElement').value = task.element;
    document.getElementById('newTaskStatus').value = task.status;
    document.getElementById('newTaskPriority').value = task.priority;
    document.getElementById('newTaskDate').value = task.date;
    editingIndex = index;
    document.getElementById('saveTaskButton').textContent = 'Actualizar';
}

function deleteTask(index) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function resetForm() {
    document.getElementById('newTaskElement').value = '';
    document.getElementById('newTaskStatus').value = 'Pendiente';
    document.getElementById('newTaskPriority').value = 'Media';
    document.getElementById('newTaskDate').value = '';
}

document.getElementById('saveTaskButton').addEventListener('click', addTask);

renderTasks();