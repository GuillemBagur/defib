module.exports.desfibParams = {
  metadata: {
    label: "Metadatos",
    fields: {
      the_geom: { type: "text", labels: ["Geoma"], required: true },
      objectid: { type: "text", labels: ["ID del dispositiu"], required: true },
      nom: { type: "text", labels: ["Nom"], required: true },
    },
  },

  location: {
    label: "Ubicación",
    fields: {
      x: { type: "number", labels: ["X"], step: ".00000000000000001", required: true },
      y: { type: "number", labels: ["Y"], step: ".00000000000000001", required: true },
      adreca: { type: "text", labels: ["Adreça"] },
      municipi: { type: "text", labels: ["Municipi"], required: true },
      ine_mun: { type: "text", labels: ["Ine Municipi"] }, // Wtf q es
      illa: { type: "text", labels: ["Illa"], required: true },
      tel: { type: "tel", labels: ["Telèfon"], required: true },
    },
  },

  miscelaneous: {
    label: "Varios",
    fields: {
      programaps: { type: "text", labels: ["Programa PS"] },
      nom_2: { type: "text", labels: ["Nom 2"] },
      descripcio: { type: "text", labels: ["Descripció"] },
      disponible: { type: "checkbox", labels: ["Disponible"] },
      ultima_revisio: { type: "date", labels: ["Última revisió"] },
    },
  },

  stablishmentData: {
    label: "Datos del establecimiento",
    fields: {
      horari_inici: { type: "time", labels: ["Hora d'obertura"] },
      horari_final: { type: "time", labels: ["Hora de tancament"] },
    },
  },

  vehicles: {
    label: "Vehículos",
    fields: {
      vehicles_disponibles: { type: "hidden", labels: [""] },
      vehicles_disponibles_checkboxes: {
        type: "checkbox",
        labels: ["Cotxe", "Moto", "Bici", "Ambulància"],
      },
    },
  },
};
