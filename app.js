//Select the Elements
const clear = document.querySelector('.clear');
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

//Variables
let LIST, id;

//get item from local storage
var data = localStorage.getItem("TODO"); //JSON string

//check if data is not empty
if(data){
    LIST = JSON.parse(data); //JSON.parse - JSON string to Javascript Object 
    id = LIST.length; //set the id to the last one in the list
    loadList(LIST); //load the list to the user interface
}
else{
    //if data isn't empty
    LIST = [];
    id = 0;
}

//load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

//clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

//Show today's date
const options = {
    weekday : "short",
    month : "short",
    date : "numeric",
}
const today = new Date();

dateElement.innerHTML = today.getDate("en-US", options) + " " + today.toLocaleDateString("en-US", options);

//add to do function
function addToDo(toDo, id, done, trash){
    if(trash){
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `
                    <li class="item">
                        <i class="far ${DONE}" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fas fa-trash-alt" job="delete" id="${id}"></i>
                    </li>           
                 `

    //add new item before last item
    const position = "beforeend"; 
    
    list.insertAdjacentHTML(position, item);
}

//add an item to the list using the enter key
document.addEventListener("keyup", function(e){
    if(event.keyCode == 13){
        const toDo = input.value;

        //if the input isn't empty
        if(toDo){
            addToDo(toDo, id, false, false);

            //push items to the content list
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            })

            //add item to local storage (this code must be added where the LIST array is updated)
            localStorage.setItem("TODO", JSON.stringify(LIST));

            id++;
        }

        //clears the input after adding a to-do
        input.value = ""; 
    }
})

//complete to do 
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    //update list array
    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//remove to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

//target the items created dynamically
list.addEventListener("click", function(e){
    //return the clicked element inside list
    const element = e.target; 

    //complete or delete
    const elementJob = element.attributes.job.value;

    if(elementJob == "complete"){
        completeToDo(element);
    }
    else if(elementJob == "delete"){
        removeToDo(element);
    }

    //add item to local storage (this code must be added where the LIST array is updated)
    localStorage.setItem("TODO", JSON.stringify(LIST));
})