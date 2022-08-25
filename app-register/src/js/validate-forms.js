const form = document.getElementById("form");
const validatedInputs = document.getElementById("validated-inputs");
const popupMustValidate = document.getElementById("popup-must-validate");

form.addEventListener("submit", (e) => {
  if (validatedInputs.value.length) {
    popupMustValidate.classList.add("show");
    e.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const checkPws = (e) => {
    const input = e.target;
    if (input.name != "repeatPw") return;
    const span = document.querySelector(
      `span.input-feedback[data-name=${input.name}]`
    );

    // Get the tick inside every input to, if everything is correct, appear.
    const tick = document.querySelector(`span.tick[data-name=${input.name}]`);
    if (span) span.innerHTML = "";
    input.classList.remove("validated");
    input.classList.remove("not-validated");
    if (tick) tick.classList.remove("show");
    const repeatPw = document.getElementsByName("repeatPw")[0].value;
    const pw = document.getElementsByName("pw")[0].value;

    if (repeatPw != pw && repeatPw.length) {
      input.classList.add("not-validated");
      if (span) span.innerHTML = "Las contraseñas no coinciden.";
      validatedInputs.value = "error";
      return;
    }

    if (repeatPw === pw) {
      input.classList.add("validated");
      if (tick) tick.classList.add("show");
      validatedInputs.value = "";
    }
  };

  const checkMatch = (input) => {
    return input.value.match(toValidate[input.name].regex);
  };

  const validateInputs = (e) => {
    const input = e.target;
    if (!Object.keys(toValidate).includes(input.name)) return;
    if (input.dataset?.validate === "false") return;
    // Get the span below every input to, in case of error, display there the message.
    const span = document.querySelector(
      `span.input-feedback[data-name=${input.name}]`
    );

    // Get the tick inside every input to, if everything is correct, appear.
    const tick = document.querySelector(`span.tick[data-name=${input.name}]`);

    // We start hiding all feedback elements.
    if (span) span.innerHTML = "";
    input.classList.remove("validated");
    input.classList.remove("not-validated");
    if (tick) tick.classList.remove("show");

    // If error, display only error feedback els.
    if (!checkMatch(input) && input.value != "") {
      if (span) span.innerHTML = toValidate[input.name].error;
      input.classList.add("not-validated");
      validatedInputs.value = "error";
      return;
    }

    // In case of correct, display only positive feedback els.
    if (input.value != "") {
      input.classList.add("validated");
      if (tick) tick.classList.add("show");
      validatedInputs.value = "";
    }
  };

  form.addEventListener("keyup", (e) => {
    validateInputs(e);
    checkPws(e);
  });
});
