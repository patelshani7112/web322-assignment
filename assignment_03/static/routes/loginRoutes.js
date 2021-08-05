const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model
const User = require("../models/User");
const { request } = require("express");

router.get("/login", function (req, res) {
  res.render("login", {
    title: "login",
    layout: "register",
  });
});

router.get("/register", function (req, res) {
  res.render("registration", {
    title: "Register",
    layout: "register",
  });
});

// registeration
router.post(
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
    } else {
      User.findOne({ email: userReg.email }).then((user) => {
        if (user) {
          // req.flash("error_msg", "this email is already exists");
          // req.flash("success_msg", "this email is already exists");
        } else {
          const newUser = new User({
            firstName: userReg.fName,
            lastName: userReg.lName,
            email: userReg.email,
            phoneNumber: userReg.phone,
            companyName: req.body.registerCompName,
            address1: userReg.address,
            address2: userReg.address2,
            city: userReg.city,
            postalCode: userReg.postal,
            country: userReg.country,
            password: userReg.pw,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  //req.flash("success_msg", "You are now registered and can log in");
                  res.redirect(`/dashboard/${userReg.email}`);
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    }
  }
);

// login handlers
// router.post(
//   "/login",
//   [
//     check("lUsername", "username must be entered").notEmpty(),
//     check("lPassword", "password must be entered").notEmpty(),
//   ],
//   (req, res) => {
//     var userLoginData = {
//       email: req.body.lUsername,
//       password: req.body.lPassword,
//     };

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMsg = errors.array();
//       let emailError = false;
//       let passwordError = false;

//       if (errorMsg.some((el) => el.param === "lUsername")) {
//         emailError = "is-invalid";
//       }
//       if (errorMsg.some((el) => el.param === "lPassword")) {
//         passwordError = "is-invalid";
//       }

//       res.render("login", {
//         errorMsg,
//         layout: "register",
//         userLoginData: userLoginData,
//         emailError,
//         passwordError,
//       });
//     } else if (errors.isEmpty()) {
//       res.redirect(`/dashboard/${userLoginData.email}`);
//     }
//   }
// );

router.post(
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
      User.findOne({ email: userLoginData.email }).then((user) => {
        if (user == null) {
          //   errorMsg.push({ msg: "Email already exists" });
          // res.render("login", {
          //   errorMsg,
          //   layout: "register",
          //   userLoginData: userLoginData,
          //   emailError,
          //   passwordError,
          // });
          console.log(errorMsg.msg);
        } else {
          bcrypt
            .compare(userLoginData.password, user.password)
            .then((isMatched) => {
              if (isMatched == true) {
                console.log("logi success");
                res.redirect(`/dashboard/${userLoginData.email}`);
              } else {
                console.log("passord is inncorrect");
              }
            });
        }
      });
    }
  }
);

module.exports = router;