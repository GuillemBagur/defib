const feedbackErrors = err => {
    const errors = {
        "not-all-args": "Rellena todos los campos",
        "diff-pw": "Las contraseñas no coinciden",
        "username-taken": "Este nombre de usuario ya está cogido",
        "not-correct": "El usuario y la contraseña no coinciden",
        "not-validated": "Algunos datos no son válidos"
    };

    return errors[err] || err;
}

module.exports.feedbackErrors = feedbackErrors;


const feedback = fdb => {
    const feedbackMessages = {
        "saved": "Los datos se han guardado correctamente",
    }

    return feedbackMessages[fdb] || fdb;
}

module.exports.feedback = feedback;