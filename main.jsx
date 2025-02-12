const form = document.getElementById("form");
const textInput = document.getElementById("textInput");
const creationDateInput = document.getElementById("creationDateInput");
const dateInput = document.getElementById("dateInput");
const textarea = document.getElementById("textarea");
const taskMsg = document.getElementById("taskMsg");
const creationDateMsg = document.getElementById("creationDateMsg");
const dateMsg = document.getElementById("dateMsg");
const descriptionMsg = document.getElementById("descriptionMsg");
const add = document.getElementById("add");
const tasks = document.getElementById("tasks");

let data = [];

document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date().toISOString().split("T")[0];
  creationDateInput.min = currentDate;
  dateInput.min = currentDate;

  // Loading existing tasks from localStorage
  data = JSON.parse(localStorage.getItem("data")) || [];
  createTasks();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
  });

  const formModal = document.getElementById("form");
  formModal.addEventListener("show.bs.modal", resetForm);
});

let formValidation = () => {
  let isValid = true;

  if (textInput.value.trim() === "") {
    taskMsg.innerHTML = "Task cannot be empty";
    isValid = false;
  } else {
    taskMsg.innerHTML = "";
  }

  if (creationDateInput.value.trim() === "") {
    creationDateMsg.innerHTML = "Creation Date cannot be empty";
    isValid = false;
  } else {
    creationDateMsg.innerHTML = "";
  }

  if (dateInput.value.trim() === "") {
    dateMsg.innerHTML = "Due Date cannot be empty";
    isValid = false;
  } else {
    dateMsg.innerHTML = "";
  }

  if (textarea.value.trim() === "") {
    descriptionMsg.innerHTML = "Description cannot be empty";
    isValid = false;
  } else {
    descriptionMsg.innerHTML = "";
  }

  if (isValid) {
    acceptData();
    add.setAttribute("data-bs-dismiss", "modal");
    add.click();
    setTimeout(() => {
      add.setAttribute("data-bs-dismiss", "");
    }, 0);
  }
};

let acceptData = () => {
  const editedTaskIndex = parseInt(add.getAttribute("data-task-index"));
  if (
    editedTaskIndex !== null &&
    !isNaN(editedTaskIndex) &&
    editedTaskIndex >= 0
  ) {
    data[editedTaskIndex] = {
      text: textInput.value,
      creationDate: creationDateInput.value,
      date: dateInput.value,
      description: textarea.value,
    };
  } else {
    data.push({
      text: textInput.value,
      creationDate: creationDateInput.value,
      date: dateInput.value,
      description: textarea.value,
    });
  }

  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  const currentDate = new Date();

  data.forEach((x, y) => {
    const dueDate = new Date(x.date);
    let taskStyle = "";
    let creationDateStyle = "";
    let dueDateStyle = "color: red;";

    const deadlineDate = new Date(dueDate);
    deadlineDate.setHours(deadlineDate.getHours() + 24);

    if (deadlineDate < currentDate) {
      taskStyle = "background-color: red;";
      creationDateStyle = "color: white; background-color: red;";
      dueDateStyle = "color: white; background-color: red;";
    } else {
      taskStyle = "border: 2px solid green;"; // Add green border to active tasks
      creationDateStyle = "color: green;";
    }

    tasks.innerHTML += `
      <div id=${y} style="${taskStyle}">
        <span class="fw-bold" style="${
          deadlineDate < currentDate ? "color: white;" : ""
        }">${y + 1}. ${x.text}</span>
        <div style="${creationDateStyle}">Created: ${x.creationDate}</div>
        <div style="${dueDateStyle}">Due: ${x.date}</div>
        <p style="${deadlineDate < currentDate ? "color: white;" : ""}">${
      x.description
    }</p>
        <span class="options">
          <i onClick="editTask(${y})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick="deleteTask(${y})" class="fas fa-trash-alt"></i>
        </span>
      </div>
    `;
  });

  resetForm();
};

let resetForm = () => {
  textInput.value = "";
  creationDateInput.value = "";
  dateInput.value = "";
  textarea.value = "";
  add.removeAttribute("data-task-index"); // Clear the data-task-index attribute
};

let deleteTask = (taskId) => {
  data.splice(taskId, 1);
  localStorage.setItem("data", JSON.stringify(data));
  createTasks();
};

let editTask = (taskId) => {
  const selectedTask = data[taskId];
  textInput.value = selectedTask.text;
  creationDateInput.value = selectedTask.creationDate;
  dateInput.value = selectedTask.date;
  textarea.value = selectedTask.description;
  add.setAttribute("data-task-index", taskId); // Set the data-task-index attribute
};

const searchButton = document.querySelector(".btn-search");
const searchInput = document.querySelector(".input-search");
const tasksContainer = document.getElementById("tasks");

searchButton.addEventListener("click", () => {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const filteredTasks = data.filter((task) =>
    task.text.toLowerCase().includes(searchQuery)
  );
  displayTasks(filteredTasks);
});

function displayTasks(tasks) {
  tasksContainer.innerHTML = "";
  const currentDate = new Date();

  tasks.forEach((task, index) => {
    const dueDate = new Date(task.date);
    let taskStyle = "";
    let creationDateStyle = "";
    let dueDateStyle = "color: red;";

    const deadlineDate = new Date(dueDate);
    deadlineDate.setHours(deadlineDate.getHours() + 24);

    if (deadlineDate < currentDate) {
      taskStyle = "background-color: red;";
      creationDateStyle = "color: white; background-color: red;";
      dueDateStyle = "color: white; background-color: red;";
    } else {
      taskStyle = "border: 2px solid green;"; // Add green border to active tasks
      creationDateStyle = "color: green;";
    }

    tasksContainer.innerHTML += `
      <div id=${index} style="${taskStyle}">
        <span class="fw-bold" style="${
          deadlineDate < currentDate ? "color: white;" : ""
        }">${index + 1}. ${task.text}</span>
        <div style="${creationDateStyle}">Created: ${task.creationDate}</div>
        <div style="${dueDateStyle}">Due: ${task.date}</div>
        <p style="${deadlineDate < currentDate ? "color: white;" : ""}">${
      task.description
    }</p>
        <span class="options">
          <i onClick="editTask(${index})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
          <i onClick="
          deleteTask(${index})" class="fas fa-trash-alt"></i>
          </span>
        </div>
      `;
  });
}
