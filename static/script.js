const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const emojiButton = document.getElementById("emoji-button");
const emojiPicker = document.getElementById("emoji-picker");

// Изначально скрываем эмодзи-пикер
emojiPicker.style.display = "none";

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

emojiButton.addEventListener("click", function(event) {
    event.preventDefault(); // Предотвращаем отправку формы
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

emojiPicker.querySelectorAll("span").forEach(emoji => {
    emoji.addEventListener("click", function() {
        userInput.value += this.textContent;
        userInput.focus(); // Вернуть фокус на поле ввода
        emojiPicker.style.display = "none"; // Скрыть эмодзи-пикер после выбора
    });
});


function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        appendMessage("You: " + message);
        userInput.value = "";

        fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("Ollama: " + data.response);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("Error: Could not get response.");
        });
    }
}

function appendMessage(message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Автопрокрутка
}