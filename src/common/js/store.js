export function saveToLocal(username, password) {
  let users = window.sessionStorage._users_;
  if (!users) {
    users = {};
  }
  if (typeof (users) !== 'object') {
    users = JSON.parse(users);
  }
  if (!users[username]) {
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

export function saveMessage(data) {
  let key = data.userlist[0];
  let messages = window.sessionStorage._messages_;
  if (!messages) {
    messages = {};
  }
  if (typeof (messages) !== 'object') {
    messages = JSON.parse(messages);
  }
  if (!messages[key]) {
    messages[key] = [];
  }
  messages[key].push(data);
  window.sessionStorage._messages_ = JSON.stringify(messages);
}

export function loadMessage(key) {
  let messages = window.sessionStorage._messages_;
  if (!messages) {
    return;
  }
  messages = JSON.parse(messages);
  if (!messages[key]) {
    return;
  }
  return messages[key];
}

export function clearMessage(key1, key2) {
  let messages = window.sessionStorage._messages_;
  if (!messages) {
    return;
  }
  if (typeof (messages) !== 'object') {
    messages = JSON.parse(messages);
  }
  if (messages[key1]) {
    let indexArray = [];
    messages[key1].forEach((item, index) => {
      if (item.username === key2) {
        indexArray.push(index);
      }
    });
    console.log(indexArray);
    let count = 0;
    indexArray.forEach((item) => {
      messages[key1].splice(item - count, 1);
      count++;
    });
    if (!messages[key1]) {
      delete messages[key1];
    }
  }
  window.sessionStorage._messages_ = JSON.stringify(messages);
}
