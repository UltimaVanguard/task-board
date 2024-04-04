// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Todo: create a function to create a task card
function createTaskCard(task) {

    const taskCard = $('<div>');
    taskCard.addClass('card project-card draggable my-3');
    taskCard.attr('task-id', task.id);

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
    deleteBtn.attr('task-id', task.id);

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
    taskCard.append(cardBody, cardHeader);

    return taskCard
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('task-id');
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

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
      });
});
