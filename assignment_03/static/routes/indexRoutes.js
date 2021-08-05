const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("home", {
    title: "home",
  });
});

router.get("/plans", function (req, res) {
  res.render("plans", {
    title: "plans",
  });
});

router.get("/logout", function (req, res) {
  res.render("home", {
    title: "home",
  });
});

module.exports = router;
