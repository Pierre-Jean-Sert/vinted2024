/*

* API Vinted

* Fonction de traitement et d'upload via Cloudinary

*/

//! Import et paramétrage de Cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//* Fonction de conversion en base 64
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

//* Fonction de traitement de l'image
const cloudinaryUploadFunction = async (
  picture,
  pictureName,
  pictureFolder
) => {
  //
  // Conversion de l'image en base 64
  const convertedPicture = convertToBase64(picture);

  //Upload de l'image chez Cloudinary
  const pictureUploaded = await cloudinary.uploader.upload(convertedPicture, {
    folder: pictureFolder,
    display_name: pictureName,
  });

  return pictureUploaded; //Retourne l'objet picture de Cloudinary
};

module.exports = cloudinaryUploadFunction;
