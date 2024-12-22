
const BE_BASE_URL = "http://127.0.0.1:5000";

const submitBtn = document.getElementById("btn-submit");
const resetBtn = document.getElementById("btn-reset");
const newItemTxtField = document.getElementById("text");
const displayListEl = document.getElementById("task-list")

submitBtn.addEventListener("click", handleSubmit);
resetBtn.addEventListener("click", handleReset);

function handleSubmit() {
    addToList(newItemTxtField.value);
}

function handleReset() {
    resetList();
}

// CRUD functions
function addToList(listItem) {
    fetch(
        BE_BASE_URL + "/add",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: listItem
        }
    )
    .then(response => response.json()) // Converts the ReadableStream into JSON
    .then(data => {
        emptyAndPopulateList(data);
    });
}

function resetList() {
    fetch(
        BE_BASE_URL + "/reset",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }
    )
    .then(response => response.json())
    .then(() => {
        displayListEl.innerHTML = "";
    })
}

function emptyAndPopulateList(list) {
    // Emptying the list
    displayListEl.innerHTML = "";

    let htmlStr = "";
    list.forEach(item  => htmlStr += `<li>${item}</li>` );
    displayListEl.innerHTML = htmlStr;
}


