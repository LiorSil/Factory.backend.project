//import users.json file
//
const jsonfile = require("jsonfile");
const path = require("path");
const file = path.resolve(__dirname, "../Local_data/users.json");

//get users data from file

const getUsers = async () => {
  const { users } = await jsonfile.readFile(file);
  return users;
};

const getUserById = async (id) => {
  const users = await getUsers();
  const user = await users.find((user) => user.id === id);
  return user;
};

const formatDate = async (date) => {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const initializeUsers = async () => {
  const today = await formatDate(new Date());
  const users = await getUsers();

  let initializedUsers = [];

  if (users[0].date !== today) {
    initializedUsers = users.map((user) => {
      user.actionAllowed = user.maxActionsPerDay;
      user.date = today;
      return user;
    });

    await jsonfile.writeFile(file, { users: initializedUsers });
    console.log("Users actions initialized");
  }
};
