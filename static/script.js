const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const emojiButton = document.getElementById("emoji-button");
const emojiPicker = document.getElementById("emoji-picker");
emojiPicker.style.display = "none";

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

emojiButton.addEventListener("click", function(event) {
    event.preventDefault();
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

emojiPicker.querySelectorAll("span").forEach(emoji => {
    emoji.addEventListener("click", function() {
        userInput.value += this.textContent;
        userInput.focus(); // Вернуть фокус на поле ввода
        emojiPicker.style.display = "none";
    });
});

async function sendMessage() {
    const message = userInput.value.trim();
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!message && !file) {
        return;
    }

    const formData = new FormData();
    formData.append("message", message);
    if (file) {
        formData.append("file", file); // Добавляем файл
    }

    // Отображаем сообщение пользователя сразу
    appendMessage("You", message + (file ? ` (File: ${file.name})` : ""));
    userInput.value = "";
    fileInput.value = null; // Очищаем поле выбора файла

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        appendMessage("Ollama", data.response); // Отображаем ответ модели
    } catch (error) {
        console.error("Error:", error);
        appendMessage("Error", "Could not get response.");
    }
}

function appendMessage(role, message) {  // Изменено
    const messageElement = document.createElement("p");
    const strongElement = document.createElement("strong");
    strongElement.textContent = role + ": ";
    messageElement.appendChild(strongElement);
    messageElement.textContent += message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

const themeButtons = document.querySelectorAll("#theme-selector button");

themeButtons.forEach(button => {
    button.addEventListener("click", function() {
        const theme = this.dataset.theme;
        document.body.className = theme + "-theme"; // Применяем класс к <body>
        localStorage.setItem('theme', theme); // Сохраняем тему в localStorage
    });
});

// При загрузке страницы проверяем сохраненную тему в localStorage
document.addEventListener('DOMContentLoaded', (event) => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme + "-theme";
    }
});