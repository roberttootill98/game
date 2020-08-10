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

    this.svg.icon.onmousemove = card_drag;
    this.svg.icon.onmouseup = arrangement_card_endDrag;
    this.svg.icon.onmouseleave = arrangement_card_endDrag;
  }
}

/** DRAG AND DROP FUNCTIONS **/
let currently_dragged_cardSlot = null;
let currently_dragged_cardSlot_card = null;
let currently_dragged_cardSlot_target = null;
let currently_dragged_cardSlot_oldIndex = null;

// card slots - filled

async function cardSlot_filled_startDrag(ev) {
  // immediately draw full sized card, makes sure that it is at the top level
  // wont disappear behind any elements
  const topLevel = SVG.getTopLevelSVG(ev.target);
  // make new card at top level
  const cardSlot = CardSlot.getByID(topLevel.id);

  // setup data transfer
  // get details before deleting
  currently_dragged_cardSlot_card = cardSlot.card;
  currently_dragged_cardSlot_target = document.querySelectorAll(
    '.container_companion')[parseInt(cardSlot.svg.id - 1) / 4 >> 0];
  currently_dragged_cardSlot_oldIndex = parseInt(cardSlot.svg.id - 1) % 4;

  // draw filled slot as empty slot
  cardSlot.card = null;
  cardSlot.draw_empty(currently_dragged_cardSlot_target,
    currently_dragged_cardSlot_oldIndex);
  // remember card slot
  currently_dragged_cardSlot = cardSlot;

  // create new fully sized card to be dragged
  const cardObj = new Card_Arrangement(currently_dragged_cardSlot_card.name,
    cardAttributes.width, cardAttributes.height,
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

async function arrangement_card_endDrag(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target);
  const game_svg_workspace = document.getElementById('game_svg_workspace');

  // if placed over thing that it can dropped into
  if(currently_dragged_over_cardSlot) {
    // data transfer
    if(currently_dragged_over_cardSlot.card) {
      // we are dropping into a filled slot

      // do swap
      // so instead of just drawning in the new slot
      // also draw contents of new slot in old slot
      currently_dragged_cardSlot.card = currently_dragged_over_cardSlot.card;
      const swapTarget = document.querySelectorAll('.container_companion')[
        parseInt(currently_dragged_cardSlot.svg.id - 1) / 4 >> 0];
      const swapIndex = parseInt(currently_dragged_cardSlot.svg.id - 1) % 4;
      currently_dragged_cardSlot.draw_filled(game_svg_workspace, swapTarget,
        swapIndex);
      currently_dragged_cardSlot.svg.onmousedown = cardSlot_filled_startDrag;

      // draw held card in swap target card slot
      currently_dragged_over_cardSlot.card = currently_dragged_cardSlot_card;
      const target = document.querySelectorAll('.container_companion')[
        parseInt(currently_dragged_over_cardSlot.svg.id - 1) / 4 >> 0];
      const index = parseInt(currently_dragged_over_cardSlot.svg.id - 1) % 4;
      currently_dragged_over_cardSlot.draw_filled(game_svg_workspace, target,
        index);
      currently_dragged_over_cardSlot.svg.onmousedown = cardSlot_filled_startDrag;
    } else {
      // we are dropping into an empty slot
      // draw miniature version of current card in card slot
      const container_companion = currently_dragged_over_cardSlot.svg.parentNode;
      const index = currently_dragged_over_cardSlot.svg.id.slice(-1);
      const cardSlot_attributes = CardSlot.calculateSize(container_companion,
        index);

      currently_dragged_over_cardSlot.card = currently_dragged_cardSlot_card;
      currently_dragged_over_cardSlot.draw_filled(game_svg_workspace,
        container_companion, index);
      currently_dragged_over_cardSlot.svg.onmousedown = cardSlot_filled_startDrag;
    }

    // delete card svg
    currently_dragged_card_svg.remove();
  } else {
    // old card slot filled again
    currently_dragged_cardSlot.card = currently_dragged_cardSlot_card;
    currently_dragged_cardSlot.draw_filled(game_svg_workspace,
      currently_dragged_cardSlot_target, currently_dragged_cardSlot_oldIndex);
    currently_dragged_cardSlot.svg.onmousedown = cardSlot_filled_startDrag;

    // destroy full sized card
    Card.getByID(topLevel.id).destroy();
  }

  // tear down drag event attributes
  // indicate that drag is finished on current svg
  currently_dragged_card_svg = null;
  // finished dragging over current card slot
  currently_dragged_cardSlot = null;
  currently_dragged_over_cardSlot = null;
  currently_dragged_cardSlot_card = null;
  currently_dragged_cardSlot_target = null;
  currently_dragged_cardSlot_oldIndex = null;
}
