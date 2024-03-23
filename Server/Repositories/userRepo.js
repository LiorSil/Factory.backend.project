const userModel = require("../Models/userModel");
const jsonfile = require("jsonfile");
const path = require("path");

const usersPath = path.join(__dirname, "../Local_data/users.json");
const jFile = jsonfile.readFile(usersPath);
const users = jFile.users;

const getUserById = async (id) => {
  return await userModel.findById;
};

const getUsers = async () => {
  return await userModel.find();
};

const getUserByName = (fullname) => {
  return userModel.findOne({ fullname: fullname });
};

const getMaxOfActions = (userID) => {
  return users.find((user) => user.id === userID).maxActions;
};

const reduceAction = async (userID) => {
  const dbUser = await getUserById(userID);
  if (dbUser.num_of_actions === 0) {
    return false;
  } else {
    dbUser.num_of_actions = dbUser.num_of_actions - 1;
    await dbUser.save();
    const user = users.find((user) => user.id === userID);
    user.actionAllowed = user.actionAllowed - 1;
    jsonfile.writeFile(usersPath, { users: users });
  }
  return true;
};

module.exports = {
  getUserById,
  getUsers,
  getUserByName,
  reduceAction,
};












module.exports = {
  getUserById,
  getUsers,
  getUserByName,
  reduceAction,
};   





