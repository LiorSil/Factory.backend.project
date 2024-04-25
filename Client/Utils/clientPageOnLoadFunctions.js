const displayUserAndLogout = async () => {
  const fullname = sessionStorage.getItem("name");

  // Check if the user is logged in
  if (fullname) {
    // Create an element to display the user's name
    const userElement = document.createElement("div");
    userElement.textContent = `Welcome, ${fullname}!`;
    userElement.style.fontWeight = "bold";
    userElement.style.padding = "10px";
    userElement.style.backgroundColor = "#f0f0f0";
    userElement.style.textAlign = "center";
    userElement.style.marginBottom = "10px";

    // Append the user element to the body
    document.body.insertBefore(userElement, document.body.firstChild);

    // Create a home button
    const homeButton = document.createElement("button");
    homeButton.textContent = "Home";
    homeButton.style.padding = "5px";
    homeButton.style.margin = "5px";
    homeButton.style.cursor = "pointer";

    // Add a click event listener to the home button
    homeButton.addEventListener("click", home);

    // Create a logout button
    const logoutButton = document.createElement("button");
    logoutButton.textContent = "Logout";
    logoutButton.style.padding = "5px";
    logoutButton.style.margin = "5px";
    logoutButton.style.cursor = "pointer";

    // Add a click event listener to the logout button
    logoutButton.addEventListener("click", logout);

    // Append the logout button + home button to the body
    document.body.insertBefore(homeButton, document.body.firstChild);
    document.body.insertBefore(logoutButton, document.body.firstChild);
  }
};

function logout() {
  // Remove token and name from sessionStorage

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("name");

  window.location.href = "./login.html";
}

function home() {
  window.location.href = "./home.html";
}

window.addEventListener("load", () => displayUserAndLogout());
