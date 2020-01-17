const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const actionRouter = require("../routers/actionRouter");
const projectRouter = require("../routers/projectRouter");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use("/actions", actionRouter);
server.use("/projects", projectRouter);

server.get("/", (req, res) => {
  res.status(200).json("This API works correctly");
});

module.exports = server;
