const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const CronJob = require("cron").CronJob;

const { feedbackErrors, feedback } = require(__dirname + "/src/js/texts");

const desfibs = require(__dirname + "/src/js/desfibs.js");
const funcs = require(__dirname + "/src/js/miscelaneous-functions.js");
const { regex } = require(__dirname + "/src/js/regex.js");

const DesfibSchema = require(__dirname + "/src/schemas/Desfib.js");
const UserSchema = require(__dirname + "/src/schemas/User.js");

const { getDefibs } = require(__dirname + "/src/js/distance.js");

const app = express();

const http = require("http");
const server = http.createServer(app);
const { connectDB, getTimeStamp } = require("./src/js/miscelaneous-functions");
const IncidentSchema = require(__dirname + "/src/schemas/Incident.js");
const { Server } = require("socket.io");
const io = new Server(server);

const dbName = "patorrat";

app.use(cookieParser());
/* Provisional */
app.use(
  session({
    secret: "motomami", //! XD
    resave: false,
    saveUninitialized: true,
  })
);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/src"));
app.set("views", __dirname + "/src/views");
app.use(bodyParser.urlencoded(true));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.render("get-location");
});

app.post("/", async (req, res) => {
  if (!req.body.lat || !req.body.lon) {
    res.render("get-location");
    return;
  }

  const acc = +req.body.acc || 0;

  const defibs = await getDefibs({ x: +req.body.lat, y: +req.body.lon });
  let dbError = !defibs;
  res.render("index", {
    defibs: defibs,
    acc: acc,
    dbError: dbError,
  });
});

app.get("/volunteers", (req, res) => {
  res.render("volunteers");
});

server.listen(app.get("port"));

const sendIncidents = (socket) => {
  IncidentSchema.find({}, (err, incidents) => {
    if (err) return;
    socket.broadcast.emit("incidents", incidents);
  });
};

const autoSendIncidents = (socket, filter = {}) => {
  IncidentSchema.find(filter, (err, incidents) => {
    if (err) return;
    io.to(socket.id).emit("incidents", incidents);
  });
};

io.on("connection", async (socket) => {
  await connectDB("patorrat");
  socket.on("get-incidents", (city) => {
    const filter = city ? { city: city } : {};
    autoSendIncidents(socket, filter);
  });

  socket.on("newIncident", async (incident) => {
    const key = "3e707e48cc30488793f5f501b957dc5f";
    const res = await axios(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${incident.x}&lon=${incident.y}&format=json&apiKey=${key}`
    );

    const results = res.data.results[0];
    const city = funcs.cityParser(results.city);

    incident.id = socket.id;
    const newIncident = new IncidentSchema({
      id: socket.id,
      x: incident.x,
      y: incident.y,
      city: city,
      volunteers: 0,
      timestamp: funcs.getTimeStamp(),
    });

    console.log(newIncident);

    IncidentSchema.find({ id: socket.id }, (err, docs) => {
      if (err) return;
      if (!docs.length)
        newIncident.save(() => {
          sendIncidents(socket);
        });
    });
  });

  socket.on("addVolunteer", async (id, volunteers) => {
    volunteers++;
    const filter = { id: id };
    const update = { volunteers: volunteers };
    await IncidentSchema.findOneAndUpdate(filter, update);
    autoSendIncidents(socket);
    socket.broadcast.emit("volunteerComing");
  });

  socket.on("disconnect", () => {
    IncidentSchema.deleteOne({ id: socket.id }).then(() => {
      sendIncidents(socket);
    });
  });
});

const job = new CronJob(
  "0 * * * * *",
  () => {
    const currentTimeStamp = getTimeStamp();
    const minutesAgo = currentTimeStamp - 600; // We'll remove every incident that has been fired more than 10 minutes ago
    IncidentSchema.deleteMany({ timestamp: { $lt: minutesAgo } }).exec();
  },
  null,
  true,
  "America/Los_Angeles"
);

app.get("/defib", async (req, res) => {
  const username = req.session.username;
  const id = req.session.desfId;
  const queryId = `ObjectId("${id}")`;
  /* If user hasn't been authenticated correctly, redirect to login */
  if (!username || !id) {
    res.redirect("/login?redirected=true");
    return;
  }

  const con = await connectDB(dbName);
  /* Fetch the current data from DB to render it */
  const [data] = await DesfibSchema.find({ _id: id });

  const dbError = !con;

  res.render("edit-defib", {
    fieldsets: desfibs.desfibParams, // The inputs list to render into the form
    loadedValues: data, // The data to fill those inputs
    dbError: dbError,
  });
});

app.post("/defib", async (req, res) => {
  if (!req.session.id) return;
  const id = req.session.desfId;
  let desfibData = req.body;
  desfibData.DISPONIBLE = desfibData.DISPONIBLE !== undefined ? true : false;
  // Check if those params come from the form sent (by measuring the length is enough)
  if (desfibData.length !== desfibs.length) return;

  // Check all data is validated
  for (let key in desfibData) {
    const data = desfibData[key];
    if (!regex[key]) continue;
    if (data.match(regex[key].regex)) continue;
    const [prevData] = await DesfibSchema.find({ _id: id });
    res.render("edit-defib", {
      fieldsets: desfibs.desfibParams, // The inputs list to render into the form
      loadedValues: prevData, // The data to fill those inputs
      feedback: feedbackErrors("not-validated"),
    });

    return;
  }

  await connectDB(dbName);
  await DesfibSchema.findOneAndUpdate({_id: id}, desfibData, {
    upsert: true, // To append non-initialized fields
  });

  const [data] = await DesfibSchema.find({ _id: id });
  res.render("edit-defib", {
    fieldsets: desfibs.desfibParams, // The inputs list to render into the form
    loadedValues: data, // The data to fill those inputs
    feedback: feedback("saved"),
    error: true,
  });
});

app.get("/login", (req, res) => {
  // Check if the user has been redirected or if he entered voluntarily
  const redirected = req.query.redirected;

  res.render("login", { redirected: redirected });
});

app.post("/login", async (req, res) => {
  // Checks if data has been sent correctly
  const reqArgs = ["username", "pw"];
  if (!funcs.checkReqArgs(req, res, reqArgs)) {
    funcs.feedBackErr(res, feedbackErrors("not-all-args"), "login");
    return;
  }

  const username = req.body.username;
  const pw = funcs.hash(req.body.pw, "md5");
  await connectDB(dbName);

  // Get first (it must be the only one) entry that appears
  const [query] = await UserSchema.find({ username: username, pw: pw });

  if (!query) {
    res.render("login", { error: feedbackErrors("not-correct") });
    return;
  }

  req.session.username = username;
  /* To avoid too much queries, let's save desf's ID into session */
  req.session.desfId = query.device;
  res.redirect("/defib");
});

app.get("/register", (req, res) => {
  /* Set an array with all registered usernames to dinamically notice user */
  res.render("register");
});

app.post("/register", async (req, res) => {
  const reqArgs = ["username", "device", "pw", "repeatPw"];
  if (!funcs.checkReqArgs(req, res, reqArgs)) {
    funcs.feedBackErr(res, feedbackErrors("not-all-args"), "register");
    return;
  }

  /* Get form params */
  const username = req.body.username;
  const device = req.body.device;
  const pw = req.body.pw;
  const repeatPw = req.body.repeatPw;

  /* Check if pws are equal */
  if (pw !== repeatPw) {
    funcs.feedBackErr(res, feedbackErrors("diff-pw"), "register");
    return;
  }

  await connectDB(dbName);
  /* Check if already exists a user with that name */
  const previousUsersName = await UserSchema.find({ username: username });

  if (previousUsersName.length) {
    funcs.feedBackErr(res, feedbackErrors("username-taken"), "register");
    return;
  }

  // Prepare new user to save
  const newUser = await UserSchema.create({
    username: username,
    pw: funcs.hash(req.body.pw, "md5"),
    device: device,
  });

  await newUser.save();
  res.redirect("/defib");
});
