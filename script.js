// const BOT_NAME = 'mytikkyBot';
// const COMPANY = "MyTikky";
const BOT_NAME = "jjwBot";
const COMPANY = "JJW";
const BASEURL = `https://asia-south1-demoapp-d8d36.cloudfunctions.net/${BOT_NAME}`;
const APPOINTMENTS_URL = `https://demoapp-d8d36-default-rtdb.firebaseio.com/${COMPANY}/appointments.json`;

document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("chats-btn").addEventListener("click", showChats);
document
  .getElementById("appointments-btn")
  .addEventListener("click", showAppointments);

// Enable sending message on pressing Enter key
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

// Show the chat section
function showChats() {
  document.getElementById("chat-section").classList.add("active");
  document.getElementById("appointments-section").classList.remove("active");
  document.getElementById("chats-btn").classList.add("active");
  document.getElementById("appointments-btn").classList.remove("active");
}

// Show the appointments section
function showAppointments() {
  document.getElementById("appointments-section").classList.add("active");
  document.getElementById("chat-section").classList.remove("active");
  document.getElementById("appointments-btn").classList.add("active");
  document.getElementById("chats-btn").classList.remove("active");

  fetchAppointments();
}

// Fetch appointments from Firebase
function fetchAppointments() {
  fetch(APPOINTMENTS_URL)
    .then((response) => response.json())
    .then((data) => {
      const appointmentsList = document.getElementById("appointments-list");
      appointmentsList.innerHTML = ""; // Clear previous appointments

      for (const phone in data) {
        const appointment = data[phone];
        const li = document.createElement("li");
        li.innerHTML = `<strong>${phone}</strong>: ${appointment.summary}`;
        appointmentsList.appendChild(li);
      }
    })
    .catch((error) => console.error("Error fetching appointments:", error));
}

// Send message to bot
function sendMessage() {
  const userInput = document.getElementById("user-input").value;
  if (userInput.trim() === "") return;

  appendMessage(userInput, "user");
  document.getElementById("user-input").value = "";

  // Show typing animation
  const typingAnimation = document.getElementById("typing-animation");
  typingAnimation.style.display = "block";

  // Prepare POST data
  const requestBody = {
    businessName: COMPANY,
    waname: "kiran",
    phone: "9876543210",
    text: userInput,
  };

  // Send request to bot
  fetch(BASEURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      // Hide typing animation and show bot response
      typingAnimation.style.display = "none";
      appendMessage(data.response, "bot");
    })
    .catch((error) => {
      console.error("Error:", error);
      typingAnimation.style.display = "none";
      appendMessage("Sorry, something went wrong.", "bot");
    });
}

// Append messages to the chat window
function appendMessage(text, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  messageContainer.classList.add(
    sender === "user" ? "user-message" : "bot-message"
  );
  messageContainer.innerText = text;

  document.getElementById("chat-box").appendChild(messageContainer);
  document.getElementById("chat-box").scrollTop =
    document.getElementById("chat-box").scrollHeight; // Auto-scroll to the latest message
}
