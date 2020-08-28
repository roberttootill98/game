// class for arragement cards
'use strict';

class Card_Arrangement extends Card {
  constructor(name, width, height, x, y) {
    super(name, width, height, x, y);
  }

  addListeners() {
    this.svg.classList.add('arrangement_card');

    this.svg.onmousemove = Card.drag;
    this.svg.onmouseup = Card_Arrangement.endDrag;
    this.svg.onmouseleave = Card_Arrangement.endDrag;

    super.addListeners();
  }

  /** DRAG AND DROP FUNCTIONS **/

  static async endDrag(ev) {
    const topLevel = SVG.getTopLevelSVG(ev.target);
    const game_svg_workspace = document.getElementById('game_svg_workspace');

    // if placed over thing that it can dropped into
    if(CardSlot.dragged_over_cardSlot) {
      // data transfer
      if(CardSlot.dragged_over_cardSlot.card) {
        // we are dropping into a filled slot

        // do swap
        // so instead of just drawning in the new slot
        // also draw contents of new slot in old slot
        const swapIndex = Card.dragged_cardSlot.index;
        Card.dragged_cardSlot.companion.setCard(
          CardSlot.dragged_over_cardSlot.card, swapIndex);
        Card.dragged_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;

        // draw held card in swap target card slot
        CardSlot.dragged_over_cardSlot.companion.setCard(
          Card.dragged_cardSlot_card,
          CardSlot.dragged_over_cardSlot.index);
        CardSlot.dragged_over_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;
      } else {
        // we are dropping into an empty slot
        // draw miniature version of current card in card slot
        CardSlot.dragged_over_cardSlot.companion.setCard(
          Card.dragged_cardSlot_card,
          CardSlot.dragged_over_cardSlot.index);
        // add arrangement listener back in
        CardSlot.dragged_over_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;
      }
    } else {
      // old card slot filled again
      Card.dragged_cardSlot.companion.setCard(
        Card.dragged_cardSlot_card, Card.dragged_cardSlot_oldIndex);
      // add arrangement listener back in
      Card.dragged_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;
    }

    // tear down drag event attributes
    // delete draggable card card
    Card.dragged_card.destroy();
    // indicate that drag is finished on current svg
    Card.dragged_card = undefined;
    // finished dragging over current card slot
    Card.dragged_cardSlot = undefined;
    CardSlot.dragged_over_cardSlot = undefined;
    Card.dragged_cardSlot_oldIndex = undefined;
  }
}
