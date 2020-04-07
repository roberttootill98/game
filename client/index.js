'use strict'

async function boot() {
  if(clientContent.cookie) {
    // prompt modal window
    const games = await getGames();
    promptModalWindow(games);
  } else {
    // prompt login
    promptLoginWindow();
  }
}

function promptModalWindow(games) {
  // create container
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.classList.add('modalWindow');

  const title = document.createElement('h3');
  container.appendChild(title);
  title.id = 'title';
  title.textContent = 'Create or Join a Game';

  // create container list
  const gameList = document.createElement('ul');
  container.appendChild(gameList);
  gameList.id = 'gameList';

  // add games
  for(let game of games) {
    const gameContainer = document.createElement('div');
    gameList.appendChild(gameContainer);
    gameContainer.classList.add('gameContainer');
    gameContainer.id = game.gameID;

    // add name
    const nameLabel = document.createElement('p');
    gameContainer.appendChild(nameLabel);
    nameLabel.classList.add('nameLabel');
    nameLabel.textContent = game.name;

    gameContainer.onclick = joinGame;
  }

  // add create new button
  const buttonContainer = document.createElement('div');
  container.appendChild(buttonContainer);
  buttonContainer.id = 'buttonContainer';

  const createNew = document.createElement('button');
  buttonContainer.appendChild(createNew);
  createNew.onclick = newGameModalWindow;
  createNew.textContent = 'Create new game';
  createNew.classList.add('button');
}

function newGameModalWindow() {
  // remove previous window
  document.querySelector('.modalWindow').remove();

  const container = document.createElement('div');
  document.body.appendChild(container);
  container.classList.add('modalWindow');

  // delete elements in modal window
  const childNodes = container.childNodes;
  for(let childNode of childNodes) {
      childNode.remove();
  }

  // add entry fields
  // title
  const title = document.createElement('h3');
  container.appendChild(title);
  title.id = 'title';
  title.textContent = 'Create a Game';
  // name
  // label
  const nameLabel = document.createElement('p');
  container.appendChild(nameLabel);
  nameLabel.classList.add('label');
  nameLabel.textContent = 'Name:';
  // input
  const nameInput = document.createElement('input');
  container.appendChild(nameInput);
  nameInput.classList.add('input');
  nameInput.id = 'nameInput';

  // buttons
  const buttonContainer = document.createElement('div');
  container.appendChild(buttonContainer);
  buttonContainer.id = 'buttonContainer';
  // create
  const create = document.createElement('button');
  buttonContainer.appendChild(create);
  create.onclick = createGame;
  create.textContent = 'Create Game';
  create.classList.add('button');
  // cancel
  const cancel = document.createElement('button');
  buttonContainer.appendChild(cancel);
  cancel.onclick = cancelFunc;
  cancel.textContent = 'Cancel';
  cancel.classList.add('button');
}

async function cancelFunc() {
  // delete current modalWindow
  document.querySelector('.modalWindow').remove();

  boot();
}

window.addEventListener("load", boot);
