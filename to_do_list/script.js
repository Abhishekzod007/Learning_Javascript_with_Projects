document.getElementById('btn').addEventListener('click', ()=>{
    console.log("clicked");
    const mainDiv = document.getElementById('main-div')
    mainDiv.classList.toggle('hidden')

    const div = document.createElement('div')

    div.className =  "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    div.innerHTML =  `
        <div class="bg-white p-6 rounded-lg shadow-lg w-[40%] mx-auto">
          <h2 class="text-xl font-bold mb-4 text-center">Tasks Lists</h2>
          <ul id="new-lists"  class="space-y-2 text-left">
             
          </ul>
          <div class="flex justify-between text-center mt-4">
            <button id="closeDiv" class="px-4 py-2 bg-red-500  hover:bg-gray-300 text-white rounded">Submit</button>
            <button id="addTask" class="px-4 py-2 bg-red-500 hover:bg-gray-300 text-white rounded">Add Task</button>
          </div>
        </div>            
    
                  `
               


    document.body.appendChild(div);
    const addTasksBtn = document.getElementById('addTask')
    //let numberOfLists = document.getElementById('new-lists').children.length // ==> it freezes the value 
    let count = 1;

    addTasksBtn.addEventListener('click', ()=>{
        console.log('clicked on the button of add tasks');
      
        const Tasklists = document.getElementById('new-lists')
        const lists = document.createElement('li')
        lists.className = "flex items-center  gap-2 justify-between"
        lists.innerHTML = 
        `
        <div class="flex items-center gap-2 flex-1">
        <span class="w-6 text-center font-bold task-number">  </span>
        <input type="text" placeholder="Enter your task" class="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400">
        </div>
        <button id="delete-btn"  class="px-2 py-1 bg-gray-500 hover:bg-gray-300 text-white rounded">Delete</button>
        `;
        console.log(lists);
        Tasklists.appendChild(lists)

        // let numberOfLists = Tasklists.children.length // it count every time when DOM loads click happens
        // console.log(numberOfLists);

        function updateAddButtonState(){
            let numberOfLists = Tasklists.children.length
            const tasks = Tasklists.querySelectorAll("li");

            tasks.forEach((li, index) => {
                const numberSpan = li.querySelector(".task-number");
                 if (numberSpan) numberSpan.textContent = index + 1;
            });
            if(numberOfLists>=10){
            addTasksBtn.disabled = true;
            addTasksBtn.classList.add("bg-gray-400", "cursor-not-allowed");
            addTasksBtn.classList.remove("bg-red-500");
            }
            else{
            
            addTasksBtn.disabled = false;
            addTasksBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
            addTasksBtn.classList.add("bg-red-500");
            }
        }
        
        count++;

        lists.querySelector('#delete-btn').addEventListener('click', ()=>{
            lists.remove()
            console.log("delete button clicked");
            
            updateAddButtonState();
            count--
           
        })
        //console.log(numberOfLists);
        
        updateAddButtonState();

    } )   

    

    document.getElementById('closeDiv').addEventListener('click', ()=>{
        // div.remove()
        // mainDiv.classList.toggle('hidden')

        const Tasklists = document.getElementById('new-lists')
        const allTasks= Tasklists.querySelectorAll('li input[type="text"]')

        const leftDiv = document.getElementById('left-div')
        leftDiv.innerHTML ="";

        allTasks.forEach((taskInput, index) => {
        if (taskInput.value.trim() !== "") {
            // Create a new element for left div
            const taskItem = document.createElement('li');
        taskItem.className = 'flex items-start gap-2 hover:bg-gray-100';

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'mt-1';

        // Create span for task text
        const taskText = document.createElement('span');
        taskText.textContent = taskInput.value;

        // Append checkbox and span to LI
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);

        // Append LI to UL
       
            leftDiv.appendChild(taskItem);
        }
    });

    div.remove()
        mainDiv.classList.toggle('hidden')

    })

})


