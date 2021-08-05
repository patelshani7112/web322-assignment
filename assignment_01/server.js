var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/index.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/html/hostingPlan.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/html/login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./static/html/signup.html"));
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);
