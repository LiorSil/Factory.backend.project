// Import necessary modules
const userRepo = require("../Repositories/userRepo");
const authRepo = require("../Repositories/authRepo");
const path = require("path");
const actionsPath = path.join(__dirname, "../Logs/users.json");
const jsonfile = require("jsonfile");
const NodeCache = require("node-cache");
const { log } = require("console");

// Create a cache with a 5-minute expiration
const cache = new NodeCache({ stdTTL: 300 });

//Retrieves a user by their ID from the re
const getUserById = async (userId) => {
  return await userRepo.getUserById(userId);
};

const getUserByFullName = async (fullname) => {
  return await userRepo.getUserByFullName(fullname);
};

// Retrieves all users from the repository.
const getUsers = async () => {
  return await userRepo.getUsers();
};

// Checks if the user has remaining actions.

const isRemainingActions = async (userId) => {
  //get user from the web service (auth repo)
  const user = await authRepo.getUserById(userId);
  console.log(`User: ${user}`);

  //get user from the local database (user repo)
  const dbUser = await userRepo.getUserByFullName(user.name);

  // Check if user is in cache
  let remainingActions = cache.get(user.name);

  // If user is not in cache, get remaining actions from DB
  if (remainingActions === undefined) {
    remainingActions = dbUser.num_of_actions;
    cache.set(user.name, remainingActions);
  }

  remainingActions--;

  if (remainingActions < 0) {
    return {
      isRemainingActions: false,
      message: "You have no remaining actions",
    };
  }

  cache.set(user.name, remainingActions);

  return {
    isRemainingActions: true,
    message: `You have ${remainingActions} remaining actions`,
  };
};

// Updates the remaining actions for a user.

const updateRemainingActions = async (userId, remainingActions) => {
  try {
    //get user from the web service (auth repo)
    const user = await authRepo.getUserById(userId);

    //get user from the local database (user repo)
    const dbUser = await userRepo.getUserByFullName(user.name);

    const maxActions = dbUser.num_of_actions;
    const date = new Date().toLocaleDateString();
    const newLog = {
      id: userId,
      maxActions: maxActions,
      date: date,
      remainingActions: remainingActions,
    };

    let actionsData = await jsonfile.readFile(actionsPath);
    actionsData["actions"].push(newLog);
    // Write the updated data back to the file
    await jsonfile.writeFile(actionsPath, actionsData);

    return {
      success: true,
      message: "Remaining actions updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update remaining actions",
    };
  }
};

// Export the functions
module.exports = {
  getUserById,
  getUserByFullName,
  getUsers,
  isRemainingActions,
  updateRemainingActions,
};
