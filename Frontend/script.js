const LANGUAGES = {
  tr: {
    title: "🧚‍♀️ Masal Dünyası",
    labelCharacters: "Karakterler",
    labelSetting: "Mekan",
    labelTheme: "Tema",
    buttonCreate: "✨ Masalı Oluştur",
    loading: "Masal oluşturuluyor, lütfen bekleyin...",
    heading: "📖 Masal",
    error: "Üzgünüz, masal oluşturulamadı. Lütfen tekrar deneyin.",
    speak: "Oku", pause: "Duraklat", resume: "Devam Et", stop: "Durdur"
  },
  en: {
    title: "🧚‍♀️ Fairytale World",
    labelCharacters: "Characters",
    labelSetting: "Setting",
    labelTheme: "Theme",
    buttonCreate: "✨ Generate Story",
    loading: "Generating story, please wait...",
    heading: "📖 Story",
    error: "Sorry, the story could not be generated. Please try again.",
    speak: "Read", pause: "Pause", resume: "Resume", stop: "Stop"
  }
};

let currentLanguage = "tr";
let currentUtterance;

// Dil metinlerini güncelle
function updateLanguageUI(lang) {
  const L = LANGUAGES[lang];
  document.getElementById("title").textContent = L.title;
  document.getElementById("label-characters").textContent = L.labelCharacters;
  document.getElementById("label-setting").textContent = L.labelSetting;
  document.getElementById("label-theme").textContent = L.labelTheme;
  document.getElementById("submit-button").textContent = L.buttonCreate;
  document.getElementById("loading-text").textContent = L.loading;
  document.getElementById("story-heading").textContent = L.heading;
  document.getElementById("start-reading").textContent = "▶️ " + L.speak;
  document.getElementById("pause-reading").textContent = "⏸ " + L.pause;
  document.getElementById("resume-reading").textContent = "🔁 " + L.resume;
  document.getElementById("stop-reading").textContent = "⏹ " + L.stop;
}

document.getElementById("language-selector").addEventListener("change", (e) => {
  currentLanguage = e.target.value;
  updateLanguageUI(currentLanguage);
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

// Tema tercihini geri yükle
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

// Sayfa açıldığında dil güncelle
updateLanguageUI(currentLanguage);

// Masal oluşturma
document.getElementById("story-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const chars = document.getElementById("characters").value.trim();
  const setting = document.getElementById("setting").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const submitBtn = document.getElementById("submit-button");

  if (!chars || !setting || !theme) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ ...";
  document.getElementById("loading-indicator").style.display = "block";
  document.getElementById("story-output").style.display = "none";

  const prompt =
    currentLanguage === "tr"
      ? `Aşağıdaki bilgilerle kısa, eğitici ve eğlenceli bir Türkçe çocuk masalı yaz:\nKarakterler: ${chars}\nMekan: ${setting}\nTema: ${theme}`
      : `Write a short, educational and fun children's story in English based on the following:\nCharacters: ${chars}\nSetting: ${setting}\nTheme: ${theme}`;

  try {
    const response = await fetch("/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characters: chars, setting, theme, language: currentLanguage, prompt })
    });

    const data = await response.json();
    document.getElementById("story-text").innerText = data.story;
    document.getElementById("story-output").style.display = "block";
  } catch (err) {
    alert(LANGUAGES[currentLanguage].error);
  }

  document.getElementById("loading-indicator").style.display = "none";
  submitBtn.disabled = false;
  submitBtn.textContent = LANGUAGES[currentLanguage].buttonCreate;
});

// Ses kontrolleri
document.getElementById("start-reading").onclick = () => {
  const text = document.getElementById("story-text").innerText;
  if (!text) return;
  if (speechSynthesis.speaking) speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = currentLanguage === "en" ? "en-US" : "tr-TR";
  speechSynthesis.speak(currentUtterance);
};

document.getElementById("pause-reading").onclick = () => {
  if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.pause();
};

document.getElementById("resume-reading").onclick = () => {
  if (speechSynthesis.paused) speechSynthesis.resume();
};

document.getElementById("stop-reading").onclick = () => {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
};
