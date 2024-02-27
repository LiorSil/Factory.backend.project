import User from "../Models/userModel.js";

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const getUserByEmployeeId = async (employeeId) => {
  const user = await User.findOne({ employeeId: employeeId });
  return user;
};

const getUsername = async (id) => {
  const username = await User.findById(id).select("username");
  console.log("test");
  return username;
};

export default {
  getUserById,
  getUserByEmployeeId,
  getUsername,
};
