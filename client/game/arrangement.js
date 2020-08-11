// functions handling the arragement phase
'use strict'

function start_phase_arrangement() {
  // add listeners to card slots

  // filled slots that belong to the player
  // const cardSlots_filled = document.querySelectorAll('.cardSlot_player.cardSlot_filled');
  // allow miniature cards to be dragged to other card slots
  // allow miniature cards to be destroyed
  // for(const cardSlot_filled of cardSlots_filled) {
    // add event listeners
    // cardSlot_filled.onmousedown = CardSlot.filled_startDrag;
  // }

  // all card slots that belong to the player
  const cardSlots = document.querySelectorAll('.cardSlot_player');

  for(let cardSlot of cardSlots) {
    cardSlot = CardSlot.getByID(cardSlot.id);
    // remove listeners
    cardSlot.addListeners();
  }
}

function teardown_phase_arrangement() {
  console.log("tearing down arrangement phase");

  // all card slots that belong to the player
  const cardSlots = document.querySelectorAll('.cardSlot_player');

  for(let cardSlot of cardSlots) {
    cardSlot = CardSlot.getByID(cardSlot.id);
    // remove listeners
    cardSlot.removeListeners();
  }
}
