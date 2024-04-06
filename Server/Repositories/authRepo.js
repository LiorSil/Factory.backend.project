const axios = require('axios');

//get all users from the API sas
const getUsers = async (username, email) => {
  const URL = `https://jsonplaceholder.typicode.com/users`;
  const response = await axios.get(URL);
  const users = await response.data;
  return users;
};

const getEmployeeByUsername = async (username) => {
  const users = await getUsers();
  return users.find((user) => user.username === username);
};
const getUserById = async (userId) => {
  const users = await getUsers();

  const user = users.find((user) => user.id === +userId);
  return user;
};

module.exports = {
  getEmployeeByUsername,
  getUserById,
};
