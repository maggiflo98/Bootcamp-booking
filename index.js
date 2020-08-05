const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middlwares/error");
//const errorResponse = require("./utils/errorResponse");

//load env;
// dotenv.config = { path: "../config/config.env"}

//dot env configuration
require("dotenv").config({ path: "./config/config.env" });

const connectDB = require("./config/db");

//connect to Database
connectDB();

//routes
const bootcampsRoute = require("./routes/bootcamps");

const app = express();

//body parser
app.use(bodyParser.json());

//middleware
app.use("/api/v1/bootcamps", bootcampsRoute);

//error handler middleware
app.use(errorHandler);

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running on ${process.env.NODE_ENV} on ${PORT}`.rainbow.bold
  )
);

//handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red);

  //close server and exit process
  server.close(() => process.exit(1));
});
