// class for shop cards
'use strict';

class Card_Shop extends Card {
  constructor(name, width, height, x, y) {
    super(name, width, height, x, y);
  }

  addListeners() {
    this.svg.classList.add('shop_card');

    this.svg.onmousedown = Card_Shop.startDrag;
    this.svg.onmousemove = Card.drag;
    this.svg.onmouseup = Card_Shop.endDrag;
    this.svg.onmouseleave = Card_Shop.endDrag;

    super.addListeners();
  }

  /** DRAG AND DROP FUNCTIONS **/

  static async startDrag(ev) {
    // immediately redraw card at the top level
    // wont disappear behind any elements
    const topLevel = SVG.getTopLevelSVG(ev.target);
    // make new card at top level
    const coords = SVG.getAbsoluteCoords(topLevel);
    const card = await Card.getCardDetails(topLevel.querySelector('text').textContent);
    // indicate that this is the svg being dragged
    const cardObj = new Card_Shop(card.name, cardAttributes.width,
      cardAttributes.height, coords.x, coords.y);
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

  static async endDrag(ev) {
    if(currently_dragged_card_svg) {
      const topLevel = SVG.getTopLevelSVG(ev.target);

      // if placed over thing that it can dropped into
      if(currently_dragged_over_cardSlot) {
        // data transfer
        if(currently_dragged_over_cardSlot.card) {
          // there is a card in the card slot they are dragging into
          if(!modalWindow) {
            // halt current drag event

            // prompt modal window
            const confirm_window = new ModalWindow_shopConfirm(500, 500);
            confirm_window.draw();
          }

          // to avoid code at end of func
          return;
        } else {
          await Card_Shop.drawCard_inSlot();
        }
      } else {
        Card_Shop.snapback(topLevel);
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

  static async drawCard_inSlot() {
    // draw miniature version of current card in card slot
    // get card name as unique identifier of card type
    const card_name = currently_dragged_card_svg.querySelector('.card_name').textContent;
    const card = await Card.getCardDetails(card_name);

    const companion = currently_dragged_over_cardSlot.companion;
    const index = currently_dragged_over_cardSlot.index;

    companion.setCard(card, index);

    // delete card svg
    currently_dragged_card_svg.remove();
  }

  static snapback(card) {
    // put back in shop
    document.getElementById('container_shop').appendChild(card);
    card.setAttribute('x', old_position_x);
    card.setAttribute('y', old_position_y);
  }
}
