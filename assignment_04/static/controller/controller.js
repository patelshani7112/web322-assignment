var adminPlans = require("../models/AdminPlan");

exports.create = (req, res) => {
  let userReg = {
    planName: req.body.planName,
    planPrice1: req.body.planPrice1,
    planPrice12: req.body.planPrice12,
    planPrice24: req.body.planPrice24,
    planPrice36: req.body.planPrice36,

    description: req.body.description,
  };

  if (
    userReg.planName == "" ||
    userReg.planPrice1 == "" ||
    userReg.planPrice12 == "" ||
    userReg.planPrice24 == "" ||
    userReg.planPrice36 == "" ||
    userReg.description == ""
  ) {
    res.redirect("/addPlan");
  } else {
    // new user
    const user = new adminPlans({
      planName: userReg.planName,
      planPrice1: userReg.planPrice1,
      planPrice12: userReg.planPrice12,
      planPrice24: userReg.planPrice24,
      planPrice36: userReg.planPrice36,
      description: userReg.description,
    });

    // save user in the database
    user
      .save(user)
      .then((data) => {
        //res.send(data)
        res.redirect("/adminDashboard");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating a create operation",
        });
      });
  }
};

// retrieve and return all users/ retrive and return a single user
exports.find = (req, res) => {
  //   if (req.query.id) {
  //     const id = req.query.id;

  //     adminPlans
  //       .findById(id)
  //       .then((data) => {
  //         if (!data) {
  //           res.status(404).send({ message: "Not found user with id " + id });
  //         } else {
  //           res.send(data);
  //         }
  //       })
  //       .catch((err) => {
  //         res.status(500).send({ message: "Erro retrieving user with id " + id });
  //       });
  //   } else
  //   {
  adminPlans
    .find()
    .then((user) => {
      res.send(user);
      console.log(user);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error Occurred while retriving user information",
      });
    });
  //   }
};

// Update a new idetified user by user id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }

  const id = req.params.id;
  adminPlans
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot Update user with ${id}. Maybe user not found!`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user information" });
    });
};

// Delete a user with specified user id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  adminPlans
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        res.send({
          message: "User was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
