// Import necessary modules
  const userRepo = require("../Repositories/userRepo");
  const authRepo = require("../Repositories/authRepo");
  const path = require("path");
  const actionsPath = path.join(__dirname, "../Logs/users.json");
  const jsonfile = require("jsonfile");
  const NodeCache = require("node-cache");

  const secondsUntilMidnight = () => {
    // Get current date and time
    const now = new Date();

    // Get tomorrow's date at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Calculate the difference in milliseconds
    const differenceMs = tomorrow.getTime() - now.getTime();

    // Convert milliseconds to seconds
    const differenceSec = Math.floor(differenceMs / 1000);

    return differenceSec;
  };

  const secondsLeft = secondsUntilMidnight();

  const cache = new NodeCache({ stdTTL: secondsLeft });

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

    //get user from the local database (user repo)
    const dbUser = await userRepo.getUserByFullName(user.name);

    // Check if user is in cache has remaining actions
    let remainingActions = cache.get(user.name);

    // If user is not in cache, get remaining actions from DB (initialization)
    if (remainingActions === undefined) {
      remainingActions = dbUser.num_of_actions;
      cache.set(user.name, remainingActions);

      return {
        isNewActionAllowed: true,
        remainingActions: remainingActions,
        fullname: user.name,
      };
    }

    // If user is in cache and has NO remaining actions return false
    if (remainingActions <= 0) {
      return {
        isNewActionAllowed: false,
        remainingActions: remainingActions,
        fullname: user.name,
      };
    }

    // If user is in cache and has remaining actions return true
    return {
      isNewActionAllowed: true,
      remainingActions: remainingActions,
      fullname: user.name,
    };
  };

  // Updates the remaining actions for a user.
  const updateRemainingActions = async (userId, remainingActions) => {
    //get user from the web service (auth repo)
    const user = await authRepo.getUserById(userId);

    //get user from the local database (user repo)
    const dbUser = await userRepo.getUserByFullName(user.name);

    //decrement the remaining actions
    remainingActions--;

    //update the cache
    cache.set(user.name, remainingActions);
   
    try {
      //new data to be added to the json file
      const maxActions = dbUser.num_of_actions;

      // Get the current date in the format MM/DD/YYYY hh:mm:ss
      const date = new Date().toLocaleString();

      // log the remaining actions
      const newLog = {
        id: userId,
        maxActions: maxActions,
        date: date,
        actionsAllowed: remainingActions,
      };

      let actionsData = await jsonfile.readFile(actionsPath);

      await actionsData["actions"].push(newLog);

      // Write the updated data back to the file
      await jsonfile.writeFile(actionsPath, actionsData);

      return {
        log: newLog,
        success: true,
        message: "Remaining actions updated successfully",
      };
    } catch (error) {
      console.error("Error updating remaining actions:", error);
      return {
        log: null,
        success: false,
        message: "Failed to update remaining actions",
      };
    }
  };

  const getRemainingActionsAllUsers = async () => {
    const webServiceUsers = await authRepo.getUsers();
    const databaseUsers = await userRepo.getUsers();

    let remainingActions = [];
    const usersWithRemainingActions = await Promise.all(
      webServiceUsers.map(async (wsUser) => {
        const { remainingActions } = await isRemainingActions(wsUser.id);
        //find the user in the database by name (fullname)
        const dbUser = databaseUsers.find(
          (user) => user.fullname === wsUser.name
        );

        return {
          id: wsUser.id,
          name: wsUser.name,
          remainingActions: remainingActions,
          maxActions: dbUser.num_of_actions,
        };
      })
    ).then((users) => {
      return users;
    });
    return usersWithRemainingActions;
  };

  // Export the functions
  module.exports = {
    getUserById,
    getUserByFullName,
    getUsers,
    isRemainingActions,
    updateRemainingActions,
    getRemainingActionsAllUsers,
  };
