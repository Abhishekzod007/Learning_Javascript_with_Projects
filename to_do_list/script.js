// Persisted tasks
let allTasksArray = JSON.parse(localStorage.getItem("tasks") || "[]");

// Save helper
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(allTasksArray));
}


let weeklyCompleted = parseInt(localStorage.getItem("weeklyCompleted") || "0");

// Track last day
let lastDay = parseInt(localStorage.getItem("lastDay") || new Date().getDay());

// Check if a new day started
function handleNewDay() {
  const today = new Date().getDay();
  if (today !== lastDay) {
    // Count completed tasks before reset
    const completedYesterday = allTasksArray.filter(t => t.done).length;
    weeklyCompleted += completedYesterday;

    // Save cumulative completed
    localStorage.setItem("weeklyCompleted", weeklyCompleted);

    // Reset all tasks
    allTasksArray.forEach(t => t.done = false);
    saveTasks();

    // Update lastDay
    lastDay = today;
    localStorage.setItem("lastDay", lastDay);
  }
}

// Call on load
handleNewDay();
// Render main page tasks
function renderMainTasks() {
  const leftDiv = document.getElementById('left-div');
  leftDiv.innerHTML = "";
  const taskList = document.createElement('ul');
  taskList.className = 'space-y-3';

  allTasksArray.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'flex items-start gap-2 hover:bg-gray-100';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mt-1';
    checkbox.checked = !!task.done;

    const taskText = document.createElement('span');
    taskText.textContent = task.text;

    if (task.done) taskText.classList.add('line-through', 'text-gray-500');

    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      if (task.done) {
        taskText.classList.add('line-through', 'text-gray-500');
      } else {
        taskText.classList.remove('line-through', 'text-gray-500');
      }
      saveTasks();
      updateProgress();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskList.appendChild(taskItem);
  });

// may be we need to perform remiang operations in this function
  leftDiv.appendChild(taskList);
  updateProgress()
}

// Open modal / edit UI
document.getElementById('btn').addEventListener('click', () => {
  const mainDiv = document.getElementById('main-div');
  mainDiv.classList.toggle('hidden');

  const div = document.createElement('div');
  div.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50";
  div.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto">
      <h2 class="text-xl font-bold mb-4 text-center">Repeating Task List</h2>
      <ul id="new-lists" class="space-y-2 text-left"></ul>
      <div class="flex justify-between text-center mt-4">
        <button id="closeDiv" class="px-4 py-2 bg-red-500 hover:bg-gray-300 text-white rounded">Submit</button>
        <button id="addTask" class="px-4 py-2 bg-green-500 hover:bg-gray-300 text-white rounded">+ Add Task</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);

  // Query inside modal only
  const Tasklists = div.querySelector('#new-lists');
  const addTasksBtn = div.querySelector('#addTask');
  const closeBtn = div.querySelector('#closeDiv');

  // Update allTasksArray from the current modal inputs (important)
  function updateArrayFromModalInputs() {
    const inputs = Tasklists.querySelectorAll('li input[type="text"]');
    // If array is longer than inputs, keep length consistent
    inputs.forEach((input, idx) => {
      // Ensure an object exists for this index
      allTasksArray[idx] = allTasksArray[idx] || { text: "", done: false };
      allTasksArray[idx].text = input.value;
    });
    // If inputs are fewer than array length (shouldn't usually happen),
    // keep trailing items (they will be removed on submit if empty)
  }

  // Render the modal content from the array
  function renderModalTasks() {
    Tasklists.innerHTML = "";
    allTasksArray.forEach((task, index) => {
      const lists = document.createElement('li');
      lists.className = "flex items-center gap-2 justify-between";
      lists.innerHTML = `
        <div class="flex items-center gap-2 flex-1">
          <span class="w-6 text-center font-bold task-number">${index + 1}</span>
          <input type="text" value="${task.text.replace(/"/g, '&quot;')}" class="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <button class="px-2 py-1 bg-gray-500 hover:bg-gray-300 text-white rounded delete-btn">🗑</button>
      `;

      // Delete: compute index at time of click (safer)
      lists.querySelector('.delete-btn').addEventListener('click', (ev) => {
        // Always capture current typed values first
        updateArrayFromModalInputs();

        // find which li is being deleted
        const li = ev.currentTarget.closest('li');
        const idx = Array.from(Tasklists.children).indexOf(li);
        if (idx !== -1) {
          allTasksArray.splice(idx, 1);
        }
        renderModalTasks();
      });

      Tasklists.appendChild(lists);
    });

    // disable add button if 10 or more
    addTasksBtn.disabled = allTasksArray.length >= 10;
    if (addTasksBtn.disabled) {
      addTasksBtn.classList.add("bg-gray-400", "cursor-not-allowed");
      addTasksBtn.classList.remove("bg-green-500");
    } else {
      addTasksBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
      addTasksBtn.classList.add("bg-green-500");
    }


    

  }

  // initial modal render
  renderModalTasks();

  // Add new task button: update array from current inputs first
  addTasksBtn.addEventListener('click', () => {
    updateArrayFromModalInputs();
    if (allTasksArray.length >= 10) return;
    allTasksArray.push({ text: "", done: false });
    renderModalTasks();
    // focus the new input
    const lastInput = Tasklists.querySelector('li:last-child input[type="text"]');
    if (lastInput) lastInput.focus();
  });

  // Submit: update from inputs, remove empty tasks, save and render main
  closeBtn.addEventListener('click', () => {
    updateArrayFromModalInputs();
    // remove tasks with empty text
    allTasksArray = allTasksArray.filter(t => t.text && t.text.trim() !== '');
    saveTasks();
    renderMainTasks();
    div.remove();
    mainDiv.classList.toggle('hidden');
  });
});

// initial page render
renderMainTasks();
function attachTooltipListeners() {
  for (let d = 0; d < 7; d++) {
    const bar = document.querySelector(`#fill-${d}`);
    if (!bar) continue;

    bar.addEventListener("mouseenter", () => showTooltip(bar, d));
    bar.addEventListener("mouseleave", () => hideTooltip(bar));
  }
}

function showTooltip(bar, dayIndex) {
  const tasksPerDay = allTasksArray.length;
  const today = new Date().getDay();
  const completedDay = (dayIndex === today) ? allTasksArray.filter(t => t.done).length : 0;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-100 z-50";
  tooltip.innerText = `${completedDay} / ${tasksPerDay} tasks completed`;
  tooltip.style.transition = "opacity 0.3s ease";

  bar.appendChild(tooltip);
}

function hideTooltip(bar) {
  const tooltip = bar.querySelector(".tooltip");
  if (tooltip) tooltip.remove();
}

// Run once after the bars exist
attachTooltipListeners();




function updateProgress() {
  const tasksPerDay = allTasksArray.length;
  const total = 7 * tasksPerDay;
  const completedToday = allTasksArray.filter(t => t.done).length;
  const completed = weeklyCompleted + completedToday;

  document.getElementById('remainingTasks').innerText = `Total Task: ${total}`;
  document.getElementById('completedTasks').innerText = `Completed Task: ${completed}`;

  // current day (0 = Sunday)
  const today = new Date().getDay();

  // Reset all fills
  // for (let i = 0; i < 7; i++) {
  //   document.getElementById(`fill-${i}`).style.height = "0%";
  // }

  // Fill today's bar
  if (tasksPerDay > 0) {
    const percent = (completedToday / tasksPerDay) * 100;
    document.querySelector(`#fill-${today} .progress-fill`).style.height = `${percent}%`;
    document.querySelector(`#fill-${today} .progress-fill`).style.backgroundColor = 'lightcoral'
    // console.log(`${completedToday} / ${tasksPerDay} tasks completed`);
     
    // const tooltip = document.querySelector(`.tooltip`);
    // if (tooltip) {
    //   tooltip.innerHTML = `${completedToday} / ${tasksPerDay} tasks completed`;
    // }
  }
}

// function attachTooltipListeners() {
//   for (let d = 0; d < 7; d++) {
//     const bar = document.querySelector(`#fill-${d}`);
//     if (!bar) continue;

//     bar.addEventListener("mouseenter", () => showTooltip(bar, d));
//     bar.addEventListener("mouseleave", () => hideTooltip(bar));
//   }
// }

// function hideTooltip(bar) {
//   const tooltip = bar.querySelector(".tooltip");
//   if (tooltip) tooltip.remove();
// }


// // --- Tooltip helpers ---
// function showTooltip(bar, dayIndex) {
//   const tasksPerDay = allTasksArray.length;
//   const today = new Date().getDay();
 


  

//   // if it's today, show actual completed count, else show 0
//   const completedDay = (dayIndex === today)
//     ? allTasksArray.filter(t => t.done).length
//     : 0;

//   const tooltip = document.createElement("div");
//   tooltip.className =
//     "tooltip absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-100 z-50";
//   tooltip.innerText = `${completedDay} / ${tasksPerDay} tasks completed`;

//   bar.appendChild(tooltip);
// }

// function hideTooltip(bar) {
//   const tooltip = bar.querySelector(".tooltip");
//   if (tooltip) tooltip.remove();
// }

// function attachTooltipListeners() {
//   for (let d = 0; d < 7; d++) {
//     const bar = document.querySelector(`#fill-${d}`);
//     if (!bar) continue;

//     bar.addEventListener("mouseenter", () => showTooltip(bar, d));
//     bar.addEventListener("mouseleave", () => hideTooltip(bar));
//   }
// }


function getWeekNumber(date){
    const FirstDay = new Date(date.getFullYear(), 0, 1)
    const pastDays = (date-FirstDay)/86400000
    return Math.ceil((pastDays+FirstDay.getDay())/7)
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const today = new Date().getDay()
const dayName = days[today]
const weekNumber = getWeekNumber(new Date())

document.querySelector('.day').innerHTML = `${dayName} , <span class="text-sm font-semibold">Week ${weekNumber}</span>`

document.getElementById('Week-progress').innerText = `This Week's Progress - week ${weekNumber} `

document.getElementById('remainingTasks').innerText = `Total Task: ${7*allTasksArray.length}`

console.log(allTasksArray);
