const express = require('express');
const app = express();
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const ejs = require("ejs");
const fs = require("fs");

dotenv.config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Définir le répertoire des vues
app.set('views', path.join(__dirname, 'views')); // Utilisation de path.join pour assurer la portabilité du chemin
app.set('view engine', 'ejs');

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

async function generateContent(weigth, height, gender, exp, disp, obj) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `donne moi un programme de musculation pour un pratiquant ${gender} qui a un objectif de ${obj}, qui fais ${height}cm pour ${weigth}kg qui peut s'entrainer jusqu'à ${disp} fois par semaine et qui est pratiquant depuis ${exp}, donne moi le résultat sous forme html :  <div class="wday"> <h2>jour x/7 : muscle concernés</h2> <br> <p>exercice 1 nom de l'exercice : series*repetitions</p> <br> <p>exercice n nom de l'exercice : series*repetitions</p></div> remarque: pas de notes ou de conseils et donne aumoins 5 exercices et aumoins 2 muscles a travailler par jour a part le jour des jambes. et les exercices tu choisis depuis cette liste : Développé couché à la barre, Développé couché aux haltères, Écarté à la poulie vis-à-vis, Pec-deck, Développé incliné à la barre, Développé incliné aux haltères, Dips, Écarté à la poulie vis-à-vis (bas des pecs), Tirage horizontal à la poulie, Tirage vertical à la poulie, Tractions, Rowing barre, Pull-over à la poulie, Soulevé de terre, Rowing haltères sur banc incliné, Rowing haltère à un bras, Tirage vertical prise serrée, Rowing "T-bar", Tirage unilateral poulie haute, Shrug haltères, Développé militaire (barre ou haltères), Développé épaules à la machine, Face pull, Élévations latérales à la poulie, Élévations latérales aux haltères, Pec deck inversé, Oiseau assis sur un banc, Oiseau buste penché, Élévations frontales, Curl biceps haltère, Curl biceps haltère incliné, Curl biceps à la barre, Curl biceps à la poulie, Spider curl aux haltères, Curl biceps à la machine, Curl marteau aux haltères, Curl marteau à la poulie, Extensions triceps à la poulie, Barre front pour triceps, Dips sur le banc, Extensions triceps nuque à la poulie, Crunch à la poulie, Planche, Crunch à la machine, Squat, Soulevé de terre roumain, Soulevé de terre jambes tendues, Soulevé de terre, Presse à cuisses, Hack squat, Hip thrust, Leg extension, Bulgarian split squats, Split squats aux haltères, Leg curl à la machine, Extension des mollets assis à la machine, Extension des mollets debout.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
}

// Route pour servir la page HTML
app.get('/', async (req, res) => {
    const weigth = req.query.weigth;
    const height = req.query.height;
    const gender = req.query.gender;
    const exp = req.query.exp;
    const disp = req.query.disp;
    const obj = req.query.obj;

    const text = await generateContent(weigth, height, gender, exp, disp, obj);
    res.render('index', { text });
});



// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
