export function saveToLocal(username, password) {
  let users = window.sessionStorage._users_;
  if (!users) {
    users = {};
  }
  if (typeof (users) !== 'object') {
    users = JSON.parse(users);
  }
  if (!users[username]) {
    console.log(username);
    users[username] = {
      username: username,
      password: password
    };
  }
  window.sessionStorage._users_ = JSON.stringify(users);
}

export function loadFromLocal(username) {
  let users = window.sessionStorage._users_;
  if (!users) {
    return;
  }
  users = JSON.parse(users);
  if (!users[username]) {
    return;
  }
  return users[username].password;
}
