const exp = require("express");
const app = exp();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));

// Static Files
app.use(exp.static("static"));
app.use(exp.static(path.join("static")));
app.set("views", path.join(__dirname, "/static/views"));

// Templating Engine
app.set("view engine", ".hbs");
app.engine(
  ".hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

app.get("/", function (req, res) {
  res.render("home", {
    title: "home",
  });
});

app.get("/plans", function (req, res) {
  res.render("plans", {
    title: "plans",
  });
});

app.get("/login", function (req, res) {
  res.render("login", {
    title: "login",
    layout: "register",
  });
});

app.get("/register", function (req, res) {
  res.render("registration", {
    title: "Register",
    layout: "register",
  });
});

app.post(
  "/login",
  [
    check("lUsername", "username must be entered").notEmpty(),
    check("lPassword", "password must be entered").notEmpty(),
  ],
  (req, res) => {
    var userLoginData = {
      email: req.body.lUsername,
      password: req.body.lPassword,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array();
      let emailError = false;
      let passwordError = false;

      if (errorMsg.some((el) => el.param === "lUsername")) {
        emailError = "is-invalid";
      }
      if (errorMsg.some((el) => el.param === "lPassword")) {
        passwordError = "is-invalid";
      }

      res.render("login", {
        errorMsg,
        layout: "register",
        userLoginData: userLoginData,
        emailError,
        passwordError,
      });
    } else if (errors.isEmpty()) {
      res.redirect(`/dashboard/${userLoginData.email}`);
    }
  }
);

app.get("/dashboard/:email/:fName?/:lName?", function (req, res) {
  let email = req.params.email;
  let fName = req.params.fName;
  let lName = req.params.lName;
  res.render("dashboard", {
    title: "Welcome",
    layout: "successPage",
    email,
  });
});

app.post(
  "/register",
  check("rFName", "missing firstName ").notEmpty(),
  check("rLName", "missing lastName ").notEmpty(),
  check("rEmail", "missing e-mail ").notEmpty(),
  check("rPhone", "missing phoneNumber ").isNumeric({
    no_symbols: true,
  }),
  check("rAddress", "missing address ").notEmpty(),
  check("rCity", "missing city ").notEmpty(),
  check("rPostal", "missing zipCode ").notEmpty(),
  check("rCountry", "missing country ").notEmpty(),
  check("rpassword", "enter 6 to 12 char passoword.")
    .matches("^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$")
    .isLength({ min: 6, max: 12 }),
  check("rComPasswprd", "Password does not match").notEmpty(),

  function (req, res) {
    let userReg = {
      fName: req.body.rFName,
      lName: req.body.rLName,
      email: req.body.rEmail,
      phone: req.body.rPhone,
      company: req.body.registerCompName,
      address: req.body.rAddress,
      address2: req.body.rAddress2,
      city: req.body.rCity,
      postal: req.body.rPostal,
      country: req.body.rCountry,
      pw: req.body.rpassword,
      confPW: req.body.rComPasswprd,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array();

      let fieldVal = [
        { name: "rFName", valid: "" },
        { name: "rLName", valid: "" },
        { name: "rEmail", valid: "" },
        { name: "rPhone", valid: "" },
        { name: "rAddress", valid: "" },
        { name: "rCity", valid: "" },
        { name: "rPostal", valid: "" },
        { name: "rCountry", valid: "" },
        { name: "rpassword", valid: "" },
        { name: "rComPasswprd", valid: "" },
      ];

      for (let i = 0; i < fieldVal.length; i++) {
        if (errorMsg.some((el) => el.param === fieldVal[i].name)) {
          fieldVal[i].valid = "is-invalid";
        } else {
          fieldVal[i].valid = "is-valid";
        }
      }

      let ErrorPrints = [];
      for (let i = 0; i < errorMsg.length; i++) {
        ErrorPrints[errorMsg[i].param] = errorMsg[i].msg;
      }

      res.render("registration", {
        layout: "register",
        userReg,
        ErrorPrints,
        fieldVal,
      });
    } else if (errors.isEmpty()) {
      res.redirect(`/dashboard/${userReg.email}`);
    }
  }
);

const HTTP_PORT = process.env.PORT || 8000;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.listen(HTTP_PORT, onHttpStart);
