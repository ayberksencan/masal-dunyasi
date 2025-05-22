import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Flask app tanımı
app = Flask(__name__, static_folder="frontend", static_url_path="")
CORS(app)

# OpenRouter API ayarları
API_URL = "https://openrouter.ai/api/v1/chat/completions"
API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "mistralai/mistral-7b-instruct"  # Alternatif: "openai/gpt-3.5-turbo"

HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/generate-story", methods=["POST"])
def generate_story():
    data = request.get_json()
    characters = data.get("characters", "")
    setting = data.get("setting", "")
    theme = data.get("theme", "")

    prompt = (
        f"Aşağıdaki bilgilerle kısa, eğitici ve eğlenceli bir Türkçe çocuk masalı yaz:\n"
        f"Karakterler: {characters}\n"
        f"Mekan: {setting}\n"
        f"Tema: {theme}\n"
    )

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "Sen yaratıcı ve eğitici bir Türkçe çocuk masalı yazıcısısın."},
            {"role": "user", "content": prompt}
        ]
    }

    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        print("API RAW STATUS:", response.status_code)
        print("API RAW RESPONSE:", response.text)

        result = response.json()
        story = result["choices"][0]["message"]["content"]
        return jsonify({"story": story})

    except Exception as e:
        print("OpenRouter HATASI:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8000)
