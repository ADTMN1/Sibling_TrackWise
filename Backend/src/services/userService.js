const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

const registerUser = async (userData) => {
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  return await newUser.save();
};

const getUserByRole = async (role) => {
  return await User.find({ role });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

module.exports = { registerUser, getUserByRole, getUserById };
