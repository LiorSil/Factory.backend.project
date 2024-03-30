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

const reduceAction = async (userId) => {
  let users = await getUsers();

  // user id is ObjectId type and we need to convert it to string
  const userIdStr = await userId.toString();
  const user = await getUserById(userIdStr);

  if (user.actionAllowed === 0) {
    return {
      message: "No actions left for today",
      status: false,
    };
  } else {
    console.log("reducing action");
    user.actionAllowed = user.actionAllowed - 1;
    users = users.map((u) => (u.id === userIdStr ? user : u));
    await jsonfile.writeFile(file, { users });

    console.log("Action reduced");
  }
};

module.exports = {
  getUsers,
  getUserById,
  initializeUsers,
  reduceAction,
};
