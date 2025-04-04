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


    // ✅ Fonction améliorée pour formater proprement le texte en HTML
function formatMessage(text) {
    // Supprime les séparateurs Markdown type --- ou ___
    text = text.replace(/^-{2,}|_{2,}|~{2,}/gm, "");

    // En-têtes Markdown (#, ##, ###, ####) -> convertis en <strong> (ou <h3> si tu préfères)
    text = text.replace(/^#{1,4}\s*(.+)$/gm, "<strong>$1</strong>");

    // Gras (**bold**)
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Italique (*italic*)
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Code `inline`
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");

    // Remplace les sauts de ligne par <br>
    text = text.replace(/\n/g, "<br>");

    // Supprime les espaces multiples en fin de lignes
    text = text.replace(/[ \t]+$/gm, "");

    return text.trim(); // Nettoie les blancs début/fin
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
