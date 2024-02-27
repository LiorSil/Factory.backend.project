const userModel = require("../Models/userModel");



const getFullname = async (id) => { 
    const user = await userModel.findById(id);
    return user.fullname;
}

const getNumOfActions = async (id) => {
    const user  = await userModel.findById(id);
    return user.num_of_actions; 
}

const updateNumOfActions = async (id, newNum) => {
    const user  = await userModel.findById(id);
    user.num_of_actions = newNum;
    await user.save();
}

const getUsers = async () => {
  return await userModel.find();
};

module.exports = {
  getFullname,
  getNumOfActions,
  updateNumOfActions,
  getUsers,
};   





