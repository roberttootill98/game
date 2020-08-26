// class definition lobby
'use strict';

class Lobby extends SVG {
  static instance;

  constructor(game, playerNumber, width, height) {
    super(width, height, 0, 0);
    this.game = game;
    this.playerNumber = playerNumber.slice(6) - 1;

    Lobby.instance = this;

    this.draw();
  }

  draw() {
    // container
    this.svg = document.createElementNS(svgns, 'svg');
    document.getElementById('main').appendChild(this.svg);
    this.svg.id = 'lobby_svg_workspace';
    this.svg.classList.add('svg_workspace');
    // svg attributes
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    // background
    this.svg.background = document.createElementNS(svgns, 'rect');
    this.svg.appendChild(this.svg.background);
    this.svg.background.setAttribute('width', this.svg.getAttribute('width'));
    this.svg.background.setAttribute('height', this.svg.getAttribute('height'));
    this.svg.background.setAttribute('fill', 'green');
    this.svg.background.setAttribute('stroke', 'black');

    // game name
    this.svg.gameName = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.gameName);
    // svg attributes
    this.svg.gameName.setAttribute('width',
      this.svg.getAttribute('width') * 0.75);
    this.svg.gameName.setAttribute('height',
      this.svg.getAttribute('height') * 0.10);
    this.svg.gameName.setAttribute('x', 0);
    this.svg.gameName.setAttribute('y', 0);
    // background
    // text
    this.svg.gameName.text = document.createElementNS(svgns, 'text');
    this.svg.gameName.appendChild(this.svg.gameName.text);
    this.svg.gameName.text.textContent = this.game.name;
    // svg attributes
    this.svg.gameName.text.setAttribute('x', '50%');
    this.svg.gameName.text.setAttribute('y', '50%');
    this.svg.gameName.text.setAttribute('alignment-baseline', 'middle');
    this.svg.gameName.text.setAttribute('text-anchor', 'middle');
    this.svg.gameName.text.setAttribute('stroke', 'black');

    this.svg.countdown = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.countdown);
    // svg attributes
    this.svg.countdown.setAttribute('width',
      this.svg.getAttribute('width') -
      this.svg.gameName.getAttribute('width'));
    this.svg.countdown.setAttribute('height',
      this.svg.gameName.getAttribute('height'));
    this.svg.countdown.setAttribute('x', this.svg.gameName.getAttribute('x') +
      this.svg.gameName.getAttribute('width'));
    this.svg.countdown.setAttribute('y', this.svg.gameName.getAttribute('y'));
    // text
    this.svg.countdown.text = document.createElementNS(svgns, 'text');
    this.svg.countdown.appendChild(this.svg.countdown.text);
    this.svg.countdown.text.id = 'countdown_text';
    this.svg.countdown.text.textContent = 5;
    // svg attributes
    this.svg.countdown.text.setAttribute('x', '50%');
    this.svg.countdown.text.setAttribute('y', '50%');
    this.svg.countdown.text.setAttribute('alignment-baseline', 'middle');
    this.svg.countdown.text.setAttribute('text-anchor', 'middle');
    this.svg.countdown.text.setAttribute('stroke', 'black');

    // draw players
    this.svg.players = [{}, {}];
    for(let i = 0; i < this.svg.players.length; i++) {
      // player name
      this.svg.players[i].playerName = document.createElementNS(svgns, 'svg');
      this.svg.appendChild(this.svg.players[i].playerName);
      // svg attributes
      this.svg.players[i].playerName.setAttribute('width',
        this.svg.gameName.getAttribute('width') * 0.5);
      this.svg.players[i].playerName.setAttribute('height',
        this.svg.getAttribute('height') * 0.25);
      this.svg.players[i].playerName.setAttribute('x', 0);
      this.svg.players[i].playerName.setAttribute('y',
        parseFloat(this.svg.gameName.getAttribute('y')) +
        parseFloat(this.svg.gameName.getAttribute('height')) +
        parseFloat(this.svg.players[i].playerName.getAttribute('height')) * i);
      // background
      this.svg.players[i].playerName.background = document.createElementNS(svgns,
        'rect');
      this.svg.players[i].playerName.appendChild(
        this.svg.players[i].playerName.background);
      this.svg.players[i].playerName.background.setAttribute('width',
        this.svg.players[i].playerName.getAttribute('width'));
      this.svg.players[i].playerName.background.setAttribute('height',
        this.svg.players[i].playerName.getAttribute('height'));
      this.svg.players[i].playerName.background.setAttribute('fill', 'green');
      this.svg.players[i].playerName.background.setAttribute('stroke', 'black');
      // text
      this.svg.players[i].playerName.text = document.createElementNS(svgns, 'text');
      this.svg.players[i].playerName.appendChild(
        this.svg.players[i].playerName.text);
      // if current player we are drawing is us
      if(this.playerNumber == i) {
        this.svg.players[i].playerName.text.textContent = 'You';
      } else {
        this.svg.players[i].playerName.text.textContent = 'Enemy';
      }
      // svg attributes
      this.svg.players[i].playerName.text.setAttribute('x', '50%');
      this.svg.players[i].playerName.text.setAttribute('y', '50%');
      this.svg.players[i].playerName.text.setAttribute(
        'alignment-baseline', 'middle');
      this.svg.players[i].playerName.text.setAttribute('text-anchor', 'middle');
      this.svg.players[i].playerName.text.setAttribute('stroke', 'black');

      // loadout
      this.svg.players[i].loadout = document.createElementNS(svgns, 'svg');
      this.svg.appendChild(this.svg.players[i].loadout);
      // svg attributes
      this.svg.players[i].loadout.setAttribute('width',
        this.svg.gameName.getAttribute('width') -
        this.svg.players[i].playerName.getAttribute('width'));
      this.svg.players[i].loadout.setAttribute('height',
        this.svg.players[i].playerName.getAttribute('height'));
      this.svg.players[i].loadout.setAttribute('x',
        parseFloat(this.svg.players[i].playerName.getAttribute('x')) +
        this.svg.players[i].playerName.getAttribute('width'));
      this.svg.players[i].loadout.setAttribute('y',
        this.svg.players[i].playerName.getAttribute('y'));
      // background
      this.svg.players[i].loadout.background = document.createElementNS(svgns,
        'rect');
      this.svg.players[i].loadout.appendChild(
        this.svg.players[i].loadout.background);
      this.svg.players[i].loadout.background.setAttribute('width',
        this.svg.players[i].loadout.getAttribute('width'));
      this.svg.players[i].loadout.background.setAttribute('height',
        this.svg.players[i].loadout.getAttribute('height'));
      this.svg.players[i].loadout.background.setAttribute('fill', 'white');
      this.svg.players[i].loadout.background.setAttribute('stroke', 'black');

      if(this.game.players[i]) {
        this.draw_loadouts(this.svg.players[i].loadout,
          this.game.players[i].loadouts, this.playerNumber == i);
      }

      // ready button
      this.svg.players[i].ready = document.createElementNS(svgns, 'svg');
      this.svg.appendChild(this.svg.players[i].ready);
      // svg attributes
      this.svg.players[i].ready.setAttribute('width',
        this.svg.getAttribute('width') -
        this.svg.players[i].loadout.getAttribute('width') -
        this.svg.players[i].playerName.getAttribute('width'));
      this.svg.players[i].ready.setAttribute('height',
        this.svg.players[i].playerName.getAttribute('height'));
      this.svg.players[i].ready.setAttribute('x',
        parseFloat(this.svg.players[i].loadout.getAttribute('x')) +
        parseFloat(this.svg.players[i].loadout.getAttribute('width')));
      this.svg.players[i].ready.setAttribute('y',
        this.svg.players[i].playerName.getAttribute('y'));
      // background
      this.svg.players[i].ready.background = document.createElementNS(svgns,
        'rect');
      this.svg.players[i].ready.appendChild(
        this.svg.players[i].ready.background);
      // svg attributes
      this.svg.players[i].ready.background.setAttribute('width',
        this.svg.players[i].ready.getAttribute('width'));
      this.svg.players[i].ready.background.setAttribute('height',
        this.svg.players[i].ready.getAttribute('height'));
      this.svg.players[i].ready.background.setAttribute('fill', 'green');
      this.svg.players[i].ready.background.setAttribute('stroke', 'black');

      // box
      this.svg.players[i].ready.box = document.createElementNS(svgns, 'svg');
      this.svg.players[i].ready.appendChild(this.svg.players[i].ready.box);
      if(this.playerNumber == i) {
        this.svg.players[i].ready.box.id = 'player_box';
      } else {
        this.svg.players[i].ready.box.id = 'opponent_box';
      }
      // svg attributes
      // square shaped
      this.svg.players[i].ready.box.setAttribute('width',
        this.svg.players[i].ready.getAttribute('width') * 0.25);
      this.svg.players[i].ready.box.setAttribute('height',
        this.svg.players[i].ready.box.getAttribute('width'));
      this.svg.players[i].ready.box.setAttribute('x',
        this.svg.players[i].ready.getAttribute('width') * 0.5 -
        this.svg.players[i].ready.box.getAttribute('width') * 0.5);
      this.svg.players[i].ready.box.setAttribute('y',
        this.svg.players[i].ready.getAttribute('height') * 0.5 -
        this.svg.players[i].ready.box.getAttribute('height') * 0.5);
      // background
      this.svg.players[i].ready.box.background = document.createElementNS(svgns,
        'rect');
      this.svg.players[i].ready.box.appendChild(
        this.svg.players[i].ready.box.background);
      // svg attributes
      this.svg.players[i].ready.box.background.setAttribute('width',
        this.svg.players[i].ready.box.getAttribute('width'));
      this.svg.players[i].ready.box.background.setAttribute('height',
        this.svg.players[i].ready.box.getAttribute('height'));
      this.svg.players[i].ready.box.background.setAttribute('fill', 'green');
      this.svg.players[i].ready.box.background.setAttribute('stroke', 'black');

      // cross
      this.draw_cross(i);

      // only add event listeners if this is our ready button
      if(this.playerNumber == i) {
        this.svg.players[i].ready.box.onmousedown = readyup;
        this.svg.players[i].ready.box.classList.add('button_enabled');
      }
    }

    // chat
  }

  /**
   * draws loadouts
   * @param {svg} loadout, container of loadout
   * @param {<json>} loadouts, list of loadout records
   * @param {boolean} self, true if the loadouts being drawn are for this user
   */
  draw_loadouts(loadout, loadouts, self) {
    // vertical list of loadouts
    loadout.loadouts = [];
    const total = 8; // should be acquired from server
    // loadouts have 10% height
    const height = loadout.getAttribute('height') * 0.1;
    const width = loadout.getAttribute('width') * 0.6;
    // button
    const b_height = height;
    // 3 seperation gaps + 1 width for button
    const b_width = (loadout.getAttribute('width') - width) / 4;
    // seperation
    const v_seperation = (loadout.getAttribute('height') -
      loadout.getAttribute('height') * 0.1 * total) / (total + 1);
    //
    const h_seperation = b_width;

    for(let j = 0; j < total; j++) {
      if(loadouts[j]) {
        loadout.loadouts.push();

        // loadout name
        // edit button
      } else if(self && !loadout.new && j <= total) {
        // if we are drawing loadouts for ourselves
        // if there is no make new loadout button currently
        // if we have run out of loadouts
        // if there is a space for a new loadout draw add new button
        // if there are more than 8 (?) loadouts then do not add this option

        // container
        loadout.new = document.createElementNS(svgns, 'svg');
        loadout.appendChild(loadout.new);
        loadout.new.id = 'loadout_createNew';
        loadout.new.classList.add('loadout');
        // svg attributes
        loadout.new.setAttribute('width', loadout.getAttribute('width'));
        loadout.new.setAttribute('height', height);
        loadout.new.setAttribute('x', 0);
        loadout.new.setAttribute('y', v_seperation * (j + 1) + height * j);

        // label
        loadout.new.label = document.createElementNS(svgns, 'svg');
        loadout.new.appendChild(loadout.new.label);
        loadout.new.label.classList.add('loadout_label');
        // svg attributes
        loadout.new.label.setAttribute('width', width);
        loadout.new.label.setAttribute('height',
          loadout.new.getAttribute('height'));
        loadout.new.label.setAttribute('x', h_seperation);
        loadout.new.label.setAttribute('y',
          v_seperation * (j + 1) + height * j);
        // background
        loadout.new.label.background = document.createElementNS(svgns, 'rect');
        loadout.new.label.appendChild(loadout.new.label.background);
        // svg attributes
        loadout.new.label.background.setAttribute('width',
          loadout.new.label.getAttribute('width'));
        loadout.new.label.background.setAttribute('height',
          loadout.new.label.getAttribute('height'));
        loadout.new.label.background.setAttribute('fill', 'grey');
        // text saying new loadout in shape of loadout
        loadout.new.label.text = document.createElementNS(svgns, 'text');
        loadout.new.label.appendChild(loadout.new.label.text);
        loadout.new.label.text.textContent = 'new loadout...';
        // svg attributes
        loadout.new.label.text.setAttribute('x', '50%'); // left justified
        loadout.new.label.text.setAttribute('y', '50%');
        loadout.new.label.text.setAttribute('alignment-baseline', 'middle');
        loadout.new.label.text.setAttribute('text-anchor', 'middle');
        loadout.new.label.text.setAttribute('stroke', 'black');

        // button to create instead of edit
        // container
        loadout.new.button = document.createElementNS(svgns, 'svg');
        loadout.new.appendChild(loadout.new.button);
        loadout.new.button.classList.add('loadout_button');
        if(self) {
          loadout.new.button.onmousedown = loadout_createNew;
          loadout.new.button.onmouseover = loadout_mouseover;
          loadout.new.button.onmouseleave = loadout_mouseleave;
        }
        // svg attributes
        loadout.new.button.setAttribute('width', b_width);
        loadout.new.button.setAttribute('height', b_height);
        loadout.new.button.setAttribute('x',
          parseFloat(loadout.new.label.getAttribute('x')) +
          parseFloat(loadout.new.label.getAttribute('width')) + h_seperation);
        loadout.new.button.setAttribute('y',
          v_seperation * (j + 1) + height * j);
        // circle
        loadout.new.button.background = document.createElementNS(svgns, 'circle');
        loadout.new.button.appendChild(loadout.new.button.background);
        // svg attributes
        loadout.new.button.background.setAttribute('r',
          loadout.new.button.getAttribute('height') / 8 * 3);
        loadout.new.button.background.setAttribute('cx',
          loadout.new.button.background.getAttribute('r'));
        loadout.new.button.background.setAttribute('cy',
          loadout.new.button.background.getAttribute('r'));
        loadout.new.button.background.setAttribute('fill', 'blue');
        // symbol
      }
    }
  }

  draw_cross(index) {
    const width = this.svg.players[index].ready.box.getAttribute('width');
    const height = this.svg.players[index].ready.box.getAttribute('height');
    const crossWidth = width * 0.2;

    this.svg.players[index].ready.box.cross = document.createElementNS(svgns,
      'polygon');
    this.svg.players[index].ready.box.appendChild(
      this.svg.players[index].ready.box.cross);
    this.svg.players[index].ready.box.cross.classList.add('cross');
    // svg attributes
    this.svg.players[index].ready.box.cross.setAttribute('fill', 'red');
    this.svg.players[index].ready.box.cross.setAttribute('stroke', 'black');
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
    this.svg.players[index].ready.box.cross.setAttribute('points', points);
  }

  draw_tick(index) {
    const width = this.svg.players[index].ready.box.getAttribute('width');
    const height = this.svg.players[index].ready.box.getAttribute('height');
    const tickWidth = width * 0.2;

    this.svg.players[index].ready.box.tick = document.createElementNS(svgns,
      'polygon');
    this.svg.players[index].ready.box.appendChild(
      this.svg.players[index].ready.box.tick);
    this.svg.players[index].ready.box.tick.classList.add('tick');
    // svg attributes
    this.svg.players[index].ready.box.tick.setAttribute('fill', 'blue');
    this.svg.players[index].ready.box.tick.setAttribute('stroke', 'black');
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
    this.svg.players[index].ready.box.tick.setAttribute('points', points);
  }
}

let interval_countdown = null;
let interval_startCheck = null;

// gets index of player using box
function getIndex(box) {
  for(const [i, player] of Lobby.instance.svg.players.entries()) {
    if(player.ready.box == box) {
      return i;
    }
  }
}

async function readyup(ev) {
  const box = SVG.getTopLevelSVG(ev.target);
  const index = getIndex(box);
  const polygon = box.querySelector('polygon');
  if(polygon.classList.contains('tick')) {
    return;
  }
  polygon.remove();

  // inform server
  const response = await fetch('/api/lobby/ready', {'method': 'put'});
  if(response.ok) {
    // draw tick
    Lobby.instance.draw_tick(index);
    box.onmousedown = unready;

    if(checkReady(await getGame())) {
      interval_countdown = setInterval(countdown, 1000);
      interval_startCheck = setInterval(startCheck, 5000);
    }
  } else {
    console.error(response.status);
  }
}

async function unready(ev) {
  const box = SVG.getTopLevelSVG(ev.target);
  const index = getIndex(box);
  const polygon = box.querySelector('polygon');
  if(polygon.classList.contains('cross')) {
    return;
  }
  polygon.remove();

  // inform server
  const response = await fetch('/api/lobby/unready', {'method': 'put'});
  if(response.ok) {
    // draw cross
    Lobby.instance.draw_cross(index);
    box.onmousedown = readyup;

    // clear intervals
    clearInterval(interval_countdown);
    clearInterval(interval_startCheck);

    // set countdown text back to 5 seconds
    document.getElementById('countdown_text').textContent = 5;
  } else {
    console.error(response.status);
  }
}

// called when a ready message is sent down the game socket
async function gameSocket_readyMessage(ev) {
  // if the player sending the message is not us then update other ready box
  const messageContents = ev.split("_");
  if(messageContents[0] != (await getPlayerNumber()).slice(6)) {
    const box = Lobby.instance.svg.players[
      parseInt(messageContents[0]) - 1].ready.box;
    const index = getIndex(box);
    const polygon = box.querySelector('polygon');
    polygon.remove();

    if(messageContents[1] == 'ready') {
      // draw tick
      Lobby.instance.draw_tick(index);
      box.onmousedown = unready;

      // if both players are ready start set interval
      // if both players ready for 5 seconds
      // then start game
      if(checkReady(await getGame())) {
        interval_countdown = setInterval(countdown, 1000);
        interval_startCheck = setInterval(startCheck, 5000);
      }
    } else if(messageContents[1] == 'unready') {
      // draw cross
      Lobby.instance.draw_cross(index);
      box.onmousedown = readyup;

      // clear intervals
      clearInterval(interval_countdown);
      clearInterval(interval_startCheck);

      // set countdown text back to 5 seconds
      document.getElementById('countdown_text').textContent = 5;
    }
  }
}

// checks if all the players in a game are ready
function checkReady(game) {
  for(const player of game.players) {
    if(!player.ready) {
      return false;
    }
  }
  return true;
}

// after each second in countdown update text showing countdown
function countdown() {
  const countdown_text = document.getElementById('countdown_text');
  countdown_text.textContent = parseInt(countdown_text.textContent) - 1;
}

// checks if both players are ready at the end of interval
async function startCheck() {
  // if players still ready
  if(checkReady(await getGame())) {
    clearInterval(interval_countdown);
    clearInterval(interval_startCheck);

    clearContent();
    Lobby.instance.destroy();
    await createGameBoard();

    await startGame();
  }
}

async function loadout_createNew() {
  console.log("creating new loadout");

  // prompt modal window
}


function loadout_mouseover() {
}
function loadout_mouseleave() {
}
