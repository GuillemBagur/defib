const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  id: String,
  x: String,
  y: String,
  city: String,
  volunteers: Number,
  timestamp: Number
});

module.exports = mongoose.model("IncidentSchema", IncidentSchema);
