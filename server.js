const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const { connections } = require("./app/models/index");
const { errorHandler } = require("./app/middleware");

const app = express();
app.use(cors());
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const httpServer = http
  .createServer(app.handle.bind(app))
  .listen(process.env.PORT, () => {
    console.info(`Server up successfully - port:${process.env.PORT}`);
  });

app.use("/api", require("./app/router/index"));

// Error Middleware
app.use(errorHandler.methodNotAllowed);
app.use(errorHandler.genericErrorHandler);

// process.on("unhandledRejection", (err) => {
//   console.error("possibly unhandled rejection happened");
//   console.error(err.message);
//   // enabledStackTrace && console.error(`stack: ${err.stack}`);
// });

const closeHandler = () => {
  if (connections) {
    Object.values(connections).forEach((connection) => {
      console.log(
        "🚀 ~ file: server.js:82 ~ Object.values ~ connection:",
        connection
      );
      connection.close();
    });
  }
  httpServer.close(() => {
    console.info("Server is stopped successfully");
    process.exit(0);
  });
};

process.on("SIGTERM", closeHandler);
process.on("SIGINT", closeHandler);
