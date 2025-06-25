// Progress calculation
function updateProgress() {
  const allCheckboxes = document.querySelectorAll(
    ".checkbox-todo, .checkbox-subtask"
  );
  const checkedCheckboxes = document.querySelectorAll(
    ".checkbox-todo:checked, .checkbox-subtask:checked"
  );
  const progress =
    allCheckboxes.length > 0
      ? Math.round((checkedCheckboxes.length / allCheckboxes.length) * 100)
      : 0;

  const progressBar = document.getElementById("progressBar");
  progressBar.value = progress;
  progressBar.textContent = progress + "%";
}

// Handle checkbox changes
document.addEventListener("change", function (e) {
  if (
    e.target.classList.contains("checkbox-todo") ||
    e.target.classList.contains("checkbox-subtask")
  ) {
    const label = e.target.nextElementSibling;
    if (e.target.checked) {
      label.classList.add("completed");
    } else {
      label.classList.remove("completed");
    }
    updateProgress();
  }
});

// Handle subtask collapsing
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("toggle-subtasks")) {
    const targetId = e.target.getAttribute("data-target");
    const subtasksList = document.getElementById(targetId);
    const parentTask = e.target.closest(".item-todo");

    if (subtasksList.classList.contains("collapsed")) {
      subtasksList.classList.remove("collapsed");
      subtasksList.classList.add("expanded");
      e.target.classList.add("expanded");
      parentTask.classList.remove("collapsed");
    } else {
      subtasksList.classList.remove("expanded");
      subtasksList.classList.add("collapsed");
      e.target.classList.remove("expanded");
      parentTask.classList.add("collapsed");
    }
  }
});

// Handle delete buttons
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("btn-delete") ||
    e.target.parentElement.classList.contains("btn-delete")
  ) {
    const item = e.target.closest(".dayly-item, .item-todo, .subtask");
    item.style.animation = "fadeOut 0.3s ease";
    setTimeout(() => {
      item.remove();
      updateProgress();
    }, 300);
  }
});

// Handle edit buttons (placeholder functionality)
document.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("btn-edit") ||
    e.target.parentElement.classList.contains("btn-edit") ||
    e.target.classList.contains("btn-edit-subtask") ||
    e.target.parentElement.classList.contains("btn-edit-subtask")
  ) {
    const item = e.target.closest(".dayly-item, .item-todo, .subtask");
    const label = item.querySelector("label") || item;
    const currentText = label.textContent.trim();
    const newText = prompt("Edit task:", currentText);
    if (newText && newText !== currentText) {
      if (label.tagName === "LABEL") {
        label.textContent = newText;
      } else {
        label.firstChild.textContent = newText;
      }
    }
  }
});

// Handle add button
document.getElementById("addBtn").addEventListener("click", function () {
  const taskText = prompt("Enter new task:");
  if (taskText) {
    const todoList = document.querySelector(".list-todo");
    const newTaskId = "todo" + Date.now();

    const newTask = document.createElement("li");
    newTask.className = "item-todo";
    newTask.innerHTML = `
                    <input type="checkbox" class="checkbox-todo" id="${newTaskId}" value="${newTaskId}" />
                    <label for="${newTaskId}">${taskText}</label>
                    <button class="btn-edit" aria-label="Edit Task">
                        <i class="icon-edit">✏️</i>
                    </button>
                    <button class="btn-delete" aria-label="Delete Task">
                        <i class="icon-delete">🗑️</i>
                    </button>
                `;

    todoList.appendChild(newTask);
    updateProgress();
  }
});

// Initialize progress on page load
updateProgress();

// Add fade out animation
const style = document.createElement("style");
style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(-100%); }
            }
        `;
document.head.appendChild(style);
