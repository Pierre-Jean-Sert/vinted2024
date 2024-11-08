/*

* API Vinted

* Modèle Offer

*/

// Import de mongoose
const mongoose = require("mongoose");

//Modèle d'une offre
const Offer = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Offer;
