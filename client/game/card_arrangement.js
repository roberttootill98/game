// class for arragement cards
'use strict';

class Card_Arrangement extends Card {
  constructor(name, width, height, x, y) {
    super(name, width, height, x, y);
  }

  addListeners() {
    this.svg.classList.add('arrangement_card');

    this.svg.onmousemove = card_drag;
    this.svg.onmouseup = arrangement_card_endDrag;
    this.svg.onmouseleave = arrangement_card_endDrag;
  }
}

/** DRAG AND DROP FUNCTIONS **/

let currently_dragged_cardSlot = null;

// card slots - filled

async function cardSlot_filled_startDrag(ev) {
  // immediately draw full sized card, makes sure that it is at the top level
  // wont disappear behind any elements
  const topLevel = SVG.getTopLevelSVG(ev.target);
  // make new card at top level
  const cardSlot = CardSlot.getByID(topLevel.id);
  // remember which card slot we are using
  currently_dragged_cardSlot = cardSlot;

  // setup data transfer

  // create new fully sized card to be dragged
  const cardObj = new Card_Arrangement(cardSlot.card.name, cardAttributes.width, cardAttributes.height,
    topLevel.getAttribute('x'), topLevel.getAttribute('y'));
  await cardObj.init();
  cardObj.draw(document.getElementById('game_svg_workspace'));
  currently_dragged_card_svg = cardObj.svg;

  // capture initial mouse coords
  old_clientX = ev.clientX;
  old_clientY = ev.clientY;

  old_position_x = topLevel.getAttribute('x');
  old_position_y = topLevel.getAttribute('y');
}

// full sized cards

async function arrangement_card_endDrag(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target);

  // if placed over thing that it can dropped into
  if(currently_dragged_over_cardSlot) {
    // data transfer

    // get details before deleting
    const card = currently_dragged_cardSlot.card;
    const target = document.querySelectorAll('.container_companion')[
      parseInt(currently_dragged_cardSlot.svg.id - 1) / 4 >> 0];
    const oldIndex = parseInt(currently_dragged_cardSlot.svg.id - 1) % 4;
    const cardSize = CardSlot.calculateSize(target, oldIndex);

    // draw filled slot as empty slot
    currently_dragged_cardSlot.card = null;
    currently_dragged_cardSlot.draw_empty(target, oldIndex);

    // draw miniature version of current card in card slot
    const container_companion = currently_dragged_over_cardSlot.svg.parentNode;
    const index = currently_dragged_over_cardSlot.svg.id.slice(-1);

    const cardSlot_attributes = CardSlot.calculateSize(container_companion, index);
    const game_svg_workspace = document.getElementById('game_svg_workspace');

    currently_dragged_over_cardSlot.card = card;
    currently_dragged_over_cardSlot.draw_filled(game_svg_workspace, container_companion, index);
    currently_dragged_over_cardSlot.svg.onmousedown = cardSlot_filled_startDrag;

    // delete card svg
    currently_dragged_card_svg.remove();
  } else {
    // destroy full sized card
    Card.getByID(topLevel.id).destroy();
  }
}
