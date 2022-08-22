const mongoose = require("mongoose");

const DesfibSchema = new mongoose.Schema({
  the_geom: String,
  objectid: String,
  nom: String,
  x: Number,
  y: Number,
  adreca: String,
  municipi: String,
  ine_mun: String,
  illa: String,
  programaps: String,
  nom_2: String,
  descripcio: String,
  horari_inici: String,
  horari_final: String,
  vehicles_disponibles: Object,
  tel: String,
  disponible: Boolean,
  ultima_revisio: String,
});

module.exports = mongoose.model("DesfibSchema", DesfibSchema);
