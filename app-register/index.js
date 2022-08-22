const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { feedbackErrors, feedback } = require("./src/js/texts");

const desfibs = require(__dirname + "/src/js/desfibs.js");
const funcs = require(__dirname + "/src/js/miscelaneous-functions.js");
const { regex } = require(__dirname + "/src/js/regex.js");

const DesfibSchema = require(__dirname + "/src/schemas/Desfib.js");
const UserSchema = require(__dirname + "/src/schemas/User.js");

const app = express();
const port = 3000;

const dbName = "patorrat";

app.use(cookieParser());
/* Provisional */
app.use(
  session({
    secret: "motomami",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/src"));
app.set("views", __dirname + "/src/views");
app.use(bodyParser.urlencoded(true));
app.use(bodyParser.json());

/**
 * Connects with the main DB, and enters into the givern Mongo Collection
 * @param {String} collection
 */
const connectDB = (collection) => {
  try {
    mongoose.connect(
      `mongodb+srv://guillem:test@cluster0.sqgy5bb.mongodb.net/${collection}`
    );
  } catch (err) {
    console.log(err);
  }
};

app.get("/", async (req, res) => {
  const username = req.session.username;
  const id = req.session.desfId;
  /* If user hasn't been authenticated correctly, redirect to login */
  if (!username || !id) {
    res.redirect("/login?redirected=true");
    return;
  }

  connectDB(dbName);
  /* Fetch the current data from DB to render it */
  const [data] = await DesfibSchema.find({ _id: id });

  res.render("index", {
    fieldsets: desfibs.desfibParams, // The inputs list to render into the form
    loadedValues: data, // The data to fill those inputs
  });
});

app.post("/", async (req, res) => {
  if (!req.session.id) return;
  const id = req.session.desfId;
  let desfibData = req.body;
  desfibData.disponible = desfibData.disponible !== undefined ? true : false;
  // Check if those params come from the form sent (by measuring the length is enough)
  if (desfibData.length !== desfibs.length) return;

  for(let key in desfibData) {
    const data = desfibData[key];
    if(!regex[key]) continue;
    if(data.match(regex[key].regex)) continue;
    const [prevData] = await DesfibSchema.find({ _id: id });
    res.render("index", {
      fieldsets: desfibs.desfibParams, // The inputs list to render into the form
      loadedValues: prevData, // The data to fill those inputs
      feedback: feedbackErrors("not-validated"),
    });

    return;
  }

  connectDB(dbName);
  await DesfibSchema.findOneAndUpdate(desfibData.id, desfibData, {
    upsert: true, // To append non-initialized fields
  });

  const [data] = await DesfibSchema.find({ _id: id });
  res.render("index", {
    fieldsets: desfibs.desfibParams, // The inputs list to render into the form
    loadedValues: data, // The data to fill those inputs
    feedback: feedback("saved"),
    error: true
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
  connectDB(dbName);

  // Get first (it must be the only one) entry that appears
  const [query] = await UserSchema.find({ username: username, pw: pw });

  if (!query) {
    res.render("login", { error: feedbackErrors("not-correct") });
    return;
  }

  req.session.username = username;
  /* To avoid too much queries, let's save desf's ID into session */
  req.session.desfId = query.device;
  res.redirect("/");
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

  connectDB(dbName);
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
  res.render("register");
});

app.listen(port);
