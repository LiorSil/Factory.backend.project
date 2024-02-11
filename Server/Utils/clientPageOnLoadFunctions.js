function displayUserAndLogout() {
   console.log("displayUserAndLogout function is called!");
  // Get the user's name from sessionStorage
  const userName = sessionStorage.getItem("name");

  // Check if the user is logged in
  if (userName) {
    // Create an element to display the user's name
  const userElement = document.createElement("div");
    userElement.textContent = `Welcome, ${userName}!`;
    userElement.style.fontWeight = "bold";
    userElement.style.padding = "10px";
    userElement.style.backgroundColor = "#f0f0f0";
    userElement.style.textAlign = "center";
    userElement.style.marginBottom = "10px";

    // Append the user element to the body
    document.body.insertBefore(userElement, document.body.firstChild);

    // Create a logout button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.style.padding = "5px";
    logoutButton.style.margin = "5px";
    logoutButton.style.cursor = "pointer";

    // Add a click event listener to the logout button
    logoutButton.addEventListener("click", logout);

    // Append the logout button to the body
    document.body.insertBefore(logoutButton, document.body.firstChild);
  }
}

function logout() {
  // Remove token and name from sessionStorage
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("name");
  sessionStorage.removeItem("username");

  // Redirect to the login page
  window.location.href = "./login.html";
}

window.addEventListener("load", () => displayUserAndLogout());
