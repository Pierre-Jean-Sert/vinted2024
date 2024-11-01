/*

* API Vinted

* Router Offer

*/

//! Import de express + fonction router d'express + fileUpload
const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

//! Import des modèles
const Offer = require("../models/Offer");

//! Import des middlewares
// Vérifie si l'utilisateur est connecté
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAuthor = require("../middlewares/isAuthor");

//! Import des utils
const cloudinaryUploadFunction = require("../utils/cloudinaryUploadFunction.js");

//
//* SERVICE : POSTER UNE ANNONCE
//
router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      //

      //Destructuring de l'objet req.body
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      //Creation de l'offre
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ETAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: null,
        owner: req.user._id, //On peut utiliser req.user car on a le middleware isAuthenticated
      });

      //Si une image a été envoyée
      if (req.files.picture !== undefined) {
        //Traitement de l'image envoyée
        const pictureUploaded = await cloudinaryUploadFunction(
          req.files.picture, //photo à uploader
          newOffer._id, //id de la photo = id de l'offre
          "/vinted/offers" //chemin du dossier dans Cloudinary
        );

        //Update de l'offre avec le lien sécurisé de l'image
        newOffer.product_image = pictureUploaded.secure_url;
      }

      // Enregistrement de l'offre
      await newOffer.save();

      //Retour au client
      res.status(201).json(newOffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//
//* SERVICE : SUPPRIMER UNE ANNONCE
//
router.delete(
  "/offer/delete/:id",
  isAuthenticated,
  isAuthor,
  async (req, res) => {
    try {
      //Suppression de l'annonce correspondant à l'id communiqué
      const offerToDelete = await Offer.findOneAndDelete({
        _id: req.params.id,
      });

      //Retour au client
      res.status(200).json({ message: "Annonce supprimée" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//
//* SERVICE : RECHERCHER UNE ANNONCE
//
router.get("/offers", async (req, res) => {
  try {
    //
    // Destructuring de req.query
    const { page, title, priceMin, priceMax, sort } = req.query;

    //Nombre de résultats par page
    const limit = 2;

    //On crée les objets nécessaires aux filtres
    const filters = {};
    const sortObj = {};
    let skip = 0;

    //Filtre titre
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    //Filtre priceMin
    if (priceMin) {
      filters.product_price = { $gte: Number(priceMin) };
    }

    //Filtre priceMax
    if (priceMax) {
      if (priceMin) {
        filters.product_price.$lte = Number(priceMax);
      } else {
        filters.product_price = { $lte: Number(priceMax) };
      }
    }

    //Filtre sort
    if (sort === "price-asc") {
      sortObj.product_price = "asc";
    } else if (sort === "price-desc") {
      sortObj.product_price = "desc";
    }

    //Filtre page
    if (page) {
      skip = (page - 1) * limit;
    }

    //Construction de la requête
    const offers = await Offer.find(filters)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("owner", "account");

    //Retour au client
    const totalCount = await Offer.countDocuments(filters);

    res.status(200).json({ count: totalCount, offers: offers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//
//* SERVICE : RECUPERER LE DETAIL D'UNE ANNONCE VIA SON Id
//
router.get("/offers/:id", async (req, res) => {
  try {
    //
    const offerToFind = await Offer.findById(req.params.id)
      .populate({
        path: "owner",
        select: "account _id",
      })
      .select("-_id -product_name -product_description -product_price");

    //Retour au client
    return res.status(200).json(offerToFind);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Export des routes
module.exports = router;
