const express = require("express");
const router = express.Router();

router.get("/plans", function (req, res) {
  res.render("plans", {
    title: "plans",
  });
});

router.get("/addPlan", function (req, res) {
  res.render("addPlanAdmin", {
    layout: "addPlanLayout",
  });
});

router.get("/updatePlan", function (req, res) {
  res.render("updatePlanAdmin", {
    layout: "updatePlanLayout",
  });
});

module.exports = router;
