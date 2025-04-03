document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const feedbackMsg = document.getElementById("feedback-msg");

  const data = {
    name: form.elements["name"].value,
    email: form.elements["email"].value,
    message: form.elements["message"].value
  };

  try {
    const response = await fetch("/send-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      feedbackMsg.innerHTML = "✅ Merci pour votre message !";
      feedbackMsg.style.color = "#00ffae";
      form.reset();
    } else {
      feedbackMsg.innerHTML = "❌ Une erreur est survenue. Veuillez réessayer.";
      feedbackMsg.style.color = "#ff5e5e";
    }
  } catch (err) {
    feedbackMsg.innerHTML = "⚠️ Erreur de connexion. Vérifie ta connexion internet.";
    feedbackMsg.style.color = "#ffa500";
  }

  // ✅ Faire disparaître le message après 5 secondes
  setTimeout(() => {
    feedbackMsg.innerHTML = "";
  }, 5000);
});
