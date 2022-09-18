const form = document.getElementById("form");
const validatedInputs = document.getElementById("validated-inputs");
const popupMustValidate = document.getElementById("popup-must-validate");

/**
 * Gives feedback at the bottom of the given input
 * 
 * @param {HTMLelement} input - The input to give the feedback
 * @param {boolean} success - If the feedback is positive (then, true) or negative (false)
 * @param {string} message - The message that the feedback element has to show
 */
const feedbackInput = (input, success, message) => {
  const span = document.querySelector(
    `span.form__input-feedback[data-name=${input.name}]`
  );

  const tick = document.querySelector(`span.tick[data-name=${input.name}]`);

  if (span) span.innerHTML = "";
  input.classList.remove("validated");
  input.classList.remove("not-validated");
  if (tick) tick.classList.remove("show");

  if (!success) {
    input.classList.add("not-validated");
    if (span) span.innerHTML = message;
    validatedInputs.value = "error";
    return;
  }


  input.classList.add("validated");
  if (tick) tick.classList.add("show");
  validatedInputs.value = "";
};

form.addEventListener("submit", (e) => {
  if (validatedInputs.value.length) {
    popupMustValidate.classList.add("show");
    e.preventDefault();
  }
});

/**
 * Checks if passwords coincide or not. Then, it gives the appropiate feedback
 * @param {event} e - The event propagated from the eventListener
 */
const checkPws = (e) => {
  const input = e.target;
  const span = document.querySelector(
    `span.form__input-feedback[data-name=${input.name}]`
  );

  if (input.name != "repeatPw") return;

  // Get the tick inside every input to, if everything is correct, appear.

  if (span) span.innerHTML = "";
  input.classList.remove("validated");
  input.classList.remove("not-validated");
  const tick = document.querySelector(`span.tick[data-name=${input.name}]`);
  if (tick) tick.classList.remove("show");
  const repeatPw = document.getElementsByName("repeatPw")[0].value;
  const pw = document.getElementsByName("pw")[0].value;

  if (repeatPw != pw && repeatPw.length) {
    feedbackInput(input, false, "Las contraseñas no coinciden");
    return;
  }

  if (repeatPw === pw) {
    feedbackInput(input, true);
  }
};

/**
 * 
 * @param {HTMLelement} input - The input to check if matches its own regex
 * @returns {boolean} - If the value coincides with the appropiate regex
 */
const checkMatch = (input) => {
  const regexKey = input.name.toLowerCase(); // We get the key by parsing the input's name to lowerCase
  return input.value.match(toValidate[regexKey].regex);
};

/**
 * Checks if the input's (that is being targeted) value matches with its regex.
 * Furthermore, show the appropiate feedback to user
 * @param {event} e - The event propagated from the eventListener
 */
const validateInputs = (e) => {
  const input = e.target;
  if (!Object.keys(toValidate).includes(input.name.toLowerCase())) return;
  if (input.dataset?.validate === "false") return;
  // Get the span below every input to, in case of error, display there the message.
  const span = document.querySelector(
    `span.form__input-feedback[data-name=${input.name}]`
  );

  // Get the tick inside every input to, if everything is correct, appear.
  const tick = document.querySelector(`span.tick[data-name=${input.name}]`);

  // We start hiding all feedback elements.

  // If error, display only error feedback els.
  if (!checkMatch(input) && input.value != "") {
    feedbackInput(input, false, toValidate[input.name.toLowerCase()].error);
    return;
  }

  // In case of correct, display only positive feedback els.
  if (input.value != "") {
    feedbackInput(input, true);
  }
};



document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("keyup", (e) => {
    validateInputs(e);
    checkPws(e);
  });
});
