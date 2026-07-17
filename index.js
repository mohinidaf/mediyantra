let doctor = "";
let capacity = 0;
let currentToken = 0;
let queue = [];
let sessionActive = false;

// Start doctor session
function startSession() {
doctor = document.getElementById("doctorName").value;
capacity = parseInt(document.getElementById("capacity").value);

if (!doctor || !capacity) {
alert("Enter doctor and capacity");
return;
}

sessionActive = true;
queue = [];
currentToken = 0;

document.getElementById("docDisplay").innerText = doctor;
document.getElementById("status").innerText = "Active";

updateQueue();
}

// Generate token
function generateToken() {
if (!sessionActive) {
alert("Session not active");
return;
}

if (queue.length >= capacity) {
document.getElementById("tokenMessage").innerText =
"Session Full! Try Later.";
return;
}

let name = document.getElementById("patientName").value;
let phone = document.getElementById("phone").value;

let token = queue.length + 1;

queue.push({ name, phone, token });

document.getElementById("tokenMessage").innerText =
"Token " + token + " booked. SMS Sent ✔";

sendAlert(name, phone, token);
updateQueue();
}

// Next patient
function nextToken() {
if (queue.length === 0) return;

let patient = queue.shift();
currentToken++;

document.getElementById("currentToken").innerText = currentToken;

sendAlert(patient.name, patient.phone,
"Your turn now!");

updateQueue();
}

// Doctor leave handling
function doctorLeave() {
sessionActive = false;

queue.forEach(p =>
sendAlert(p.name, p.phone, "Doctor unavailable. Appointment cancelled.")
);

queue = [];
updateQueue();

document.getElementById("status").innerText = "Doctor on Leave";
}

// Update queue UI
function updateQueue() {
let list = document.getElementById("queueList");
list.innerHTML = "";

queue.forEach(p => {
let li = document.createElement("li");
li.innerText = "Token " + p.token + " - " + p.name;
list.appendChild(li);
});
}

// Alert simulation
function sendAlert(name, phone, message) {
console.log(`SMS to ${phone}: ${message}`);
}
