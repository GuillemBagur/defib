const socket = io();
const incidentsList = document.getElementById("incidents-list");
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
let city = localStorage.getItem("volunteer-city");

socket.on("incidents", (incidents) => {
  city = cityInput.value;
  const filteredIncidents = incidents.filter((el) => el.city === city);
  incidentsList.innerHTML = "";
  for (let incident of filteredIncidents) {
    incidentsList.innerHTML += `
            <li data-id="${incident.id}" data-x="${incident.x}" data-y="${incident.y}" data-volunteers="${incident.volunteers}">${incident.x}, ${incident.y} (${incident.volunteers})</li>
        `;
  }
});

const getIncidents = (city) => {
  socket.emit("get-incidents", city);
};

const getCityOnLoad = () => {
  city = localStorage.getItem("volunteer-city");
  getIncidents(city);
  if (!city) return;
  cityInput.value = city;
};

getCityOnLoad();

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  localStorage.setItem("volunteer-city", city);
  getIncidents(city);
});

const openGoogleMaps = (from, to) => {
  if (!from.x || !from.y || !to.x || !to.y) return;
  const newTab = window.open(
    `https://www.google.es/maps/dir/${from.x},${from.y}/${to.x},${to.y}/`,
    "_blank"
  );
  newTab.focus();
};

incidentsList.addEventListener("click", (e) => {
  const el = e.target;
  if (el.tagName != "LI") return;
  if (!el.dataset.id) return;
  const id = el.dataset.id;
  const volunteersNum = el.dataset.volunteers;
  socket.emit("addVolunteer", id, volunteersNum);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const from = { x: coords.latitude, y: coords.longitude };
      const to = { x: el.dataset.x, y: el.dataset.y };
      openGoogleMaps(from, to);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});
