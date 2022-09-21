const { connectDB } = require("./miscelaneous-functions");

const DesfibSchema = require(__dirname + "/../schemas/Desfib.js");

/**
 * Update the defib coords based on the "the_geom" field.
 * This field contains a string that contains both coords in the format below:
 * "POINT (lat, lon)"
 */
const updateCoords = async () => {
  console.log(1);
  await connectDB("patorrat");
  console.log(2);
  const allDefibs = await DesfibSchema.find();
  console.log(3);
  for (let defib of allDefibs) {
    if (!defib.X || !defib.Y) continue;
    if (
      defib.X.toString().match(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/) &&
      defib.Y.toString().match(
        /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
      )
    )
      continue;

    const parsedX = defib.the_geom.split("(")[1]?.split(" ")[0];
    const parsedY = defib.the_geom.split("(")[1]?.split(" ")[1]?.split(")")[0];
    DesfibSchema.findOneAndUpdate(
      { _id: defib._id },
      { X: parsedX, Y: parsedY },
      { upsert: true },
      () => console.log("done!")
    );
  }
};

updateCoords();
