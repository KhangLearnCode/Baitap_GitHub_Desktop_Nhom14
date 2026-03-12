let deadlines = JSON.parse(localStorage.getItem("deadlines")) || []

function addDeadline(){

let task = document.getElementById("task").value
let date = document.getElementById("date").value

if(task === "" || date === ""){
alert("Vui lòng nhập đầy đủ thông tin")
return
}

let newDeadline = {
id: Date.now(),
task: task,
date: date
}

deadlines.push(newDeadline)

saveData()

renderList()

document.getElementById("task").value=""
document.getElementById("date").value=""
}

function renderList(){

let list = document.getElementById("deadlineList")

list.innerHTML=""

deadlines.forEach((item)=>{

let today = new Date()
let deadlineDate = new Date(item.date)

let diff = deadlineDate - today

let days = Math.ceil(diff/(1000*60*60*24))

let status=""
let color="black"

if(days < 0){
status="(Quá hạn)"
color="red"
}
else if(days <=1){
status="(Sắp tới hạn)"
color="orange"
}
else{
status="(Còn "+days+" ngày)"
color="green"
}

let li = document.createElement("li")

li.innerHTML = `
<span style="color:${color}">
<b>${item.task}</b> - ${item.date} ${status}
</span>
<button class="deleteBtn" onclick="deleteDeadline(${item.id})">Xóa</button>
`

list.appendChild(li)

})

}

function deleteDeadline(id){

deadlines = deadlines.filter(d => d.id !== id)

saveData()

renderList()

}

function saveData(){
localStorage.setItem("deadlines",JSON.stringify(deadlines))
}

renderList()