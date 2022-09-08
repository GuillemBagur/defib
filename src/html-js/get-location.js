const sendPosition = ({ coords }) => {
  if (!coords) {
    alert("Error");
    return;
  }

  window.location.href = `/?lat=${coords.latitude}&lon=${coords.longitude}&acc=${coords.accuracy}`;
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(sendPosition);
} else {
  alert("Geolocation is not supported by this browser.");
}
