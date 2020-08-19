// class for modal window used when confirmed a shop replacement
'use strict';

class ModalWindow_shopConfirm extends ModalWindow {
  constructor(width, height) {
    super('modalWindow_shopConfirm', width, height);

    this.draw();
  }

  draw() {
    super.draw();

    // elements specific to this modal window
    // main text
    this.svg.mainText = document.createElementNS(svgns, 'text');
    this.svg.appendChild(this.svg.mainText);
    this.svg.mainText.textContent = 'Are you sure you want to do this?';
    // svg attributes
    this.svg.mainText.setAttribute('x', '50%');
    this.svg.mainText.setAttribute('y', '25%');
    this.svg.mainText.setAttribute('alignment-baseline', 'middle');
    this.svg.mainText.setAttribute('text-anchor', 'middle');
    this.svg.mainText.setAttribute('stroke', 'black');

    // sub text
    this.svg.subText = document.createElementNS(svgns, 'text');
    this.svg.appendChild(this.svg.subText);
    this.svg.subText.textContent = 'Doing this will sell the card in this slot!';
    // svg attributes
    this.svg.subText.setAttribute('x', '50%');
    this.svg.subText.setAttribute('y', '50%');
    this.svg.subText.setAttribute('alignment-baseline', 'middle');
    this.svg.subText.setAttribute('text-anchor', 'middle');
    this.svg.subText.setAttribute('stroke', 'black');

    const buttonWidth = this.width * 0.25;
    const buttonHeight = this.height * 0.25;
    // yes button
    this.svg.yesButton = new Button('shopConfirm_yes',
      ModalWindow_shopConfirm.yes, true, 'Yes', buttonWidth, buttonHeight,
      this.width * 0.25 - buttonWidth * 0.5,
      this.height * 0.75 - buttonHeight * 0.5);
    this.svg.yesButton.draw(this.svg);
    // no button
    this.svg.noButton = new Button('shopConfirm_no', ModalWindow_shopConfirm.no,
      true, 'No', buttonWidth, buttonHeight,
      this.width * 0.75 - buttonWidth * 0.5,
      this.height * 0.75 - buttonHeight * 0.5);
    this.svg.noButton.draw(this.svg);
  }

  // onclick events

  static async yes(ev) {
    if(modalWindow) {
      // dismiss modal window
      modalWindow.destroy();

      // do sale

      // proceed with replacement event
      await Card_Shop.drawCard_inSlot();
    }
  }

  static no(ev) {
    if(modalWindow) {
      // dismiss modal window
      modalWindow.destroy();

      // snapback card to shop
      Card_Shop.snapback(currently_dragged_card.svg);

      // tear down drag event attributes
      // indicate that drag is finished on current svg
      currently_dragged_card = null;
      // finished dragging over current card Slot
      currently_dragged_over_cardSlot = null;
      // DOM
      CardSlot.removeHighlighting();
    }
  }

}
