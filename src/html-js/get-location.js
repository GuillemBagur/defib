/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the parameters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

const post = (path, params, method = "post") => {
  console.log("polaris");
  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement("form");
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      console.log(key);
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
  console.log("done");
};

/**
 * Redirects the user to the same url but with with the current coordinates as GET params //! Change it to POST?
 * @param {object} Coords - The lat and lon of the current position
 */
const sendPosition = ({ coords }) => {
  if (!coords) {
    alert("Error");
    return;
  }

  localStorage.setItem("position", JSON.stringify({lat: coords.latitude, lon: coords.longitude, acc: coords.accuracy}));
  post("/", {lat: coords.latitude, lon: coords.longitude, acc: coords.accuracy});
  //window.location.href = `/?lat=${coords.latitude}&lon=${coords.longitude}&acc=${coords.accuracy}`;
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(sendPosition);
} else {
  alert("Geolocation is not supported by this browser.");
}
