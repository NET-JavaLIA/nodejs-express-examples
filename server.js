const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// express
const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));

// import routes

// middlewares
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json({ limit: "5mb", type: "application/json" }));
app.use(cookieParser());
app.use(morgan("dev"));

// routes

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
