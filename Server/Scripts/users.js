const token = sessionStorage.getItem("token");
const onLoadUsersPage = async () => {
  const users = await getUsers();
  await fillTbodyWithUsers(users);
};

const getUsers = async () => {
  const resp = await fetch("http://localhost:3000/users/get_users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const users = await resp.json();
  return users;
};

const fillTbodyWithUsers = async (users) => {
  const tbody = document.getElementById("users-tbody");
  tbody.innerHTML = "";
  users.forEach(async (user) => {
    const tr = document.createElement("tr");
    tr.id = user.id;
    tr.innerHTML = `
        <td>${user.fullname}</td>
        <td>${user.num_of_actions}</td>
        <td>${user._id}</td>
        `;
    tbody.appendChild(tr);
  });
};

window.onload = onLoadUsersPage;