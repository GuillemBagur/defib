import axios from "axios";
import { Coords, Desf } from "../../types";


export const fetchData = async (
  url,
  params,
  method,
  callback
) => {
  if (method == "get") {
    try {
      await axios.get(url, { params: params }).then((res) => {
        callback(res.data);
      });
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  return false;
};

/**
 * @param coords - The coords of the victim.
 * @param options - The other objects to return them the nearest.
 * @returns - A sorted by nearest list of the objects.
 */
export const nearest = (coords, options) => {
  for (let i in options) {
    const option = options[i];
    const xDif = Math.abs(coords.x - option.x);
    const yDif = Math.abs(coords.y - option.y);
    const radius = Math.sqrt(Math.pow(xDif, 2) + Math.pow(yDif, 2));
    options[i].radius = radius;
  }

  return options.sort((a, b) => a.radius - b.radius);
};