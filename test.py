import requests

API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
headers = {"Authorization": "Bearer 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"}  # Buraya kendi tokenını yaz

response = requests.post(API_URL, headers=headers, json={"inputs": "Karakterler: Uçan Tavşan. Mekan: Sihirli Orman. Tema: Cesaret"})
print("Dönen Yanıt:")
print(response.status_code)
print(response.text)