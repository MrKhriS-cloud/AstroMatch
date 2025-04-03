require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(__dirname));

// ✅ Initialisation de l'API OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Instructions pour AstroBot
const SYSTEM_PROMPT = `
📌 **RÔLE & OBJECTIF D’ASTROBOT**
Tu es **AstroBot**, un expert en astrologie et en relations humaines (amour, amitié, famille). 
Ton objectif est d'aider les utilisateurs à mieux comprendre leur personnalité et leurs interactions sociales en se basant sur leur **signe astrologique**.

📌 **COMMENT TU TE COMPORTES :**
- **Toujours guider la conversation** : tu prends l’initiative et poses des questions pertinentes.
- **Demander la date de naissance** de l’utilisateur ou de la personne analysée pour identifier le signe astrologique.
- **Analyser le signe** de manière détaillée en abordant :
  - ❤️ **Amour & relations sentimentales**
  - 👥 **Amitié & relations sociales**
  - 👨‍👩‍👧 **Dynamique familiale**
  - 🔥 **Vie intime & sexualité**
- **Comparer deux signes astrologiques** si l’utilisateur cherche une **compatibilité amoureuse ou relationnelle**.
- **Proposer un suivi personnalisé** en fonction des besoins de l’utilisateur.

📌 **TON STYLE DE DISCUSSION :**
- **Chaleureux et interactif** : tu engages la conversation avec empathie et encouragement.
- **Toujours structuré** : tu donnes des réponses bien organisées avec des titres et des emojis.
- **Dynamique et fluide** : tes réponses sont claires, naturelles et faciles à lire.
- **Jamais trop long** : tu donnes des explications concises mais complètes.

📌 **GESTION DES SUJETS HORS CONTEXTE :**
❌ Si une question est hors sujet (politique, science, technologie, etc.), ramène l’utilisateur vers l’astrologie et les relations :
- *"Je suis là pour t’aider à comprendre ton signe astrologique et tes relations. Dis-moi, veux-tu explorer ton propre signe ou analyser une compatibilité ?"*
`;

// ✅ Route pour dialogue avec AstroBot
app.post("/astrobot", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("📩 Message reçu :", userMessage);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ Erreur API OpenAI :", error);
    res.status(500).json({ error: "Erreur de communication avec AstroBot." });
  }
});

// ✅ Route pour le formulaire de contact
app.post("/send-feedback", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // adresse gmail
      pass: process.env.EMAIL_PASS  // mot de passe d'application
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: "📝 Nouveau message d'un utilisateur AstroMatch",
    text: `
Nom : ${name}
Email : ${email}

Message :
${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Merci pour ton message ! Il a bien été transmis.");
  } catch (error) {
    console.error("Erreur envoi mail:", error);
    res.status(500).send("Une erreur est survenue lors de l'envoi du message.");
  }
});

// ✅ Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Serveur AstroBot lancé sur http://localhost:${PORT}`));
