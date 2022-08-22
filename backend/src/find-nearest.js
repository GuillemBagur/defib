import { fetchData, nearest } from "./functions";
import { keys } from "./keys";
import { postalCodes } from "./postal-codes";
import { desfibs } from "../data/desfibs";


export const findNearest = (coords) => {
  if (coords.x == null || coords.y == null) return;
  const endCoords = `${coords.x},${coords.y}`;
  let desfs = [];
  fetchData(
    "http://api.openweathermap.org/geo/1.0/reverse",
    { appid: keys.openweather, lat: coords.x, lon: coords.y },
    "get",
    (res) => {
      const location = res[0].name.toUpperCase();
      console.log(desfibs);
    }
  );

};


/*
fetchData(
        `https://catalegdades.caib.cat/resource/ngxk-3kst.json`,
        { nom_muni: location },
        "get",
        (res: Array<object>) => {
          console.log(res);
          const desfs = res.map(el => el["radius"] = null);
          console.log(nearest(coords, desfs));
        }
      );
*/