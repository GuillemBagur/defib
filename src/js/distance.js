const axios = require("axios");
const { Console } = require("console");

const { connectDB } = require(__dirname + "/miscelaneous-functions.js");

const DesfibSchema = require(__dirname + "/../schemas/Desfib.js");

const apiVehiclesNames = {
  Ambulància: "drive",
  Cotxe: "drive",
  Bici: "bicycle",
};

// Aclarir tema queries/sec

/**
 * @param {object} toCoords - Destination coords
 * @param {object} vehicles - Associative array with the vehicles that the stablishment has
 * @returns The fastest travelMode (vehicle) to arrive to destination
 */
const checkDistance = async (defib, toCoords) => {
  const fromCoords = { x: defib.X, y: defib.Y };
  const vehicles = JSON.parse(defib.VEHICLES_DISPONIBLES || "{}");
  const threshold = 1000; // Assuming that Police'll come in less than 5 minutes
  const key = "3e707e48cc30488793f5f501b957dc5f"; // !Hide Key
  let travelModes = ["walk"]; // Walk is always a travel option
  // Then, filter the travelModes that the local has toggled on
  const dispVehicles = Object.entries(vehicles).filter((el) => el[1]);
  // Add them without repiting them
  dispVehicles.forEach((el) => {
    const travelMode = apiVehiclesNames[el[0]];
    if (!travelMode) return;
    if (travelModes.includes(travelMode)) return;
    travelModes.push(travelMode);
  });

  let travelTimes = [];
  const fromCoordsStr = `${fromCoords.y},${fromCoords.x}`; // They're twisted on pourpose. It's a bug.
  const toCoordsStr = `${toCoords.x},${toCoords.y}`;
  for (let travelMode of travelModes) {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/routing?waypoints=${fromCoordsStr}|${toCoordsStr}&mode=${travelMode}&apiKey=${key}`
      );
      const features = res.data.features[0];
      const { distance, time } = features.properties;
      if (time > threshold) continue;
      travelTimes.push({
        travelMode: travelMode,
        distance: distance,
        time: time,
      });
    } catch (err) {}
  }

  const sortedTimes = travelTimes.sort((a, b) => a.time - b.time);
  return sortedTimes[0];
};

module.exports.checkDistance = checkDistance;

const dbName = "patorrat";
const getDefibs = async (toCoords) => {
  const key = "e8ac7081bb57aa6b152e62b860eb7a72";
  const res = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${toCoords.x}&lon=${toCoords.y}&appid=${key}`);
  const location = res.data[0].name.toUpperCase();
  const con = connectDB(dbName);
  if(!con) {
    return false;
  }

  let locatedDefibs = await DesfibSchema.find({NOM_MUNI: location}).limit(5);
  let allDefibs = [];
  for (let d of locatedDefibs) {
    const defib = d._doc;
    const fastestTravelModeDefib = await checkDistance(defib, toCoords);
    if(!fastestTravelModeDefib) continue;
    let newDefib = {};
    newDefib.TIME = Math.round(fastestTravelModeDefib.time);
    newDefib.DISTANCE = fastestTravelModeDefib.distance;
    newDefib.TRAVEL_MODE = fastestTravelModeDefib.travelMode;
    newDefib.NOM = defib.NOM;
    newDefib.ADRECA = defib.BD_SALUT_DOMICILI || defib.ADRECA; // They're both fields.
    newDefib.TEL = defib.TELEFON;
    allDefibs.push(newDefib);
  }

  const sortedDefibs = allDefibs.sort((a, b) => a.TIME - b.TIME);
  return sortedDefibs;
};

module.exports.getDefibs = getDefibs;

const trolearPau = () => {
  console.log("👌");
};
