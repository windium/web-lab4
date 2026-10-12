"use strict";

const loadTasksBtn = document.getElementById("loadTasksBtn");
const taskList = document.getElementById("taskList");
const statusMessage = document.getElementById("statusMessage");

const manager = new TaskManager();

function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task");
  if (task.completed) {
    taskDiv.classList.add("completed");
  }

  const titleSpan = document.createElement("span");
  titleSpan.textContent = task.title;

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toggle";
  toggleBtn.addEventListener("click", () => {
    manager.toggleTask(task.id);
    renderTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    manager.removeTask(task.id);
    renderTasks();
  });

  taskDiv.appendChild(titleSpan);
  taskDiv.appendChild(toggleBtn);
  taskDiv.appendChild(deleteBtn);

  return taskDiv;
}

function renderTasks() {
  // Remove the old list before drawing the current state
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  manager.tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
}

async function loadTasks() {
  statusMessage.classList.remove("error");
  statusMessage.textContent = "Loading tasks...";
  loadTasksBtn.disabled = true;

  try {
    const rawTasks = await fetchTasks();

    // Round-trip through JSON, then build Task instances from the parsed copy
    const json = JSON.stringify(rawTasks);
    const parsedTasks = JSON.parse(json);
    const tasks = parsedTasks.map(
      (item) => new Task(item.id, item.title, item.completed)
    );

    manager.setTasks(tasks);
    renderTasks();
    statusMessage.textContent = "";
  } catch (error) {
    statusMessage.classList.add("error");
    statusMessage.textContent = `Failed to load tasks: ${error.message}`;
  } finally {
    loadTasksBtn.disabled = false;
  }
}

loadTasksBtn.addEventListener("click", loadTasks);
