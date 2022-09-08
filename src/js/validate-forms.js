const form = document.getElementById("form");
const validatedInputs = document.getElementById("validated-inputs");
const popupMustValidate = document.getElementById("popup-must-validate");

const feedbackInput = (input, success, message) => {
  const span = document.querySelector(
    `span.input-feedback[data-name=${input.name}]`
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

document.addEventListener("DOMContentLoaded", () => {
  const checkPws = (e) => {
    const input = e.target;
    const span = document.querySelector(
      `span.input-feedback[data-name=${input.name}]`
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

  const checkMatch = (input) => {
    return input.value.match(toValidate[input.name.toLowerCase()].regex);
  };

  const validateInputs = (e) => {
    const input = e.target;
    if (!Object.keys(toValidate).includes(input.name.toLowerCase())) return;
    if (input.dataset?.validate === "false") return;
    // Get the span below every input to, in case of error, display there the message.
    const span = document.querySelector(
      `span.input-feedback[data-name=${input.name}]`
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

  form.addEventListener("keyup", (e) => {
    validateInputs(e);
    checkPws(e);
  });
});
