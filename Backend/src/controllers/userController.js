const userService = require("../services/userService");

const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const users = await userService.getUserByRole(req.params.role);
    const sanitizedUsers = users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
    }));
    res.status(200).json(sanitizedUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, getUsersByRole };
