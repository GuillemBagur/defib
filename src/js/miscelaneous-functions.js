const mongoose = require("mongoose");


const openPopup = (msg, isError) => {
  const bgClass = !isError ? "feedback-msg" : "feedback-err";
  document.innerHTML += `<span class="feedback-popup show ${bgClass}">${msg}</span>`;
}

module.exports.openPopup = openPopup;


/**
 * Connects with the main DB, and enters into the givern Mongo Collection
 * @param {String} collection
 */
const connectDB = async (collection) => {
  try {
    await mongoose.connect(
      `mongodb+srv://guillem:test@cluster0.sqgy5bb.mongodb.net/${collection}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};


module.exports.connectDB = connectDB;



/**
 * Gives feedback to user via backend
 * 
 * @param {object} res - HTTP response
 * @param {string} err - The error code
 * @param {string} url - The url to redirect the user to
 */
const feedBackErr = (res, err, url) => {
  res.render(url, { error: err });
};

module.exports.feedBackErr = feedBackErr;

/**
 * 
 * @param {string} string - String to hash
 * @param {string} algo - Algorithm to use
 * @returns Hashed string using the given algo
 */
const hash = (string, algo) => {
  return require("crypto").createHash(algo).update(string).digest("hex");
};

module.exports.hash = hash;


/**
 * 
 * @param {object} req - HTTP request
 * @param {object} res - HTTP response
 * @param {array} reqArgs - Required args (strings array)
 * @returns If all required args are being received or not
 */
const checkReqArgs = (req, res, reqArgs) => {
  for (let arg of reqArgs) {
    if (!req.body[arg]) {
      feedBackErr(res, "no-args", "register");
      return 0;
    }
  }

  return 1;
};

module.exports.checkReqArgs = checkReqArgs;


/**
 * @returns The current UNIX timestamp
 */
const getTimeStamp = () => {
  return Math.floor(Date.now() / 1000);
}

module.exports.getTimeStamp = getTimeStamp;



/**
 * Some cities are known by two different names (as my own town, Ciutadella).
 * This func is to make sure that all those cities always get the same name. 
 * @param {string} city - The city name to check if it has an ambiguous name or not
 * @returns {string} - The standarized city name
 */
const cityParser = (city) => {
  const allAmbiguousCities = {
    "CIUTADELLA": "Ciutadella de Menorca"
  };

  // UpperCase to make sure it gets the correct key
  return allAmbiguousCities[city.toUpperCase()] || city;
}

module.exports.cityParser = cityParser;