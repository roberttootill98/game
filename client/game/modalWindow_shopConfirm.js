// class for modal window used when confirmed a shop replacement
'use strict';

class ModalWindow_shopConfirm extends ModalWindow {
  constructor(width, height) {
    super('modalWindow_shopConfirm', width, height);
  }

  draw() {
    super.draw();

    // elements specific to this modal window
    // main text
    const mainText = document.createElementNS(svgns, 'text');
    this.svg.mainText = mainText;
    this.svg.appendChild(mainText);
    mainText.textContent = 'Are you sure you want to do this?';
    // svg attributes
    mainText.setAttribute('x', '50%');
    mainText.setAttribute('y', '25%');
    mainText.setAttribute('alignment-baseline', 'middle');
    mainText.setAttribute('text-anchor', 'middle');
    mainText.setAttribute('stroke', 'black');

    // sub text
    const subText = document.createElementNS(svgns, 'text');
    this.svg.subText = subText;
    this.svg.appendChild(subText);
    subText.textContent = 'Doing this will sell the card in this slot!';
    // svg attributes
    subText.setAttribute('x', '50%');
    subText.setAttribute('y', '50%');
    subText.setAttribute('alignment-baseline', 'middle');
    subText.setAttribute('text-anchor', 'middle');
    subText.setAttribute('stroke', 'black');

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
      Card_Shop.snapback(currently_dragged_card_svg);

      // tear down drag event attributes
      // indicate that drag is finished on current svg
      currently_dragged_card_svg = null;
      // finished dragging over current card Slot
      currently_dragged_over_cardSlot = null;
      // DOM
      CardSlot.removeHighlighting();
    }
  }

}
