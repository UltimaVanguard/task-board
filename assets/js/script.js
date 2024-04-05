const taskFormEl = $('#task-form');
const taskDisplayEl = $('#task-display');
const taskNameInputEl = $('#task-name');
const taskDueInputEl = $('#due-date');
const taskDescriptionEl = $('#description');
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    nextId = crypto.randomUUID();
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $('<div>');
    taskCard.addClass('card project-card draggable my-3');
    taskCard.attr('data-task-id', task.id);

    const cardHeader = $('<div>');
    cardHeader.addClass('h4 card-header');
    cardHeader.text(task.name);

    const cardBody = $('<div>');
    cardBody.addClass('card-body');

    const taskDueDate = $('<p>');
    taskDueDate.addClass('card-text');
    taskDueDate.text(task.dueDate);

    const taskDescription = $('<p>');
    taskDescription.addClass('card-text');
    taskDescription.text(task.description);

    const deleteBtn = $('<button>');
    deleteBtn.addClass('btn btn-danger btn-delete');
    deleteBtn.text('Delete');
    deleteBtn.attr('data-task-id', task.id);

    if (task.dueDate && task.status !== 'done') {
        const today = dayjs();
        const dueDate = dayjs(task.dueDate, 'MM/DD/YYYY');

        if (today.isSame(dueDate, 'day')) {
            taskCard.addClass('bg-warning text-white');
        } else if (today.isAfter(dueDate)) {
            taskCard.addClass('bg-danger text-white');
            deleteBtn.addClass('border-light');
        };
    };

    cardBody.append(taskDueDate, taskDescription, deleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let taskList = JSON.parse(localStorage.getItem('tasks'));
    
    if (!taskList) {
        taskList = [];
    }

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let task of taskList) {
        if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
        } else {
            doneList.append(createTaskCard(task));
        }
    }

    $(".draggable").draggable({ 
        opacity: 0.7, 
        zIndex: 100,
        helper: function(event) {
            const original = $(event.target).hasClass('ui-draggable')
                ? $(event.target)
                : $(event.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        }
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    if(!taskNameInputEl.val() || 
       !taskDueInputEl.val() || 
       !taskDescriptionEl.val()) {
         alert('Please finish filling out the form.');
         return;
    }

    generateTaskId();
    const taskName = taskNameInputEl.val();
    const taskDue = taskDueInputEl.val();
    const taskDescription = taskDescriptionEl.val();

    const newTask = {
        id: nextId,
        name: taskName,
        dueDate: taskDue,
        description: taskDescription,
        status: 'to-do',
    }

    let taskList = JSON.parse(localStorage.getItem('tasks'));
    if (!taskList) {
        taskList = [];
    }
    taskList.push(newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    taskNameInputEl.val('');
    taskDueInputEl.val('');
    taskDescriptionEl.val('');

    $('.modal').modal('hide');
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach((task, index) => {
        if(taskId === task.id) {
            tasks.splice(index, 1);
        };
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTaskList();
};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskList = JSON.parse(localStorage.getItem('tasks'));

    console.log(event);
    console.log(ui.draggable[0]);
    console.log(ui.draggable[0].dataset);
    const taskId = ui.draggable[0].dataset.taskId
    console.log(taskId);
    const newStatus = event.target.id;
    for (task of taskList) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    if (!taskList) {
        taskList = [];
    };

    taskFormEl.on('submit', handleAddTask);

    taskDisplayEl.on('click', '.btn-delete', handleDeleteTask);

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });
});
