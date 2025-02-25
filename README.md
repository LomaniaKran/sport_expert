# Sport_expert
 Проект для общения с языковой моделью Ollama, на тему спорта.

 ## Запуск проекта
  ### 1. Установка необходимых программ
   Python 3.7 или выше
   
   Ollama

   
  ### 2. Копирование проекта
   Скопируйте проект в папку "sport_expert" на ваше устройство по пути C:\Users\ {ваше имя пользователя}.

   
  ### 3. Создание и активация виртуального окружения (venv)
   Откройте терминал/командную строку и перейдите в корневую директорию вашего проекта (sport_expert).
   
   Создайте виртуальное окружение " python -m venv venv "

   Активируйте " venv\Scripts\activate.bat "

  ### 4. Установка зависимостей Python
   Установите необходимые пакеты из файла " pip install -r requirements.txt "

  ### 5. Установка и запуск модели Ollama
   Создайте модель Ollama " ollama pull llama3.2 ", " ollama create sport_exp -f ./Modelfile " и

  ### 6. Запуск Flask-приложения
   том же терминале (с активным виртуальным окружением) запустите Flask-приложение " python app.py "

  ### 7. Откройте
   Откройте веб-браузер и перейдите по адресу, указанному Flask (http://127.0.0.1:5000/).
