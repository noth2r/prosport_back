require("dotenv").config();

const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./server/routes/");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

routes.forEach((name) => {
  app.use('/' + name, require(`./server/routes/${name}`));
});

const PORT = 3030 || process.env.PORT;

const start = () => {
  try {
    http.createServer({}, app).listen(PORT);

    console.log(`Server is running at port: ${PORT}...`);
  } catch (e) {
    throw new Error(e);
  }
};

start();
