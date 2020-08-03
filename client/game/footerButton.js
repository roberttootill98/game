// functions todo with footer buttons on the gameboard
// defines button as a class
'use strict'

const footerButtons = [];

class FooterButton {
  /**
   * creates a new button
   * @constructor
   */
  constructor(id, func, state, width, height, text) {
    this.id = id;
    this.func = func;
    this.state = state;
    this.width = width;
    this.height = height;
    this.text = text;

    footerButtons.push(this);
  }

  /**
   * gets the button with the corresponding id otherwise return null
   * @param {string} id, id of the button in terms of DOM
   * @returns {FooterButton} footer button object
   */
  static getByID(id) {
    for(const footerButton of footerButtons) {
      if(footerButton.svg.id == id) {
        return footerButton;
      }
    }
  }

  draw() {
    // get target
    const container_footer = document.getElementById('container_footer');

    // base x offset on the number of buttons currently in footer
    const x_offset = container_footer.querySelectorAll('svg').length;

    // add open shop button to footer
    const container_button = document.createElementNS(svgns, 'svg');
    this.svg = container_button;
    container_footer.appendChild(container_button);
    container_button.id = this.id;
    container_button.function = this.func;
    // svg attributes
    container_button.setAttribute('width', this.width * 0.2);
    container_button.setAttribute('height', this.height * 0.75);
    container_button.setAttribute('x', this.width * 0.05 * (x_offset + 1) + container_button.getAttribute('width') * x_offset);
    container_button.setAttribute('y', this.height * 0.125);

    // background
    const button_background = document.createElementNS(svgns, 'rect');
    this.svg.background = button_background;
    container_button.appendChild(button_background);
    // svg attributes
    button_background.setAttribute('width', container_button.getAttribute('width'));
    button_background.setAttribute('height', container_button.getAttribute('height'));
    button_background.setAttribute('x', 0);
    button_background.setAttribute('y', 0);
    button_background.setAttribute('fill', 'white');
    button_background.setAttribute('stroke', 'black');

    // text
    const button_text = document.createElementNS(svgns, 'text');
    this.svg.text = button_text;
    container_button.appendChild(button_text);

    // show disabled effect based on state
    if(this.state) {
      button_text.setAttribute('stroke', 'black');
    } else {
      button_text.setAttribute('stroke', 'grey');
    }

    button_text.textContent = this.text;
    // svg attributes
    button_text.setAttribute('x', container_button.getAttribute('width') * 0.5 - button_text.getComputedTextLength() / 2);
    button_text.setAttribute('y', container_button.getAttribute('height') * 0.5);

    // enable on click
    if(this.state) {
      // button is enabled
      container_button.onclick = func;
      button_background.onclick = func;
      button_text.onclick = func;
      // styling
      container_button.classList.add('button_enabled');
      button_background.classList.add('button_enabled');
      button_text.classList.add('button_enabled');
    } else {
      container_button.classList.add('button_disabled');
      button_background.classList.add('button_disabled');
      button_text.classList.add('button_disabled');
    }
  }

  enable() {
    this.state = true;
    svg_add_onclickEvent(this.svg, this.func);
    this.svg.text.setAttribute('stroke', 'black');
  }

  disable() {
    this.state = false;
    svg_remove_onclickEvent(this.svg, this.func)
    this.svg.text.setAttribute('stroke', 'grey');
  }
}
