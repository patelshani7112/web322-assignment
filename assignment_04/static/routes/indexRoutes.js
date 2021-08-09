const express = require("express");
const router = express.Router();

router.get("/plans", function (req, res) {
  res.render("plans", {
    title: "plans",
  });
});

module.exports = router;
