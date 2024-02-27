const authRepo = require('../Repositories/authRepo');

const authUser = async (username, email) => {
    const user = await authRepo.getUserByUsername(username);

    if (!user) return { success: false, message: "User not found" };

    if (user.email !== email) return { success: false, message: "Wrong email " };

    return { success: true, message: "Login successful", name: user.name};
}
    

module.exports = {
    authUser
}
 