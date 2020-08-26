// functions todo with footer buttons on the gameboard
// defines button as a class
'use strict'

class FooterButton extends Button {
  static instances = [];

  /**
   * creates a footer button
   * @constructor
   * @param {string} id, DOM id of the button, must be unique
   * @param {function} func, function run with onclick event
   * @param {boolean} state, indicating whether or not this button is active
   * @param {string} text, text content of the button
   */
  constructor(id, func, state, text) {
    // calculate attributes
    // get target
    const container_footer = document.getElementById('container_footer');
    const width = container_footer.getAttribute('width');
    const height = container_footer.getAttribute('height');
    // base x offset on the number of buttons currently in footer
    // -1 for phase label
    const x_offset = container_footer.querySelectorAll('svg').length;

    const calculatedWidth =  width * 0.2;

    // construct
    super(id, func, state, text, calculatedWidth, height * 0.75,
      width * 0.01 * (x_offset + 1) + calculatedWidth * x_offset,
      height * 0.125);

    this.draw();

    FooterButton.instances.push(this);
  }

  /**
   * draws button
   */
  draw() {
    super.draw(document.getElementById('container_footer'));
  }
}
