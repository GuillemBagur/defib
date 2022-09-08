const sendButton = document.getElementById("send-button");
const disp = document.getElementsByName("DISPONIBLE")[0];

// Make checkboxes' value be true or false
sendButton.addEventListener("click", () => {
  const vehiclesCheckboxes = document.getElementsByName(
    "VEHICLES_DISPONIBLES_CHECKBOXES"
  );
  const dispVehiclesInput = document.getElementsByName(
    "VEHICLES_DISPONIBLES"
  )[0];
  let dispVehicles = {};
  for (let el of vehiclesCheckboxes) {
    dispVehicles[el.dataset.label] = el.checked;
  }

  dispVehiclesInput.value = JSON.stringify(dispVehicles);
  disp.value = disp.checked;
});
