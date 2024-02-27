import User from "../Models/userModel.js";

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const getUserByEmployeeId = async (employeeId) => {
  const user = await User.findOne({ employeeId: employeeId });
  return user;
};

export default {
  getUserById,
  getUserByEmployeeId,
};
