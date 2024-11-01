/*

* API Vinted

* Middleware isAuthor


*/

//! Import du modèle Offer
const Offer = require("../models/Offer");

//* Fonction isAuthor
const isAuthor = async (req, res, next) => {
  //
  //Vérification que l'offre consulté a bien été créée par le user
  let offerToCheck = await Offer.findById({ _id: req.params.id });
  offerToCheck = await offerToCheck.populate("owner");

  //A noter : on peut utiliser req.user car on utilise précédemment isAuthenticated
  if (req.user.token !== offerToCheck.owner.token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  //Accès autorisé
  return next();
};

module.exports = isAuthor;
