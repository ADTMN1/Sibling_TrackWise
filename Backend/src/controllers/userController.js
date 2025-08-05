const userService = require("../services/userService");

const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const users = await userService.getUserByRole(req.params.role);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, getUsersByRole };
