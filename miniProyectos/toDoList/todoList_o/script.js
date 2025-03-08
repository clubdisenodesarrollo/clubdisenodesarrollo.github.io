const inputBox = document.getElementById("input-box");
const inputEmail = document.getElementById("input-email");

const listContainer = document.getElementById("list-container");

function addTask(){
    if (inputBox.value == ''){
        alert("Ingrese una actividad");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);

        let p = document.createElement("p");
        p.innerHTML = inputEmail.value;
        li.appendChild(p);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        p.appendChild(span);
    }

    inputBox.value = "";
    inputEmail.value = "";
    saveData();
}



listContainer.addEventListener("click", function(e){
    if(e.target.tagName=== "LI"){
        e.target.classList.toggle("checked");
        saveData();

    }
    else if (e.target.tagName === "SPAN"){
        e.target.parentElement.parentElement.remove();
        e.target.parentElement.remove();
        saveData();

    }
}, false);

li.addEventListener("click", function(e){
    if(e.target.tagName=== "P"){
        e.target.classList.toggle("checked");
    }
    else if (e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
    }
}, false);

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();