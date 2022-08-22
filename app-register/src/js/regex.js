const toValidate = {
  text: { regex: /./, error: "" },
  email: {
    regex:
      /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/,
    error:
      "No es un correo electrónico válido. Debe contener un @ y, como mínimo, un punto.",
  },
  tel: {
    regex: /^\+(\d){2}(\s)?((\d){3})(\s)?((\d){2}(\s?)){3}$/,
    error:
      "Empieza por +[Código País] seguido del número de teléfono. Separa, si quieres, los grupos de números con espacios.",
  },
  pw: {
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    error:
      "La contraseña debe tener una longitud mínima de 8 carácteres y contener letras y números.",
  },
  device: {
    regex: /^[\w\d]{24}$/,
    error: "Las ID son de 24 caracteres.",
  },
  // To fix
  objectid: {
    regex: /^[\w\d]{24}$/,
    error: "Las ID son de 24 caracteres.",
  },
  username: {
    regex: /^[a-zA-Z0-9_]*$/,
    error:
      "Los nombres de usuario solo pueden contener letras, números y guiones bajos",
  },
};

module.exports.regex = toValidate;
