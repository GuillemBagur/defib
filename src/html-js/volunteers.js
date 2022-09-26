const socket = io();
const incidentsList = document.getElementById("incidents-list");
const searchBtn = document.getElementById("search-btn");
const orderBy = document.getElementById("order-by");
const cityInput = document.getElementById("city-input");
let city = localStorage.getItem("volunteer-city");
let incidents;

const notifyNewAdvice = async (coords, time) => {
  const notifPerm = await Notification.requestPermission();
  if (notifPerm !== "granted") return;
  const notif = new Notification("Nuevo incidente", {
    body: `Coordenadas ${coords.latitude},${coords.longitude}`,
    data: { coords: coords, time: time },
    vibrate: true
  });
};

/**
 * Receives all the incidents from the server and renders them into the view
 * @param {array} socketIncidents - The array of incidents sent by the server via websockets
 */
const renderIncidents = (socketIncidents) => {
  incidents = socketIncidents; // Give that to the global var incidents
  city = cityInput.value;
  const filteredIncidents = incidents.filter((el) => el.city === city);
  incidentsList.innerHTML = "";
  const volunteerMessages = {
    0: "No hi ha cap voluntari anant-hi.",
    1: "Hi ha un voluntari anant-hi.",
  };

  for (let incident of filteredIncidents) {
    const volunteerMessage =
      volunteerMessages[incident.volunteers] ??
      `Ja hi estan anant ${incident.volunteers} voluntaris.`;

    const incidentTime = new Date(incident.timestamp);
    incidentsList.innerHTML += `
            <li class="el main-list__el" data-id="${incident.id}" data-x="${
      incident.x
    }" data-y="${incident.y}" data-volunteers="${incident.volunteers}"><a>
              <div class="el__data"> 
                <h3 class="el__title">${incident.x}, ${incident.y}</h3>
                <h4 class="el__subtitle">${volunteerMessage}</h4>
              </div>
              <span class="el__append">${new Date(incident.timestamp * 1000)
                .toISOString()
                .substring(11, 16)}
                <iconify-icon class="icon" icon="carbon:timer"></iconify-icon></span>
            </a></li>
        `;
  }
};

socket.on("incidents", renderIncidents);

/**
 * Makes a request to receive all the incidents in an specific city
 * @param {string} city - The city to get all the incidents from
 */
const getIncidents = (city) => {
  socket.emit("get-incidents", city);
};

/**
 * Gets the city stored in localStorage (the last city that the client used)
 */
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

/**
 * Redirects user to a Google Map that shows the fastest route to
 * reach to the incident
 *
 * @param {object} from - Current client coords
 * @param {object} to - The coords of the incident
 */
const openGoogleMaps = (from, to) => {
  if (!from.x || !from.y || !to.x || !to.y) return;
  const newTab = window.open(
    `https://www.google.es/maps/dir/${from.x},${from.y}/${to.x},${to.y}/`,
    "_blank"
  );
  newTab.focus();
};

/**
 * Adds a new volunteer to the clicked incident
 * @param {event} e - The event propagated by the eventListener
 */
const addVolunteer = (e) => {
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
};

incidentsList.addEventListener("click", addVolunteer);

// A list of funcs to sort the way that the incidents are being displayed in the app
const orderFuncs = {
  "least-volunteers": (incidents) => {
    return incidents.sort((a, b) => a.volunteers - b.volunteers);
  },

  /* "nearest": (incidents) => { //! Needing users' permission for this case
    return incidents.sort((a, b) => a.)
  } */

  "most-recent": (incidents) => {
    return incidents.sort((a, b) => b.timestamp - a.timestamp);
  },

  "least-recent": (incidents) => {
    return incidents.sort((a, b) => a.timestamp - b.timestamp);
  },
};

orderBy.addEventListener("change", () => {
  const filter = orderBy.value;
  const sortedIncidents = orderFuncs[filter](incidents);
  renderIncidents(sortedIncidents);
});


socket.on("notifIncident", incident => {
  console.log("received");
  notifyNewAdvice({
    latitude: incident.x,
    longitude: incident.y,
    time: incident.time,
  });
})