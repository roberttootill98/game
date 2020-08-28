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

  destroy() {
    // acquire instances properly
    this.instances = Card.instances;
    super.destroy();
  }

  /** DRAG AND DROP FUNCTIONS **/

  static async startDrag(ev) {
    // immediately redraw card at the top level
    // wont disappear behind any elements
    const topLevel = SVG.getTopLevelSVG(ev.target);
    // make new card at top level
    const coords = SVG.getAbsoluteCoords(topLevel);
    const card = await Card.getCardDetails(
      topLevel.querySelector('text').textContent.replace(" ", "_"));
    // indicate that this is the svg being dragged
    const cardObj = new Card_Shop(card, cardAttributes.width,
      cardAttributes.height, coords.x, coords.y);
    cardObj.draw(document.getElementById('game_svg_workspace'));
    Card.dragged_card = cardObj;
    // copy made, delete old cardObj
    Card.getByID(topLevel.id).destroy();

    // capture initial mouse coords
    SVG.old_clientX = ev.clientX;
    SVG.old_clientY = ev.clientY;

    SVG.old_positionX = topLevel.getAttribute('x');
    SVG.old_positionY = topLevel.getAttribute('y');
  }

  static async endDrag(ev) {
    if(Card.dragged_card) {
      const topLevel = SVG.getTopLevelSVG(ev.target);

      // if placed over thing that it can dropped into
      if(CardSlot.dragged_over_cardSlot) {
        // data transfer
        if(CardSlot.dragged_over_cardSlot.card) {
          // there is a card in the card slot they are dragging into
          if(!ModalWindow.instance) {
            // halt current drag event

            // prompt modal window
            const confirm_window = new ModalWindow_shopConfirm(500, 500);
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
      Card.dragged_card = undefined;
      // finished dragging over current card Slot
      CardSlot.dragged_over_cardSlot = undefined;
      // DOM
      CardSlot.removeHighlighting();
    }
  }

  static async drawCard_inSlot() {
    // draw miniature version of current card in card slot
    const card = await Card.getCardDetails(Card.dragged_card.card.name);

    const companion = CardSlot.dragged_over_cardSlot.companion;
    const index = CardSlot.dragged_over_cardSlot.index;

    companion.setCard(card, index);

    // delete card svg
    Card.dragged_card.destroy();
  }

  static snapback(card_svg) {
    // put back in shop
    document.getElementById('container_shop').appendChild(card_svg);
    card_svg.setAttribute('x', SVG.old_positionX);
    card_svg.setAttribute('y', SVG.old_positionY);
  }
}
