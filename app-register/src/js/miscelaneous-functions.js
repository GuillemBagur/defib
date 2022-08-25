const mongoose = require("mongoose");

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
