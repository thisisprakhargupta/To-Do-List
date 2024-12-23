
const BE_BASE_URL = "http://127.0.0.1:5000";

const submitBtn = document.getElementById("btn-submit");
const resetBtn = document.getElementById("btn-reset");
const newItemTxtField = document.getElementById("text");
const displayListEl = document.getElementById("task-list");

let latestList = [];

function setLatestList(list) {
    latestList = list.map(el => ({ value: el, editable: false}));
}

submitBtn.addEventListener("click", handleSubmit);
newItemTxtField.addEventListener("keydown",function(event) {
    if (event.key === 'Enter') {
        handleSubmit();
    }
});
resetBtn.addEventListener("click", handleReset);
function onWindowLoad() {
    fetch(
        BE_BASE_URL + "/get"
    )
    .then(response => response.json()) // Converts the ReadableStream into JSON
    .then(data => {
        setLatestList(data);
        emptyAndPopulateList();
    })
    .catch(err => window.alert(err));
};
onWindowLoad();

function handleSubmit() {
    if (newItemTxtField.value=="") window.alert("Please enter a value")
    else addToList(newItemTxtField.value);
}

function handleReset() {
    if(window.confirm("This action will delete all your tasks. Continue ? ")) {
        resetList();
    }
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
        setLatestList(data);
        emptyAndPopulateList();
    })
    .catch(err => window.alert(err));
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
    .catch(err => window.alert(err));
}

function emptyAndPopulateList() {
    // Emptying the list
    displayListEl.innerHTML = "";

    let htmlStr = "";
    latestList.forEach(
        (item,index)  => htmlStr += `
            <li>
                <div>
                    ${
                        item.editable
                            ? `<input value="${item.value}" id="new-edit-${index}"/>`
                            : `${item.value}`
                    }
                </div>
                <div>
                    ${
                        item.editable
                            ? `
                                <button onclick="saveEditChanges(${index})">
                                    UPDATE
                                </button>
                                <button onclick="cancelEdit(${index})">
                                    CANCEL
                                </button>
                              `
                            : `<button onclick="edit_Element(${index})" style="border:none">
                                    <img src="./assets/images/edit.svg" height="20" width="20" />
                                </button>
                                <button onclick="delete_Element(${index})" style="border:none">
                                    <img src="./assets/images/delete.png" height="20" width="20" />
                                </button>
                              `
                    }
                </div>
            </li>
        ` );
    displayListEl.innerHTML = htmlStr;
}

function delete_Element(index){
    fetch(
        BE_BASE_URL + "/del",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: index
        }
    )
    .then(response => response.json()) // Converts the ReadableStream into JSON
    .then(data => {
        setLatestList(data);
        emptyAndPopulateList();
    })
    .catch(err => window.alert(err));
}

function cancelEdit(index) {
    latestList[index].editable = false;
    emptyAndPopulateList();
}

function saveEditChanges(index) {
    const newValue = document.getElementById(`new-edit-${index}`).value;

    if(newValue.trim().length < 1) {
        window.alert("Please enter task.")
        return;
    }

    fetch(
        BE_BASE_URL + "/edit",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                index: index,
                value: newValue,
            })
        }
    )
    .then(response => response.json()) // Converts the ReadableStream into JSON
    .then(data => {
        setLatestList(data);
        emptyAndPopulateList(data);
    })
    .catch(err => window.alert(err));

}

function edit_Element(index){
    latestList[index].editable = true;
    emptyAndPopulateList();
}