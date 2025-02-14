const firebaseConfig = {
  apiKey: "AIzaSyBkiu2jrI7DlpTSs6W6c-x_-7uPvQLf_F8",
  authDomain: "demoapp-d8d36.firebaseapp.com",
  databaseURL: "https://demoapp-d8d36-default-rtdb.firebaseio.com",
  projectId: "demoapp-d8d36",
  storageBucket: "demoapp-d8d36.appspot.com",
  messagingSenderId: "152581107442",
  appId: "1:152581107442:web:c02312e25768f602a26a6b",
  measurementId: "G-1PVW5VWDBY",
};

// const PHONE = "9876543210";
// const BOT_NAME = "firetest";
// const COMPANY = "firetest";
// const BASEURL = `http://127.0.0.1:5001/demoapp-d8d36/asia-south1/${BOT_NAME}`;

// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   Timestamp,
// } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Event listeners
// document.getElementById("send-btn").addEventListener("click", sendMessage);
// document.getElementById("chats-btn").addEventListener("click", showChats);
// document
//   .getElementById("appointments-btn")
//   .addEventListener("click", showAppointments);
// document
//   .getElementById("user-input")
//   .addEventListener("keypress", function (e) {
//     if (e.key === "Enter") sendMessage();
//   });

// // Show the chat section
// function showChats() {
//   document.getElementById("chat-section").classList.add("active");
//   document.getElementById("appointments-section").classList.remove("active");
//   document.getElementById("chats-btn").classList.add("active");
//   document.getElementById("appointments-btn").classList.remove("active");
// }

// // Show the appointments section
// function showAppointments() {
//   document.getElementById("appointments-section").classList.add("active");
//   document.getElementById("chat-section").classList.remove("active");
//   document.getElementById("appointments-btn").classList.add("active");
//   document.getElementById("chats-btn").classList.remove("active");

//   fetchAppointments();
// }

// // Fetch appointments from Firestore
// async function fetchAppointments() {
//   const appointmentsList = document.getElementById("appointments-list");
//   appointmentsList.innerHTML = "<li>Loading...</li>"; // Show loading state

//   try {
//     const querySnapshot = await getDocs(collection(db, "appointments"));
//     appointmentsList.innerHTML = ""; // Clear loading message

//     if (querySnapshot.empty) {
//       appointmentsList.innerHTML = "<li>No appointments found.</li>";
//       return;
//     }

//     querySnapshot.forEach((doc) => {
//       const appointment = doc.data();

//       // Convert Firestore timestamp to readable date
//       const timestamp = appointment.timeslot ?? appointment.timestamp;
//       const date = timestamp?.toDate?.() ?? new Date(timestamp);
//       const formattedDate = date.toLocaleString();

//       const li = document.createElement("li");
//       li.innerHTML = `<strong>${appointment.name}</strong> (${appointment.phone}) - ${appointment.service} at ${formattedDate}`;
//       appointmentsList.appendChild(li);
//     });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     appointmentsList.innerHTML = "<li>Error loading appointments.</li>";
//   }
// }

// // Send message to bot
// async function sendMessage() {
//   const userInputElement = document.getElementById("user-input");
//   const userInput = userInputElement.value.trim();
//   if (!userInput) return;

//   appendMessage(userInput, "user");
//   userInputElement.value = "";

//   // Show typing animation
//   const typingAnimation = document.getElementById("typing-animation");
//   typingAnimation.style.display = "block";

//   const requestBody = {
//     businessName: COMPANY,
//     waname: "kiran",
//     phone: PHONE,
//     text: userInput,
//   };

//   try {
//     const response = await fetch(BASEURL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody),
//     });

//     const data = await response.json();
//     appendMessage(data.response || "No response from bot.", "bot");
//   } catch (error) {
//     console.error("Error:", error);
//     appendMessage("Sorry, something went wrong.", "bot");
//   } finally {
//     typingAnimation.style.display = "none"; // Ensure animation hides in all cases
//   }
// }

// // Append messages to chat
// function appendMessage(text, sender) {
//   const chatBox = document.getElementById("chat-box");

//   const messageContainer = document.createElement("div");
//   messageContainer.classList.add(
//     "message",
//     sender === "user" ? "user-message" : "bot-message"
//   );
//   messageContainer.innerText = text;

//   chatBox.appendChild(messageContainer);
//   chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
// }

const PHONE = "9876543210";
// const BOT_NAME = "firetest";
// const COMPANY = "firetest";
// const BOT_NAME = "appointmentApp";
// const COMPANY = "appointmentApp";
const BOT_NAME = "autoMobileApp";
const COMPANY = "autoMobileApp";

// const BASEURL = `http://127.0.0.1:5001/demoapp-d8d36/asia-south1/${BOT_NAME}`;
const BASEURL =
  "https://asia-south1-demoapp-d8d36.cloudfunctions.net/autoMobileApp";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let sortState = {}; // Tracks current sort order for each column ("asc" or "desc")
let appointmentsData = []; // Global storage for fetched appointments

// Initialize event listeners for chat and tab switching
document.getElementById("send-btn").addEventListener("click", sendMessage);
document
  .getElementById("appointments-btn")
  .addEventListener("click", showAppointments);
document.getElementById("chats-btn").addEventListener("click", showChats);
document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Initialize sorting event listeners only once
initSortingListeners();

function showChats() {
  document.getElementById("chat-section").classList.add("active");
  document.getElementById("appointments-section").classList.remove("active");
}

function showAppointments() {
  document.getElementById("appointments-section").classList.add("active");
  document.getElementById("chat-section").classList.remove("active");
  fetchAppointments();
}

async function fetchAppointments() {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

  try {
    const querySnapshot = await getDocs(collection(db, "appointments"));
    appointmentsData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      timestamp: doc.data().timeSlot?.toDate() || new Date(),
    }));

    // Initially display appointments without sorting (or sorted by default order)
    displayAppointments(appointmentsData);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    appointmentsList.innerHTML =
      "<tr><td colspan='4'>Error loading appointments.</td></tr>";
  }
}

// function displayAppointments(appointments) {
//   const appointmentsList = document.getElementById("appointments-list");
//   appointmentsList.innerHTML = appointments
//     .map(
//       (appt) => `
//     <tr>
//       <td>${appt.name}</td>
//       <td>${appt.phone}</td>
//       <td>${appt.service}</td>
//       <td>${new Date(appt.timestamp)}</td>
//     </tr>
//   `
//     )
//     .join("");
// }

function displayAppointments(appointments) {
  const appointmentsList = document.getElementById("appointments-list");
  appointmentsList.innerHTML = appointments
    .map((appt) => {
      // Create a Date object from the timestamp
      const date = new Date(appt.timestamp);

      // Subtract 5 hours and 30 minutes (in milliseconds)
      date.setHours(date.getHours() - 5);
      date.setMinutes(date.getMinutes() - 30);

      // Format the time first, then the date
      const formattedTime = date.toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const formattedDate = date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // Combine time and date
      const displayTimeDate = `${formattedTime}, ${formattedDate}`;

      return `
        <tr>
          <td>${appt.name}</td>
          <td>${appt.phone}</td>
          <td>${appt.service}</td>
          <td>${displayTimeDate}</td>
        </tr>
      `;
    })
    .join("");
}

function initSortingListeners() {
  document.querySelectorAll("#appointments-table th").forEach((th) => {
    const column = th.getAttribute("data-column");
    sortState[column] = "asc"; // Default sort order
    th.addEventListener("click", () => {
      // Toggle sort order for this column
      sortState[column] = sortState[column] === "asc" ? "desc" : "asc";
      sortAppointments(column, sortState[column]);
      updateSortIndicators(column);
    });
  });
}

function sortAppointments(column, order) {
  // Map header "date" to our data field "timestamp"
  const columnMap = {
    name: "name",
    phone: "phone",
    service: "service",
    date: "timestamp",
  };
  let sortedData = [...appointmentsData]; // Create a copy to sort

  sortedData.sort((a, b) => {
    let valueA = a[columnMap[column]];
    let valueB = b[columnMap[column]];

    // For date sorting, compare timestamps
    if (column === "date") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }

    if (valueA > valueB) return order === "asc" ? 1 : -1;
    if (valueA < valueB) return order === "asc" ? -1 : 1;
    return 0;
  });

  displayAppointments(sortedData);
}

function updateSortIndicators(activeColumn) {
  // Update header text with arrow indicators
  document.querySelectorAll("#appointments-table th").forEach((th) => {
    const column = th.getAttribute("data-column");
    // Remove any previous indicator
    th.innerHTML = th.innerHTML.replace(/ ▲| ▼/g, "");
    if (column === activeColumn) {
      th.innerHTML += sortState[column] === "asc" ? " ▲" : " ▼";
    }
  });
}

// Chat functionality
async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userText = input.value.trim();

  if (!userText) return;

  appendMessage(userText, "user");
  input.value = "";

  // Show typing indicator for bot
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message");
  typingIndicator.textContent = "Typing...";
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(BASEURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: COMPANY,
        waname: "kiran",
        phone: PHONE,
        text: userText,
      }),
    });

    const data = await response.json();
    typingIndicator.remove();
    appendMessage(data.response || "No response from bot.", "bot");
  } catch (error) {
    console.error("Error:", error);
    typingIndicator.remove();
    appendMessage("Error: Failed to connect to the bot.", "bot");
  }
}

function appendMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(
    "message",
    sender === "user" ? "user-message" : "bot-message"
  );
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
