const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const viewRoutes = require("./routes/viewRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");
const Helpers = require("./helpers");
const gate = require('./helpers/gate')
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", __dirname + "/src/views");
app.use(express.static("public"));

app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blog", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(cookieParser("12311-5161163-1561-515"));
app.use(
  session({
    secret: "mysecretkeyqweqwe",
    resave: true,
    saveUninitialized: true,
    cookie: { expires: new Date(Date.now() + 6 * 60 * 60 * 1000) },
    //6 hours expire
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());
app.use(gate.middleware())
app.use((req, res, next) => {
  app.locals = new Helpers(req, res).getObjects();

  next();
});
//ROUTES
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", viewRoutes);

app.all("*", errorHandler.error404);
app.use(errorHandler.handler);

module.exports = app;
