document.addEventListener("DOMContentLoaded", async () => {
    const messagesContainer = document.getElementById("messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // ✅ Fonction pour ajouter un message dans le chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        scrollToBottom(); // Auto-scroll vers le dernier message
    }

    // ✅ Fonction pour faire défiler automatiquement le chat vers le bas
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ✅ Message d’accueil d’AstroBot
    function astroBotIntro() {
        setTimeout(() => {
            addMessage("Bonjour ! Je suis AstroBot, ton guide astrologique et relationnel. 🌟", "bot");
            setTimeout(() => {
                addMessage("Par quoi souhaites-tu commencer ? Ton profil amoureux ? La compatibilité avec quelqu’un ? Ou peut-être une autre question qui te trotte dans la tête ? 🌟", "bot");
            }, 1200);
        }, 1000);
    }

    astroBotIntro(); // Lancement automatique


    // ✅ Fonction pour formater et afficher proprement le message
    function formatMessage(text) {
        // Remplace les sauts de ligne par des <br> pour la lisibilité
        text = text.replace(/\n/g, "<br>");

        // Convertit les mises en forme Markdown de base (gras, italique, etc.)
        text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // **Gras**
        text = text.replace(/\*(.*?)\*/g, "<em>$1</em>"); // *Italique*
        text = text.replace(/`(.*?)`/g, "<code>$1</code>"); // `Code`

        return text;
    }

    // ✅ Fonction pour ajouter un message dans le chat avec le bon format
    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);

        // ✅ Applique le formatage Markdown
        messageDiv.innerHTML = formatMessage(text);

        messagesContainer.appendChild(messageDiv);
        scrollToBottom(); // Auto-scroll vers le dernier message
    }


    // ✅ Fonction pour envoyer un message à l’API et afficher la réponse d’AstroBot
    async function sendMessage() {
        let userMessage = userInput.value.trim();
        if (!userMessage) return; // Empêche d'envoyer un message vide

        addMessage(userMessage, "user"); // Affiche le message de l'utilisateur
        userInput.value = ""; // Vide l'input

        try {
            const response = await fetch("https://astromatch-irbi.onrender.com/astrobot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Erreur de communication avec AstroBot.");
            }

            const data = await response.json();

            // ✅ Simule un temps de réponse pour rendre plus naturel
            setTimeout(() => {
                addMessage(data.reply, "bot");
            }, 1200);

        } catch (error) {
            console.error("Erreur:", error);
            addMessage("Désolé, je suis hors ligne. Réessaie plus tard !", "bot");
        }
    }

    // ✅ Événements pour envoyer un message
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
