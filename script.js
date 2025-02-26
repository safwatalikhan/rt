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

let recordsPerPage = 10;
let currentPage = 1;
let totalRecords = 0;
let sortField = "index";
let sortOrder = "asc";

// Load Records
function loadRecords() {
    db.collection("recordsrt")
        .orderBy(sortField, sortOrder === "asc" ? "asc" : "desc")
        .limit(recordsPerPage)
        .get()
        .then((querySnapshot) => {
            let output = "";
            let index = (currentPage - 1) * recordsPerPage + 1;
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                output += `
                    <div class="record">
                        <span class="index">${index++}</span>
                        <div class="details">
                            <h3 contenteditable="false">${data.title}</h3>
                            <a href="${data.location}" target="_blank" contenteditable="false">${data.location}</a>
                        </div>
                        <img src="${data.photo || 'default-icon.png'}" class="thumbnail">
                        <button onclick="editRecord('${doc.id}', this)">Edit</button>
                        <button onclick="saveRecord('${doc.id}', this)" style="display: none;">Save</button>
                        <button onclick="cancelEdit(this)" style="display: none;">Cancel</button>
                    </div>`;
            });
            document.getElementById("records-container").innerHTML = output;
            setupPagination();
        })
        .catch((error) => console.error("Error loading records: ", error));
}

// Edit Record
function editRecord(docId, button) {
    let record = button.closest(".record");
    record.querySelector("h3").setAttribute("contenteditable", "true");
    record.querySelector("a").setAttribute("contenteditable", "true");
    button.style.display = "none";
    record.querySelector("button[onclick^='saveRecord']").style.display = "inline";
    record.querySelector("button[onclick^='cancelEdit']").style.display = "inline";
}

// Save Record
function saveRecord(docId, button) {
    let record = button.closest(".record");
    let updatedTitle = record.querySelector("h3").innerText;
    let updatedLocation = record.querySelector("a").innerText;

    db.collection("recordsrt").doc(docId).update({
        title: updatedTitle,
        location: updatedLocation
    }).then(() => {
        record.querySelector("h3").setAttribute("contenteditable", "false");
        record.querySelector("a").setAttribute("contenteditable", "false");
        button.style.display = "none";
        record.querySelector("button[onclick^='cancelEdit']").style.display = "none";
        record.querySelector("button[onclick^='editRecord']").style.display = "inline";
    });
}

// Cancel Edit
function cancelEdit(button) {
    let record = button.closest(".record");
    record.querySelector("h3").setAttribute("contenteditable", "false");
    record.querySelector("a").setAttribute("contenteditable", "false");
    button.style.display = "none";
    record.querySelector("button[onclick^='saveRecord']").style.display = "none";
    record.querySelector("button[onclick^='editRecord']").style.display = "inline";
    loadRecords();
}

// Sorting
function sortRecords(field) {
    if (sortField === field) {
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
        sortField = field;
        sortOrder = "asc";
    }
    loadRecords();
}

// Pagination
function setupPagination() {
    db.collection("recordsrt").get().then((querySnapshot) => {
        totalRecords = querySnapshot.size;
        let totalPages = Math.ceil(totalRecords / recordsPerPage);
        let paginationHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        }
        document.getElementById("pagination").innerHTML = paginationHTML;
    });
}

function changePage(page) {
    currentPage = page;
    loadRecords();
}

// Load records on page load
window.onload = loadRecords;
