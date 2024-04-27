const token = localStorage.getItem("token");
const onLoadUsersPage = async () => {
  const users = await getUsers();

  const usersTbody = document.getElementById("users-tbody");

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.id = user.id;
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.maxActions}</td>
      <td>${user.remainingActions}</td>
    `;
    usersTbody.appendChild(tr);
  });
};

const getUsers = async () => {
  const resp = await fetch("http://localhost:3000/users/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const users = await resp.json();
  return users;
};



window.onload = onLoadUsersPage;
