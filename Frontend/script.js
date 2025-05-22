document.getElementById("story-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const characters = document.getElementById("characters").value.trim();
  const setting = document.getElementById("setting").value.trim();
  const theme = document.getElementById("theme").value.trim();
  const submitBtn = document.querySelector("#story-form button");

  if (!characters || !setting || !theme) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  // Butonu devre dışı bırak ve yükleme göster
  submitBtn.disabled = true;
  submitBtn.textContent = "⏳ Oluşturuluyor...";
  document.getElementById("loading-indicator").style.display = "block";
  document.getElementById("story-output").style.display = "none";

  try {
    const response = await fetch("/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ characters, setting, theme })
    });

    document.getElementById("loading-indicator").style.display = "none";
    submitBtn.disabled = false;
    submitBtn.textContent = "✨ Masalı Oluştur";

    if (!response.ok) {
      throw new Error("Sunucu şu anda yanıt veremiyor. Lütfen daha sonra tekrar deneyin.");
    }

    const data = await response.json();
    const storyText = data.story;

    document.getElementById("story-text").innerText = storyText;
    document.getElementById("story-output").style.display = "block";
  } catch (error) {
    console.error("Masal oluşturulurken hata:", error);
    alert("😢 Üzgünüz, masal şu anda oluşturulamadı.\nLütfen birkaç dakika sonra tekrar deneyin.");
    document.getElementById("loading-indicator").style.display = "none";
    submitBtn.disabled = false;
    submitBtn.textContent = "✨ Masalı Oluştur";
  }
});

// ▶️⏸🔁⏹ Sesli okuma kontrolleri
let currentUtterance;

document.getElementById("start-reading").onclick = function () {
  const text = document.getElementById("story-text").innerText;
  if (!text) return;

  if (speechSynthesis.speaking) speechSynthesis.cancel();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.lang = "tr-TR";
  speechSynthesis.speak(currentUtterance);
};

document.getElementById("pause-reading").onclick = function () {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
  }
};

document.getElementById("resume-reading").onclick = function () {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  }
};

document.getElementById("stop-reading").onclick = function () {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
  }
};
