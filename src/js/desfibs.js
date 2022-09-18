/* An array containing all the field info to render every input
in the "edit-defib.ejs" view */

module.exports.desfibParams = {
  metadata: {
    label: "Metadatos",
    fields: {
      the_geom: { type: "text", labels: ["Geoma"], required: true },
      OBJECTID: { type: "text", labels: ["ID del dispositiu"], required: true },
      NOM: { type: "text", labels: ["Nom"], required: true },
    },
  },

  location: {
    label: "Ubicación",
    fields: {
      X: { type: "number", labels: ["X"], step: ".00000000000000001", required: true },
      Y: { type: "number", labels: ["Y"], step: ".00000000000000001", required: true },
      ADRECA: { type: "text", labels: ["Adreça"] },
      NOM_MUNI: { type: "text", labels: ["Municipi"], required: true },
      INE_NUM: { type: "text", labels: ["Ine Municipi"] }, // Wtf q es
      ILLA: { type: "text", labels: ["Illa"], required: true },
      TELEFON: { type: "tel", labels: ["Telèfon"], required: true },
    },
  },

  miscelaneous: {
    label: "Varios",
    fields: {
      PROGRAMAPS: { type: "text", labels: ["Programa PS"] },
      NOM_2: { type: "text", labels: ["Nom 2"] },
      DESCRIPCIO: { type: "text", labels: ["Descripció"] },
      DISPONIBLE: { type: "checkbox", labels: ["Disponible"] },
      ULTIMA_REVISIO: { type: "date", labels: ["Última revisió"] },
    },
  },

  stablishmentData: {
    label: "Datos del establecimiento",
    fields: {
      HORARI_INICI: { type: "time", labels: ["Hora d'obertura"] },
      HORARI_FINAL: { type: "time", labels: ["Hora de tancament"] },
    },
  },

  vehicles: {
    label: "Vehículos",
    fields: {
      VEHICLES_DISPONIBLES: { type: "hidden", labels: [""] },
      VEHICLES_DISPONIBLES_CHECKBOXES: {
        type: "checkbox",
        labels: ["Cotxe", "Moto", "Bici", "Ambulància"],
      },
    },
  },
};
