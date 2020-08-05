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
    const svg = currently_dragged_cardSlot.svg;
    let target = parseInt(svg.id) / 4 >> 0;
    target = document.querySelectorAll('.container_companion')[target];
    const oldIndex = parseInt(svg.id) % 4 - 1;
    const cardSize = CardSlot.calculateSize(target, oldIndex);

    // remove card from previous card slot
    currently_dragged_cardSlot.destroy();
    // draw an empty slot in its place
    const empty_cardSlot = new CardSlot(card, cardSize.width, cardSize.height,
      cardSize.x, cardSize.y);
    empty_cardSlot.draw_empty(target, oldIndex);

    // draw miniature version of current card in card slot
    // get card name as unique identifier of card type
    const card_name = currently_dragged_card_svg.querySelector('.card_name').textContent;
    const cardDetails = await Card.getCardDetails(card_name);

    const container_companion = currently_dragged_over_cardSlot.svg.parentNode;
    const index = currently_dragged_over_cardSlot.svg.id.slice(-1);

    const cardSlot_attributes = CardSlot.calculateSize(container_companion, index);
    const game_svg_workspace = document.getElementById('game_svg_workspace');

    currently_dragged_over_cardSlot.cardDetails = cardDetails;
    currently_dragged_over_cardSlot.draw_filled(game_svg_workspace, container_companion, index);

    // delete card svg
    currently_dragged_card_svg.remove();

    // redraw cards remaining cards so they remain at the top level
  } else {
    // destroy full sized card
    Card.getByID(topLevel.id).destroy();
  }
}
