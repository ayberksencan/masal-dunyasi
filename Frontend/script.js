document.getElementById("story-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const characters = document.getElementById("characters").value.trim();
  const setting = document.getElementById("setting").value.trim();
  const theme = document.getElementById("theme").value.trim();

  if (!characters || !setting || !theme) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }

  try {
    const response = await fetch("/generate-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ characters, setting, theme })
    });

    if (!response.ok) {
      throw new Error("Sunucudan geçersiz yanıt alındı: " + response.status);
    }

    const data = await response.json();
    const storyText = data.story;

    document.getElementById("story-text").innerText = storyText;
    document.getElementById("story-output").style.display = "block";

    document.getElementById("read-story").onclick = function () {
      const utterance = new SpeechSynthesisUtterance(storyText);
      utterance.lang = "tr-TR";
      speechSynthesis.speak(utterance);
    };
  } catch (error) {
    console.error("Masal oluşturulurken hata oluştu:", error);
    alert("Masal oluşturulamadı. Lütfen daha sonra tekrar deneyiniz.");
  }
});
