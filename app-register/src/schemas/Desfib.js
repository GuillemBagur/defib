const mongoose = require("mongoose");

const DesfibSchema = new mongoose.Schema({
  the_geom: String,
  OBJECTID: String,
  NOM: String,
  X: Number,
  Y: Number,
  ADRECA: String,
  NOM_MUNI: String,
  INE_MUN: String,
  ILLA: String,
  PROGRAMAPS: String,
  NOM_2: String,
  DESCRIPCIO: String,
  HORARI_INICI: String,
  HORARI_FINAL: String,
  VEHICLES_DISPONIBLES: Object,
  TELEFON: String,
  DISPONIBLE: Boolean,
  UTLIMA_REVISIO: String,
});

module.exports = mongoose.model("DesfibSchema", DesfibSchema);
