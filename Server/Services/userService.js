// Import necessary modules
const userRepo = require("../Repositories/userRepo");
const path = require("path");
const actionsPath = path.join(__dirname, "../Logs/users.json");
const jsonfile = require("jsonfile");
const NodeCache = require("node-cache");

// Create a cache with a 5-minute expiration
const cache = new NodeCache({ stdTTL: 300 });

//Retrieves a user by their ID from the re
const getUserById = async (userId) => {
  return await userRepo.getUserById(userId);
};

// Retrieves all users from the repository.
const getUsers = async () => {
  return await userRepo.getUsers();
};

// Checks if the user has remaining actions.

const isRemainingActions = async (userId) => {
  const user = await getUserById(userId);

  // Check if user is in cache
  let remainingActions = cache.get(user.fullname);

  // If user is not in cache, get remaining actions from DB
  if (remainingActions === undefined) {
    remainingActions = user.num_of_actions;
    cache.set(user.fullname, remainingActions);
  }

  remainingActions--;

  if (remainingActions < 0) {
    return {
      isRemainingActions: false,
      message: "You have no remaining actions",
    };
  }

  cache.set(user.fullname, remainingActions);

  return {
    isRemainingActions: true,
    message: `You have ${remainingActions} remaining actions`,
  };
};

// Updates the remaining actions for a user.

const updateRemainingActions = async (userId, remainingActions) => {
  try {
    const user = await getUserById(userId);
    const maxActions = user.num_of_actions;
    const date = new Date().toLocaleDateString();
    const newLog = {
      id: user.id,
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
  getUsers,
  isRemainingActions,
  updateRemainingActions,
};
