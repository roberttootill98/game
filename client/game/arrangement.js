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
    cardSlot_filled.addEventListener('mousemove', cardSlot_filled_drag);
    cardSlot_filled.addEventListener('mouseup', cardSlot_filled_endDrag);
    cardSlot_filled.addEventListener('mouseleave', cardSlot_filled_endDrag);
  }

  // empty slots
}

function teardown_phase_arrangement() {
  console.log("tearing down arrangement phase");
}

function cardSlot_filled_startDrag(ev) {
  console.log("starting card slot drag");

  // immediately draw full sized card, makes sure that it is at the top level
  // wont disappear behind any elements
  const topLevel = getTopLevelSVG(ev.target);
  // make new card at top level
  const cardSlot = CardSlot.getByID(topLevel.id);
  // indicate that this is the svg being dragged
  currently_dragged_card_svg = buildCardSVG_full(cardSlot.card,
    document.getElementById('game_svg_workspace'),
    cardAttributes.width, cardAttributes.height,
    topLevel.getAttribute('x'), topLevel.getAttribute('y'));
  // copy made, delete old svg
  topLevel.remove();
}

/** DRAG AND DROP FUNCTIONS **/
// card slots

function cardSlot_filled_drag(ev) {
  const topLevel = getTopLevelSVG(ev.target);
}

function cardSlot_filled_endDrag(ev) {
  const topLevel = getTopLevelSVG(ev.target);
}

// full sized cards
function arrangement_card_startDrag(ev) {

}

function arrangement_card_drag(ev) {

}

function arrangement_card_endDrag(ev) {

}

function arrangement_card_endDrag(ev) {

}
