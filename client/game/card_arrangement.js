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
  }

  /** DRAG AND DROP FUNCTIONS **/

  static async endDrag(ev) {
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
        currently_dragged_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;

        // draw held card in swap target card slot
        currently_dragged_over_cardSlot.card = currently_dragged_cardSlot_card;
        const target = document.querySelectorAll('.container_companion')[
          parseInt(currently_dragged_over_cardSlot.svg.id - 1) / 4 >> 0];
        const index = parseInt(currently_dragged_over_cardSlot.svg.id - 1) % 4;
        currently_dragged_over_cardSlot.draw_filled(game_svg_workspace, target,
          index);
        currently_dragged_over_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;
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
        currently_dragged_over_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;
      }

      // delete card svg
      currently_dragged_card_svg.remove();
    } else {
      // old card slot filled again
      currently_dragged_cardSlot.card = currently_dragged_cardSlot_card;
      currently_dragged_cardSlot.draw_filled(game_svg_workspace,
        currently_dragged_cardSlot_target, currently_dragged_cardSlot_oldIndex);
      currently_dragged_cardSlot.svg.onmousedown = CardSlot.filled_startDrag;

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
}
