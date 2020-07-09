// handles turns and phases
// actions have to be verified with server before they are sent to other players
// a player completes all three phases before the other player completes their phases
'use strict'

let gameSocket;

async function gameSocket_message(ev) {
  console.log("game socket message received");
  console.log(ev);
}

async function gameSocket_phase(ev) {
  console.log("game socket phase instruction received");
  console.log(ev);

  // if it is the players phase
  const player = ev.slice(0, 7);
  if(player == await getPlayerNumber()) {
    // dom stuff
    document.getElementById('button_endPhase').disabled = false;

    const phase = ev.slice(8);
    switch(phase) {
      case 'phase_shop':
        await start_phase_shop();
        break;
      case 'phase_arrangement':
        break;
      case 'phase_attacking':
        break;
      default:
        break;
    }
  } else {
    // dom stuff
    document.getElementById('button_endPhase').disabled = true;
  }
}

// returns player1 or player2
async function getPlayerNumber() {
  const response = await fetch('/api/game_getPlayerNumber');
  if(response.ok) {
    return (await response.json()).playerNumber;
  }
}

// ends current phase
// stateless
async function endPhase(ev) {
  console.log("ending phase...");

  // find out which phase has ended
  const phase = await getPhase();
  // remove dom elements specific to phase
  // if attacking phase then disable next phase button
  if(phase == 'phase_attacking') {
    document.getElementById('button_endPhase').disabled = true;
  }

  await nextPhase();
}

// sends request to server to move to next phase
async function nextPhase() {
  const response = await fetch('/api/game_nextPhase', {method: 'put'});
  if(response.ok) {
    console.log("moved to next phase");
  } else {
    console.error("failed to move to next phase");
  }
}

// gets current phase
async function getPhase() {
  const response = await fetch('/api/game_getPhase');
  if(response.ok) {
    return (await response.json()).phase;
  } else {
    console.error("failed to get phase");
  }
}

// call to the server to start the game
// made when game has two players
async function startGame() {
  const url = '/api/game_start';

  const response = await fetch(url, {method: 'put'});
  if(response.ok) {
    // game has started correctly
    // watch other players move
  } else {
    console.error("failed to start game...");
    // do teardown
  }
}

// when previous turn has ended for enemy
async function start_phase_shop() {
  // load shop
  await promptShop();
}

// onclick event for closing shop
async function end_phase_shop() {
  // destroy shop elements

  // next phase
  start_phase_arrangement();
}

async function start_phase_arrangement() {
  // add listeners to spell slots
}

// onclick event for done button
async function end_phase_arrangement() {
  // remove listeners from spell slots

  // next phase
  start_phase_attacking();
}

async function start_phase_attacking() {
  // add listeners to companion in move order
}

// onclick event for end turn
async function end_phase_attacking() {
  // remove listeners from companions

  // end turn
  // start shopping phase for enemy player
}
