const express = require("express");
const router = express.Router();
const AdminPlan = require("../models/AdminPlan");
const axios = require("axios");
const controller = require("../controller/controller");

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

router.get("/updatePlan/:id", function (req, res) {
  AdminPlan.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("updatePlanAdmin", {
        viewTitle: "Update Task",
        layout: "updatePlanLayout",
        singlePlan: doc,
      });
    }
  }).lean();
});

// create API

router.post("/api/users", controller.create);
router.get("/api/users", controller.find);
router.put("/api/users/:id", controller.update);
router.delete("/api/users/:id", controller.delete);
module.exports = router;
