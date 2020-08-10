// class for shop cards
'use strict';

class Card_Shop extends Card {
  constructor(name, width, height, x, y) {
    super(name, width, height, x, y);
  }

  addListeners() {
    this.svg.classList.add('shop_card');

    this.svg.onmousedown = shop_card_startDrag;
    this.svg.onmousemove = card_drag;
    this.svg.onmouseup = shop_card_endDrag;
    this.svg.onmouseleave = shop_card_endDrag;
  }
}


/** DRAG AND DROP FUNCTIONS **/

async function shop_card_startDrag(ev) {
  // immediately redraw card to make sure that it is at the top level
  // wont disappear behind any elements
  const topLevel = SVG.getTopLevelSVG(ev.target);
  // make new card at top level
  const card = await Card.getCardDetails(topLevel.querySelector('text').textContent);
  // indicate that this is the svg being dragged
  const cardObj = new Card_Shop(card.name, cardAttributes.width, cardAttributes.height,
    topLevel.getAttribute('x'), topLevel.getAttribute('y'));
  await cardObj.init();
  cardObj.draw(document.getElementById('game_svg_workspace'));
  currently_dragged_card_svg = cardObj.svg;
  // copy made, delete old cardObj
  Card.getByID(topLevel.id).destroy();

  // capture initial mouse coords
  old_clientX = ev.clientX;
  old_clientY = ev.clientY;

  old_position_x = topLevel.getAttribute('x');
  old_position_y = topLevel.getAttribute('y');
}

async function shop_card_endDrag(ev) {
  if(currently_dragged_card_svg) {
    const topLevel = SVG.getTopLevelSVG(ev.target);

    // if placed over thing that it can dropped into
    if(currently_dragged_over_cardSlot) {
      // data transfer
      if(currently_dragged_over_cardSlot.card) {
        // there is a card in the card slot they are dragging into
        // prompt model window
      } else {
        // draw miniature version of current card in card slot
        // get card name as unique identifier of card type
        const card_name = currently_dragged_card_svg.querySelector('.card_name').textContent;
        const card = await Card.getCardDetails(card_name);

        const container_companion = currently_dragged_over_cardSlot.svg.parentNode;
        const index = currently_dragged_over_cardSlot.svg.id.slice(-1);

        const cardSlot_attributes = CardSlot.calculateSize(container_companion, index);
        const game_svg_workspace = document.getElementById('game_svg_workspace');

        currently_dragged_over_cardSlot.card = card;
        currently_dragged_over_cardSlot.draw_filled(game_svg_workspace, container_companion, index);

        // delete card svg
        currently_dragged_card_svg.remove();
      }
    } else {
      // snapback
      topLevel.setAttribute('x', old_position_x);
      topLevel.setAttribute('y', old_position_y);
    }

    // tear down drag event attributes
    // indicate that drag is finished on current svg
    currently_dragged_card_svg = null;
    // finished dragging over current card Slot
    currently_dragged_over_cardSlot = null;
    // DOM
    CardSlot.removeHighlighting();
  }
}
