var express = require("express");
var router = express.Router();

/* pages. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "main" });
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});

router.get("/create", function (req, res, next) {
  res.render("create", { title: "create" });
});

router.get("/pageManager", function (req, res, next) {
  res.render("pageManager", { title: "pageManager" });
});

module.exports = router;
