/*

* API Vinted

* Middleware isAuthenticaded

*/

//! Import du modèle User
const User = require("../models/User");

//* Fonction isAuthenticated
const isAuthenticated = async (req, res, next) => {
  //
  //Vérification que le token a été transmis
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  //Récupération de l'user correspondant au token
  const user = await User.findOne({
    token: req.headers.authorization.replace("Bearer ", ""),
  });

  //Vérification que l'user associé au token existe
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    req.user = user; // On crée une clé "user" dans req. La route dans laquelle le middleware est appelé pourra avoir accès à req.user
    return next();
  }
};

module.exports = isAuthenticated;
