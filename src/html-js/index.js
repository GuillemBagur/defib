const socket = io();
const emitNewIncident = () => {
  const url = window.location.search;
  const params = new URLSearchParams(url);
  const lat = params.get("lat");
  const lon = params.get("lon");
  if (!lat || !lon) return;
  const incidentId = `${lat},${lon}`;
  const incident = { x: lat, y: lon };
  socket.emit("newIncident", incident);
};

emitNewIncident();

const wrapper = document.getElementById("wrapper");
socket.on("volunteerComing", () => {
  showFBPopup("Està arribant un voluntari", "feedback-msg");
});
