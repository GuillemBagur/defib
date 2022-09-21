const socket = io();

/**
 * Emits the current coordinates to the backend via websockets
 */
const emitNewIncident = () => {
  const url = window.location.search;
  /* const params = new URLSearchParams(url);
  const lat = params.get("lat");
  const lon = params.get("lon"); */

  //* Since we use the POST method, we need to store the data in localStorage before we redirect the user
  const position = JSON.parse(localStorage.getItem("position") ?? "[]");
  localStorage.removeItem("position");
  const { lat, lon } = position;
  if (!lat || !lon) return;
  const incident = { x: lat, y: lon };
  socket.emit("newIncident", incident);
};

emitNewIncident();

const wrapper = document.getElementById("wrapper");

/**
 * Advise to user that a volunteer is coming (every time anyone tabs on this incident on volunteers' app)
 */
socket.on("volunteerComing", () => {
  showFBPopup("Està arribant un voluntari", "feedback-msg");
});
