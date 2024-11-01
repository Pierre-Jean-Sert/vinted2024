/*

* API Vinted

* Serveur

*/

//! Import de express + création du serveur + import de mongoose + import de fileIupload
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//! Import et de cors - Cross-origin resource sharing
const cors = require("cors");
app.use(cors());

const fileUpload = require("express-fileupload");

// Permettre au serveur de récupérer des body
app.use(express.json());

//Permet d'activer les variables d'environnement
require("dotenv").config();

//* <--- BDD --->

// Connexion à la BDD Vinted
mongoose.connect(process.env.MONGODB_URI);

//* <--- SERVEUR --->

//* SERVICE : HOME
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur Vinted" });
});

//* IMPORT ET UTILISATION DES AUTRES SERVICES
//Route User
const userRouter = require("./routes/user");
app.use(userRouter);

//Route Offer
const offerRouter = require("./routes/offer");
app.use(offerRouter);

//* SERVICE : ROUTE POUBELLE
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

//* ECOUTE DU SERVEUR
app.listen(process.env.PORT, () => {
  console.log("Server started 😶‍🌫️");
});

//* <--- FIN SERVEUR --->
