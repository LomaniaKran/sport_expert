from flask import Flask, render_template, request, jsonify
import requests
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

OLLAMA_API_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "sport_exp"

UPLOAD_FOLDER = 'uploads'  # Папка для сохранения загруженных файлов
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Создаем папку, если ее нет

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'} # Допустимые расширения файлов

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/chat", methods=["POST"])
def chat():
    message = request.form.get("message", "") # Получаем текст сообщения из формы
    file = request.files.get("file")  # Получаем файл из формы

    file_content = ""
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath) # Сохраняем файл на сервере

        try:
            with open(filepath, "r", encoding="utf-8") as f:
                file_content = f.read() # Читаем содержимое файла
        except Exception as e:
            file_content = f"Error reading file: {e}"
        finally:
            os.remove(filepath) # Удаляем файл после прочтения


    prompt = message + "\n" + file_content # Объединяем текст сообщения и содержимое файла

    payload = {
        "prompt": prompt,
        "model": MODEL_NAME,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, stream=False)
        response.raise_for_status()
        json_data = response.json()
        ollama_response = json_data.get("response", "No response from Ollama.")
        return jsonify({"response": ollama_response})

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with Ollama: {e}")
        return jsonify({"response": f"Error: Could not connect to Ollama. {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)