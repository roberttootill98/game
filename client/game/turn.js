// handles turns and phases
// actions have to be verified with server before they are sent to other players
// a player completes all three phases before the other player completes their phases
'use strict'

let gameSocket;

// returns player1 or player2
async function getPlayerNumber() {
  const response = await fetch('/api/game/player/number');
  if(response.ok) {
    return (await response.json()).playerNumber;
  }
}

// lookup table for phases that returns more readable text
const phaseText_lookup = {
  'phase_shop': 'shopping phase',
  'phase_arrangement': 'arrangement phase',
  'phase_attacking': 'attacking phase'
};

// called when a phase message is sent down the game socket
async function gameSocket_phase(ev) {
  // if it is the players phase
  const player = ev.slice(0, 7);
  const phase = ev.slice(8);

  // get dom elements
  const button_endPhase = FooterButton.getByID('button_endPhase');

  if(player == await getPlayerNumber()) {
    // it is your phase

    // dom stuff
    // phase text
    phaseLabel_setText(`My ${phaseText_lookup[phase]}`);
    // end phase button state
    button_endPhase.enable();

    // start phase
    switch(phase) {
      case 'phase_shop':
        await start_phase_shop();
        break;
      case 'phase_arrangement':
        await start_phase_arrangement();
        break;
      case 'phase_attacking':
        await start_phase_attacking();
        break;
      default:
        break;
    }
  } else {
    // it is your opponent's phase

    // dom stuff
    // phase text
    phaseLabel_setText(`Their ${phase}`);
    // end phase button state
    button_endPhase.disable();
  }
}

// ends current phase
// stateless
async function endPhase(ev) {
  // validate that this turn may be ended by this player

  // immediately disable button to stop reclicking
  FooterButton.getByID('button_endPhase').disable();

  // find out which phase has ended
  const phase = await getPhase();
  // remove dom elements specific to phase
  // if attacking phase then disable next phase button
  switch(phase.slice(8)) {
    case 'phase_shop':
      teardown_phase_shop();
      break;
    case 'phase_arrangement':
      teardown_phase_arrangement();
      break;
    case 'phase_attacking':
      teardown_phase_attacking();
      break;
    default:
      break;
  }

  await nextPhase();
}

// sends request to server to move to next phase
async function nextPhase() {
  const response = await fetch('/api/game/phase/next', {method: 'put'});
  if(response.ok) {
    //console.log("moved to next phase");
  } else {
    console.error("failed to move to next phase");
  }
}

// gets current phase
async function getPhase() {
  const response = await fetch('/api/game/phase');
  if(response.ok) {
    return (await response.json()).phase;
  } else {
    console.error("failed to get phase");
  }
}

// call to the server to start the game
// made when game has two players
async function startGame() {
  const url = '/api/game/start';

  const response = await fetch(url, {method: 'put'});
  if(response.ok) {
    // game has started correctly
    // watch other players move
  } else {
    console.error("failed to start game...");
    // do teardown
  }
}
