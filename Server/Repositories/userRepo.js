const userModel = require("../Models/userModel");
const actions = require("../Utils/actions");

const getUserById = async (id) => {
  return await userModel.findById;
};

const getUsers = async () => {
  return await userModel.find();
};

const getUserByName = (fullname) => {
  return userModel.findOne({ fullname: fullname });
};

const reduceAction = async (userId) => {
  return await actions.reduceAction(userId);
};

module.exports = {
  getUserById,
  getUsers,
  getUserByName,
  reduceAction,
};   





