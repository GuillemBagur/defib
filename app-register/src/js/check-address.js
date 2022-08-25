const xCoordInput = document.getElementsByName("x")[0];
const yCoordInput = document.getElementsByName("y")[0];
const addressInput = document.getElementsByName("adreca")[0];
const addressFeedback = document.querySelector("[data-name=adreca]");

const pitagoras = (c1, c2) => {
  const h = Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2));
  return h;
};

const maxDiam = 0.004;
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
  console.log(json);
  const data = json.results[0];

  const { lat, lon } = data;
  const diffs = {
    x: Math.abs(lat - coords.x),
    y: Math.abs(lon - coords.y),
  };

  const diam = pitagoras(diffs.x, diffs.y);
  console.log(diffs);
  console.log(diam);
  if (diam > maxDiam) {
    addressFeedback.innerHTML = "Las coordenadas y la dirección no concuerdan";
    return;
  }

  const tick = document.querySelector(`span.tick[data-name=adreca]`);
  addressFeedback.innerHTML = "";
  addressInput.classList.add("validated");
  if (tick) tick.classList.add("show");
};

addressInput.addEventListener("change", checkCoordsAdress);
