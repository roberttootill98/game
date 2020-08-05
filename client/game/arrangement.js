// functions handling the arragement phase
'use strict'

function start_phase_arrangement() {
  // add listeners to card slots

  // filled slots
  const cardSlots_filled = document.querySelectorAll('.cardSlot_filled');
  // allow miniature cards to be dragged to other card slots
  // allow miniature cards to be destroyed
  for(const cardSlot_filled of cardSlots_filled) {
    // add event listeners
    cardSlot_filled.addEventListener('mousedown', cardSlot_filled_startDrag);
  }

  // empty slots
}

function teardown_phase_arrangement() {
  console.log("tearing down arrangement phase");
}
