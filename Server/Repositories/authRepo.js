const axios = require('axios');

//get all users from the API
const getUsers = async (username, email) => {

    const URL = `https://jsonplaceholder.typicode.com/users`;
    const response = await axios.get(URL);
    const users = response.data;
    return users
}

const getUserByUsername = async (username) => {
    const users = await getUsers();
    return users.find((user) => user.username === username);
}


module.exports = {
  getUserByUsername,
};
