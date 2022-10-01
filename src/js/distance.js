const axios = require("axios");

const { connectDB } = require(__dirname + "/miscelaneous-functions.js");

const DesfibSchema = require(__dirname + "/../schemas/Desfib.js");

// An object to parse the DB-data to the data that the API needs
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
  const threshold = 900; // Assuming that Police'll come in less than 15 minutes (900)
  const key = process.env.GEOAPIFY_API_KEY;
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



const genEstablishmentSchedule = (defib) => {
  let opening = new Date();
  opening.setHours(defib.HORARI_INICI.split(":")[0]);
  opening.setMinutes(defib.HORARI_INICI.split(":")[1]);

  let closing = new Date();
  closing.setHours(defib.HORARI_FINAL.split(":")[0]);
  closing.setMinutes(defib.HORARI_FINAL.split(":")[1]);
  const openingTimes = {
    openingTime: opening,
    closingTime: closing
  };

  return openingTimes;
}


/**
 * 
 * @param {object} toCoords An object containing the lat and lon coords
 * @returns All the defibs in range sorted by lowest distance
 */
const getDefibs = async (toCoords) => {
  const key = process.env.OPENWEATHERMAP_API_KEY;
  /* toCoords.x = 39.98737668489519;
  toCoords.y = 4.093589708095359; */
  const res = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${toCoords.x}&lon=${toCoords.y}&appid=${key}`);
  const location = res.data[0].name.toUpperCase();
  const dbName = "patorrat";
  const con = await connectDB(dbName);
  if(!con) {
    return false;
  }


  const now = new Date();
  const currentTime = (now.toISOString().substring(8, 11));
  const locatedDefibs = await DesfibSchema.find({NOM_MUNI: location, DISPONIBLE: {$ne: false}});
  const timeTableFilteredDefibs = locatedDefibs.filter(defib => {
    if(!defib.HORARI_INICI || !defib.HORARI_FINAL) return defib;
    const openingTimes = genEstablishmentSchedule(defib);
    if(now > openingTimes.openingTime && now < openingTimes.closingTime) return defib;
  });

  let allDefibs = [];
  for (let d of timeTableFilteredDefibs) {
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
