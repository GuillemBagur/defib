// Texts arrays to display to the user depending on the state of the app


/**
 * @param {string} err - Error name
 * @returns {string} The accurate feedback for the user (when the app must display an error)
 */
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


/**
 * @param {string} fdb - Feedback name
 * @returns The accurate feedback for the user (when the app must display a positive feedback)
 */
const feedback = fdb => {
    const feedbackMessages = {
        "saved": "Los datos se han guardado correctamente",
    }

    return feedbackMessages[fdb] || fdb;
}

module.exports.feedback = feedback;