'use strict'

let clientContent = {
  'cookie': null,
  'username': null
};

async function login(username, password) {
  const url = `/api/login?username=${username}&password=${password}`;

  const response = await fetch(url, {method: 'post'});
  if(response.ok) {
    // extract content
    clientContent = await response.json();
  } else {
    console.log('failure');
  }
}

// debug
async function hashString(string) {
  const url = `/api/hashString?string=${string}`;
  const response = await fetch(url);
  if(response.ok) {
    console.log(await response.text());
  } else {
    console.error('failed to hash string');
  }
}

function promptLoginWindow() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.id = 'loginContainer';
  container.classList.add('modalWindow');

  // title
  const title = document.createElement('h3');
  container.appendChild(title);
  title.id = 'title';
  title.textContent = 'Login';
  // name
  const nameContainer = document.createElement('div');
  container.appendChild(nameContainer);
  // label
  const nameLabel = document.createElement('p');
  nameContainer.appendChild(nameLabel);
  nameLabel.classList.add('label');
  nameLabel.textContent = 'Username:';
  // input
  const nameInput = document.createElement('input');
  nameContainer.appendChild(nameInput);
  nameInput.id = 'nameInput';
  nameInput.classList.add('input');

  // password
  // name
  const passwordContainer = document.createElement('div');
  container.appendChild(passwordContainer);
  // label
  const passwordLabel = document.createElement('p');
  passwordContainer.appendChild(passwordLabel);
  passwordLabel.classList.add('label');
  passwordLabel.textContent = 'Password:';
  // input
  const passwordInput = document.createElement('input');
  passwordContainer.appendChild(passwordInput);
  passwordInput.id = 'passwordInput';
  passwordInput.classList.add('input');

  // buttons
  const buttonContainer = document.createElement('div');
  container.appendChild(buttonContainer);
  // submit
  const submitButton = document.createElement('button');
  buttonContainer.appendChild(submitButton);
  buttonContainer.id = 'buttonContainer';
  submitButton.onclick = submit;
  submitButton.textContent = 'Login';
}

async function submit() {
  const username = document.getElementById('nameInput').value;
  const password = document.getElementById('passwordInput').value;

  await login(username, password);

  // delete elements
  document.getElementById('loginContainer').remove();

  boot();
}
