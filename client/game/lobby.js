// functions todo with the lobby
'use strict';

async function drawLobby(game) {
  clearContent();

  // container
  const lobby_svg_workspace = document.createElementNS(svgns, 'svg');
  document.getElementById('main').appendChild(lobby_svg_workspace);
  lobby_svg_workspace.id = 'lobby_svg_workspace';
  lobby_svg_workspace.classList.add('svg_workspace');
  // svg attributes
  lobby_svg_workspace.setAttribute('width', getWidth());
  lobby_svg_workspace.setAttribute('height', getHeight() * 0.95);

  // background
  const lobby_background = document.createElementNS(svgns, 'rect');
  lobby_svg_workspace.appendChild(lobby_background);
  lobby_background.setAttribute('width',
    lobby_svg_workspace.getAttribute('width'));
  lobby_background.setAttribute('height',
    lobby_svg_workspace.getAttribute('height'));
  lobby_svg_workspace.setAttribute('fill', 'green');
  lobby_svg_workspace.setAttribute('stroke', 'black');

  // game name
  // container
  const container_gameName = document.createElementNS(svgns, 'svg');
  lobby_svg_workspace.appendChild(container_gameName);
  // svg attributes
  container_gameName.setAttribute('width',
    lobby_svg_workspace.getAttribute('width'));
  container_gameName.setAttribute('height',
    lobby_svg_workspace.getAttribute('height') * 0.10);
  container_gameName.setAttribute('x', 0);
  container_gameName.setAttribute('y', 0);

  // background

  // text
  const gameName_text = document.createElementNS(svgns, 'text');
  container_gameName.appendChild(gameName_text);
  gameName_text.textContent = game.name;
  // svg attributes
  gameName_text.setAttribute('x', '50%');
  gameName_text.setAttribute('y', '50%');
  gameName_text.setAttribute('alignment-baseline', 'middle');
  gameName_text.setAttribute('text-anchor', 'middle');
  gameName_text.setAttribute('stroke', 'black');

  for(let i = 0; i < 2; i++) {
    // player name
    const container_playerName = document.createElementNS(svgns, 'svg');
    lobby_svg_workspace.appendChild(container_playerName);
    // svg attributes
    container_playerName.setAttribute('width',
      lobby_svg_workspace.getAttribute('width') * 0.75);
    container_playerName.setAttribute('height',
      lobby_svg_workspace.getAttribute('height') * 0.25);
    container_playerName.setAttribute('x', 0);
    container_playerName.setAttribute('y',
      parseFloat(container_gameName.getAttribute('y')) +
      parseFloat(container_gameName.getAttribute('height')) +
      parseFloat(container_playerName.getAttribute('height')) * i);

    // background
    const playerName_background = document.createElementNS(svgns, 'rect');
    container_playerName.appendChild(playerName_background);
    playerName_background.setAttribute('width',
      container_playerName.getAttribute('width'));
    playerName_background.setAttribute('height',
      container_playerName.getAttribute('height'));
    playerName_background.setAttribute('stroke', 'black');

    // text
    const playerName_text = document.createElementNS(svgns, 'text');
    container_playerName.appendChild(playerName_text);
    // if current player we are drawing is us
    if((await getPlayerNumber()).slice(6) == i + 1) {
      playerName_text.textContent = 'You';
    } else {
      playerName_text.textContent = 'Enemy';
    }
    // svg attributes
    playerName_text.setAttribute('x', '50%');
    playerName_text.setAttribute('y', '50%');
    playerName_text.setAttribute('alignment-baseline', 'middle');
    playerName_text.setAttribute('text-anchor', 'middle');
    playerName_text.setAttribute('stroke', 'black');

    // ready button
    const container_readyButton = document.createElementNS(svgns, 'svg');
    lobby_svg_workspace.appendChild(container_readyButton);
    // svg attributes
    container_readyButton.setAttribute('width',
      lobby_svg_workspace.getAttribute('width') -
      container_playerName.getAttribute('width'));
    container_readyButton.setAttribute('height',
      container_playerName.getAttribute('height'));
    container_readyButton.setAttribute('x',
      container_playerName.getAttribute('x') +
      container_playerName.getAttribute('width'));
    container_readyButton.setAttribute('y',
      container_playerName.getAttribute('y'));

    // background
    const readyButton_background = document.createElementNS(svgns, 'rect');
    container_readyButton.appendChild(readyButton_background);
    // svg attributes
    readyButton_background.setAttribute('width',
      container_readyButton.getAttribute('width'));
    readyButton_background.setAttribute('height',
      container_readyButton.getAttribute('height'));
    readyButton_background.setAttribute('stroke', 'black');

    // box
    const readyButton_box = document.createElementNS(svgns, 'svg');
    container_readyButton.appendChild(readyButton_box);
    if((await getPlayerNumber()).slice(6) == i + 1) {
      readyButton_box.id = 'player_box';
    } else {
      readyButton_box.id = 'opponent_box';
    }
    readyButton_box.classList.add('button_enabled');
    // svg attributes
    // square shaped
    readyButton_box.setAttribute('width',
      container_readyButton.getAttribute('width') * 0.25);
    readyButton_box.setAttribute('height', readyButton_box.getAttribute('width'));
    readyButton_box.setAttribute('x',
      container_readyButton.getAttribute('width') * 0.5 -
      readyButton_box.getAttribute('width') * 0.5);
    readyButton_box.setAttribute('y',
      container_readyButton.getAttribute('height') * 0.5 -
      readyButton_box.getAttribute('height') * 0.5);

    // background
    const readyButton_box_background = document.createElementNS(svgns, 'rect');
    readyButton_box.appendChild(readyButton_box_background);
    // svg attributes
    readyButton_box_background.setAttribute('width',
      readyButton_box.getAttribute('width'));
    readyButton_box_background.setAttribute('height',
      readyButton_box.getAttribute('height'));
    readyButton_box_background.setAttribute('stroke', 'black');

    // cross
    drawCross(readyButton_box);

    // only add event listeners if this is our ready button
    if((await getPlayerNumber()).slice(6) == i + 1) {
      readyButton_box.onmousedown = readyup;
    }
  }

  // chat
}

function drawCross(box) {
  const width = box.getAttribute('width');
  const height = box.getAttribute('height');
  const crossWidth = width * 0.2;

  const cross = document.createElementNS(svgns, 'polygon');
  box.appendChild(cross);
  cross.classList.add('cross');
  // svg attributes
  cross.setAttribute('fill', 'red');
  cross.setAttribute('stroke', 'black');
  // points
  let points = '';
  // top left
  points += `0,${crossWidth} `;
  points += `${crossWidth},0 `;
  // top
  points += `${width * 0.5},${height * 0.5 - crossWidth * 0.5} `;
  // top right
  points += `${width - crossWidth},0 `;
  points += `${width},${crossWidth} `;
  // right
  points += `${width * 0.5 + crossWidth * 0.5},${height * 0.5} `;
  // bottom right
  points += `${width},${height - crossWidth} `;
  points += `${width - crossWidth},${height} `;
  // bottom
  points += `${width * 0.5},${height * 0.5 + crossWidth * 0.5} `;
  // bottom left
  points += `${crossWidth},${height} `;
  points += `0,${height - crossWidth} `;
  // left
  points += `${width * 0.5 - crossWidth * 0.5},${height * 0.5}`;
  // set points
  cross.setAttribute('points', points);
}

function drawTick(box) {
  const width = box.getAttribute('width');
  const height = box.getAttribute('height');
  const tickWidth = width * 0.2;

  const tick = document.createElementNS(svgns, 'polygon');
  box.appendChild(tick);
  tick.classList.add('tick');
  // svg attributes
  tick.setAttribute('fill', 'blue');
  tick.setAttribute('stroke', 'black');
  // points
  let points = '';
  // bottom
  points += `${width * 0.25},${height} `;
  points += `0,${height - height * 0.2} `;
  points += `${width * 0.125},${height - height * 0.3} `;
  points += `${width * 0.25},${height - height * 0.2} `
  // top right
  points += `${width - tickWidth},${height * 0.1} `;
  points += `${width},${height * 0.1 + tickWidth} `;
  // set points
  tick.setAttribute('points', points);
}

async function readyup(ev) {
  const box = SVG.getTopLevelSVG(ev.target);
  const polygon = box.querySelector('polygon');
  if(polygon.classList.contains('tick')) {
    return;
  }
  polygon.remove();

  // inform server
  const response = await fetch('/api/lobby/ready', {'method': 'put'});
  if(response.ok) {
    // draw tick
    drawTick(box);
    box.onmousedown = unready;
  } else {
    console.error(response.status);
  }
}

async function unready(ev) {
  const box = SVG.getTopLevelSVG(ev.target);
  const polygon = box.querySelector('polygon');
  if(polygon.classList.contains('cross')) {
    return;
  }
  polygon.remove();

  // inform server
  const response = await fetch('/api/lobby/unready', {'method': 'put'});
  if(response.ok) {
    // draw cross
    drawCross(box);
    box.onmousedown = readyup;
  } else {
    console.error(response.status);
  }
}

// called when a ready message is sent down the game socket
async function gameSocket_readyMessage(ev) {
  console.log("game socket ready message received");
  console.log(ev);

  // if the player sending the message is not us then update other ready box
  const messageContents = ev.split("_");
  if(messageContents[0] != (await getPlayerNumber()).slice(6)) {
    const box = document.getElementById('opponent_box');
    const polygon = box.querySelector('polygon');
    polygon.remove();

    if(messageContents[1] == 'ready') {
      // draw tick
      drawTick(box);
      box.onmousedown = unready;
    } else if(messageContents[1] == 'unready') {
      // draw cross
      drawCross(box);
      box.onmousedown = readyup;
    }
  }
}
