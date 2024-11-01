/*

* API Vinted

* Modèle User

*/

// Import de mongoose
const mongoose = require("mongoose");

//Modèle d'un user
const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
