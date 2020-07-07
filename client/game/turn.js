// handles turns and phases
// a player completes all three phases before the other player completes their phases
'use strict'

let gameSocket;

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
