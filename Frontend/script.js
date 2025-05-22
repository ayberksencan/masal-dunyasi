document.getElementById("story-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const characters = document.getElementById("characters").value.trim();
  const setting = document.getElementById("setting").value.trim();
  const theme = document.getElementById("theme").value.trim();

  if (!characters || !setting || !theme) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  // Yükleme animasyonunu göster, sonucu gizle
  document.getElementById("loading-indicator").style.display = "block";
  document.getElementById("story-output").style.display = "none";

  try {
    const response = await fetch("/generate-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ characters, setting, theme })
    });

    // Yanıt geldiyse yüklemeyi gizle
    document.getElementById("loading-indicator").style.display = "none";

    if (!response.ok) {
      throw new Error("Sunucudan geçersiz yanıt alındı: " + response.status);
    }

    const data = await response.json();
    const storyText = data.story;

    document.getElementById("story-text").innerText = storyText;
    document.getElementById("story-output").style.display = "block";
  } catch (error) {
    console.error("Masal oluşturulurken hata oluştu:", error);
    alert("Masal oluşturulamadı. Lütfen daha sonra tekrar deneyiniz.");
    document.getElementById("loading-indicator").style.display = "none";
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
