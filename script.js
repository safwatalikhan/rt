// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO05HZPcWlNRZ-lRL2GknVe3QOOo3TTdo",
  authDomain: "rttxt-e1d84.firebaseapp.com",
  projectId: "rttxt-e1d84",
  storageBucket: "rttxt-e1d84.firebasestorage.app",
  messagingSenderId: "7249299685",
  appId: "1:7249299685:web:e2e5f794d2cc22feb82c0c",
  measurementId: "G-K753NEH3BB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function loadRecords() {
    const recordsContainer = document.getElementById("records");
    recordsContainer.innerHTML = ""; // Clear existing records

    const snapshot = await db.collection("records").orderBy("index").get();
    snapshot.forEach((doc) => {
        const record = doc.data();
        recordsContainer.innerHTML += `
            <tr id="record-${record.index}">
                <td>${record.index}</td>
                <td><input type="text" class="editable" value="${record.title}" readonly></td>
                <td><input type="text" class="editable" value="${record.location}" readonly></td>
                <td><img src="${record.photo || 'default-icon.png'}" class="thumbnail"></td>
                <td>
                    <button class="edit-btn" onclick="enableEdit(${record.index})">Edit</button>
                    <button class="save-btn" style="display:none;" onclick="saveEdit(${record.index})">Save</button>
                    <button class="cancel-btn" style="display:none;" onclick="cancelEdit(${record.index})">Cancel</button>
                </td>
            </tr>`;
    });
}

function enableEdit(index) {
    const row = document.getElementById(`record-${index}`);
    const inputs = row.querySelectorAll(".editable");

    inputs.forEach(input => {
        input.removeAttribute("readonly");
        input.classList.add("editing");
    });

    row.querySelector(".save-btn").style.display = "inline-block";
    row.querySelector(".cancel-btn").style.display = "inline-block";
    row.querySelector(".edit-btn").style.display = "none";
}

async function saveEdit(index) {
    const row = document.getElementById(`record-${index}`);
    const inputs = row.querySelectorAll(".editable");

    let updatedData = {
        title: inputs[0].value,
        location: inputs[1].value,
        photo: inputs[2].value
    };

    await db.collection("records").doc(index.toString()).update(updatedData);

    inputs.forEach(input => {
        input.setAttribute("readonly", true);
        input.classList.remove("editing");
    });

    row.querySelector(".save-btn").style.display = "none";
    row.querySelector(".cancel-btn").style.display = "none";
    row.querySelector(".edit-btn").style.display = "inline-block";
}
