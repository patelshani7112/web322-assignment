const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  planName: {
    type: String,
    required: true,
  },
  planPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;
