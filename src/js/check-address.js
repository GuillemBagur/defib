// Check if the address name and the coords given coincide

const xCoordInput = document.getElementsByName("X")[0];
const yCoordInput = document.getElementsByName("Y")[0];
const addressInput = document.getElementsByName("ADRECA")[0];
// The element to display the appropiate feedback to (if the coords coincide or if they don't)
const addressFeedback = document.querySelector("[data-name=adreca]");

/**
 * 
 * @param {number} c1 First side
 * @param {number} c2 Second side
 * @returns The result of a pitagoras theorem
 */
const pitagoras = (c1, c2) => {
  const h = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
  return h;
};

// The max error ratio allowed
const maxDiam = 0.004; // Around 400m (parsed from coords to meters)

/**
 * @returns {bool} Depending if the given coords and the given address coincide or not
 */
const checkCoordsAdress = async () => {
  if (!xCoordInput.value.length) return;
  if (!yCoordInput.value.length) return;
  if (!addressInput.value.length) return;

  const coords = { x: xCoordInput.value, y: yCoordInput.value };
  const address = addressInput.value;

  const key = "3e707e48cc30488793f5f501b957dc5f";

  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${key}`
  );

  const json = await res.json();
  const data = json.results[0];

  const { lat, lon } = data;
  const diffs = {
    x: Math.abs(lat - coords.x),
    y: Math.abs(lon - coords.y),
  };

  const diam = pitagoras(diffs.x, diffs.y);
  if (diam > maxDiam) {
    feedbackInput(addressInput, false, "Las coordenadas y la dirección no concuerdan");
    return;
  }

  feedbackInput(addressInput, true);
};

addressInput.addEventListener("change", checkCoordsAdress);
xCoordInput.addEventListener("change", checkCoordsAdress);
yCoordInput.addEventListener("change", checkCoordsAdress);
