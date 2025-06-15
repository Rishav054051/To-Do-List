const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Add task on pressing Enter
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Save tasks to localStorage
function saveTaskToLocalStorage() {
  const allTasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    allTasks.push({
      text: li.firstChild.textContent,
      done: li.classList.contains("done"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) => {
    createTaskElement(task.text, task.done);
  });
}

// Creates a task <li> element with all buttons and behavior
function createTaskElement(taskText, isDone = false) {
  const li = document.createElement("li");
  li.textContent = taskText;
  li.classList.add("fade");
  if (isDone) li.classList.add("done");

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✅";
  completeBtn.onclick = () => {
    li.classList.toggle("done");
    saveTaskToLocalStorage();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.onclick = () => {
    li.classList.remove("show");
    setTimeout(() => {
      taskList.removeChild(li);
      saveTaskToLocalStorage();
    }, 400);
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = li.firstChild.textContent;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾";
    saveBtn.onclick = () => {
      const newText = editInput.value.trim();
      if (newText !== "") {
        li.firstChild.textContent = newText;
      }
      li.removeChild(editInput);
      li.removeChild(saveBtn);
      li.appendChild(completeBtn);
      li.appendChild(deleteBtn);
      li.appendChild(editBtn);
      saveTaskToLocalStorage();
    };

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        saveBtn.click();
      }
    });

    li.removeChild(completeBtn);
    li.removeChild(deleteBtn);
    li.removeChild(editBtn);
    li.appendChild(editInput);
    li.appendChild(saveBtn);
  };

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  li.appendChild(editBtn);

  taskList.appendChild(li);
  setTimeout(() => li.classList.add("show"), 10);
}

// Add new task from input
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText);
  saveTaskToLocalStorage();
  taskInput.value = "";
}

// Load tasks on page load
window.onload = loadTasksFromLocalStorage;
