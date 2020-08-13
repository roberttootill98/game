// functions handling the arragement phase
'use strict'

async function start_phase_arrangement() {
  // add listeners to card slots
  // all card slots that belong to the player
  const cardSlots = document.querySelectorAll('.cardSlot_player');

  for(let cardSlot of cardSlots) {
    cardSlot = CardSlot.getByID(cardSlot.id);
    // remove listeners
    await cardSlot.addListeners();
  }
}

function teardown_phase_arrangement() {
  // remove listeners from card slots
  // all card slots that belong to the player
  const cardSlots = document.querySelectorAll('.cardSlot_player');

  for(let cardSlot of cardSlots) {
    cardSlot = CardSlot.getByID(cardSlot.id);
    // remove listeners
    cardSlot.removeListeners();
  }
}
