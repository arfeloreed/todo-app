// add date and time
document.getElementById("date").innerHTML = new Date().toDateString();
function time() {
  const timeNow = new Date();
  let h = timeNow.getHours();
  let m = timeNow.getMinutes();
  let s = timeNow.getSeconds();

  if (h < 10) {
    h = `0${h}`;
  }
  if (m < 10) {
    m = `0${m}`;
  }
  if (s < 10) {
    s = `0${s}`;
  }

  document.getElementById("hour").innerHTML = `${h}:${m}:${s}`;
  setTimeout(time, 500);
}

// add todos
const todoForm = document.getElementById("todo-form");
let addTask = document.querySelector("#addTask");
let addTaskBtn = document.querySelector("#addTaskBtn");
let todosHtml = document.querySelector("#todos");

function addTodosHtml(content) {
  const htmlElement = document.createElement("li");
  htmlElement.classList.add("todo");
  htmlElement.innerHTML = `<p>${content}</p>
    <button type="button"><i class="fa-solid fa-circle-check done-btn"></i></button>
    <button type="button"><i class="fa-solid fa-pen edit-btn"></i></button>
    <button type="button"><i class="fa-solid fa-circle-xmark delete-btn"></i></button>`;
  // htmlElement.innerHTML = `<p>${content}</p><div class="todos-btn-con">
  //   <button type="button" class="done-btn">C</button>
  //   <button type="button" class="edit-btn">E</button>
  //   <button type="button" class="delete-btn">X</button></div>`;

  todosHtml.appendChild(htmlElement);
  addTask.value = "";
  addTask.focus();

  saveTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (addTask.value) addTodosHtml(addTask.value);
});

// edit todo
const editForm = document.getElementById("edit-form");
const editInput = document.getElementById("edit-task");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const filterContainer = document.getElementById("filter-con");
let oldInputValue;

// todos functionality
document.addEventListener("click", (event) => {
  let rootEl = event.target.closest("li");
  let todoText = rootEl.querySelector("p").textContent;

  // done todo
  if (event.target.classList.contains("done-btn")) rootEl.classList.toggle("done");

  // delete todo
  if (event.target.classList.contains("delete-btn")) rootEl.remove();

  // edit todo
  if (event.target.classList.contains("edit-btn")) {
    toggleForms();
    editInput.value = todoText;
    oldInputValue = todoText;
  }

  saveTodos();
});

function toggleForms() {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  filterContainer.classList.toggle("hide");
  todosHtml.classList.toggle("hide");
}

cancelEditBtn.addEventListener("click", (event) => {
  event.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (editInput.value) updateTodo(editInput.value);
  toggleForms();
});

function updateTodo(text) {
  const todoList = document.querySelectorAll(".todo");
  todoList.forEach((todo) => {
    let todoContent = todo.querySelector("p");

    if (todoContent.textContent === oldInputValue) todoContent.textContent = text;
  });

  saveTodos();
}

// save the todos to the local storage of the browser
function saveTodos() {
  const todos = [];

  if (document.querySelectorAll(".todo").length > 0) {
    document.querySelectorAll(".todo").forEach((item) => {
      const todo = {
        id: Date.now(),
        todo: item.innerText,
        isDone: false,
      };

      if (item.classList.contains("done")) todo.isDone = true;
      todos.push(todo);
      localStorage.setItem("todos", JSON.stringify(todos));
    });
  } else {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

function getTodos() {
  const savedTodoItems = localStorage.getItem("todos");
  return savedTodoItems ? JSON.parse(savedTodoItems) : [];
}

function displayTodos() {
  const savedTodos = getTodos();
  savedTodos.forEach((item) => {
    const htmlElement = document.createElement("li");
    htmlElement.classList.add("todo");
    if (item.isDone) htmlElement.classList.add("done");
    htmlElement.innerHTML = `<p>${item.todo}</p>
      <button type="button"><i class="fa-solid fa-circle-check done-btn"></i></button>
      <button type="button"><i class="fa-solid fa-pen edit-btn"></i></button>
      <button type="button"><i class="fa-solid fa-circle-xmark delete-btn"></i></button>`;

    todosHtml.appendChild(htmlElement);
  });

  filterTodos("all");
}

// delete all
const deleteAll = document.getElementById("delete-all");
deleteAll.addEventListener("click", () => {
  localStorage.clear();
  todosHtml.innerHTML = "";
});

// filter buttons
const filterButtons = document.querySelectorAll(".filter");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filterType = button.dataset.filters;
    filterTodos(filterType);

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

function filterTodos(filterType) {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    if (filterType === "all") {
      todo.style.display = "flex";
    } else if (filterType === "completed" && todo.classList.contains("done")) {
      todo.style.display = "flex";
    } else if (filterType === "unfinished" && !todo.classList.contains("done")) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
}

displayTodos();

// footer
document.getElementById("year").innerText = new Date().getFullYear();
