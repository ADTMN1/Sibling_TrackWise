const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "parent", "child"], required: true },
  grade: {
    type: String,
    required: function () {
      return this.role === "child";
    },
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: function () {
      return this.role === "child";
    },
  },
});

module.exports = mongoose.model("User", userSchema);


