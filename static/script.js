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

sendButton.addEventListener("click", function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    sendMessage();
});

async function sendMessage() {
    const message = userInput.value.trim();
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0]; // Получаем выбранный файл

    if (!message && !file) {
        return; // Ничего не отправляем, если нет ни текста, ни файла
    }

    const formData = new FormData(); // Используем FormData для отправки файлов
    formData.append("message", message);

    if (file) {
        formData.append("file", file); // Добавляем файл
    }

    appendMessage("You: " + message + (file ? ` (File: ${file.name})` : "")); // Добавляем информацию о файле в сообщение

    userInput.value = "";
    fileInput.value = null; // Очищаем поле выбора файла

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            body: formData  // Отправляем FormData
        });

        const data = await response.json();
        appendMessage("Ollama: " + data.response);
    } catch (error) {
        console.error("Error:", error);
        appendMessage("Error: Could not get response.");
    }
}

function appendMessage(message) {
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Автопрокрутка
}