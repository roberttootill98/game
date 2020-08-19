// class for button svgs
'use strict';

let buttons = [];

class Button extends SVG {
  /**
   * creates a button
   * @constructor
   * @param {string} id, DOM id of the button, must be unique
   * @param {function} func, function run with onclick event
   * @param {boolean} state, indicating whether or not this button is active
   * @param {string} text, text content of the button
   * @param {float} width, of button
   * @param {float} height, of button
   * @param {float} x, position of button
   * @param {float} y, position of button
   */
  constructor(id, func, state, text, width, height, x, y) {
    super(width, height, x, y);
    this.id = id;
    this.func = func;
    this.state = state;
    this.text = text;

    buttons.push(this);
  }

  /**
   * gets the button with the corresponding id otherwise return null
   * @param {string} id, id of the button in terms of DOM
   * @returns {Button} footer button object
   */
  static getByID(id) {
    for(const button of buttons) {
      if(button.svg.id == id) {
        return button;
      }
    }
  }

  /**
   * destroys button
   */
  destroy() {
    this.svg.remove();
    buttons.splice(buttons.indexOf(this))
    delete this;
  }

  /**
   * draws button
   * @param {element} target, the element that the button is appended to
   */
  draw(target) {
    // container
    const container_button = document.createElementNS(svgns, 'svg');
    this.svg = container_button;
    target.appendChild(container_button);
    container_button.id = this.id;
    container_button.function = this.func;
    // svg attributes
    container_button.setAttribute('width', this.width);
    container_button.setAttribute('height', this.height);
    container_button.setAttribute('x', this.x);
    container_button.setAttribute('y', this.y);

    // background
    const button_background = document.createElementNS(svgns, 'rect');
    this.svg.background = button_background;
    container_button.appendChild(button_background);
    // svg attributes
    button_background.setAttribute('width',
      container_button.getAttribute('width'));
    button_background.setAttribute('height',
      container_button.getAttribute('height'));
    button_background.setAttribute('x', 0);
    button_background.setAttribute('y', 0);
    button_background.setAttribute('fill', 'white');
    button_background.setAttribute('stroke', 'black');

    // text
    const button_text = document.createElementNS(svgns, 'text');
    this.svg.text = button_text;
    container_button.appendChild(button_text);
    button_text.textContent = this.text;
    // svg attributes
    button_text.setAttribute('x', '50%');
    button_text.setAttribute('y', '50%');
    button_text.setAttribute('alignment-baseline', 'middle');
    button_text.setAttribute('text-anchor', 'middle');
    // show disabled effect based on state
    if(this.state) {
      button_text.setAttribute('stroke', 'black');
    } else {
      button_text.setAttribute('stroke', 'grey');
    }

    // enable on click
    if(this.state) {
      // button is enabled
      container_button.onclick = this.func;
      button_background.onclick = this.func;
      button_text.onclick = this.func;
      // styling
      container_button.classList.add('button_enabled');
      button_background.classList.add('button_enabled');
      button_text.classList.add('button_enabled');
    } else {
      // styling
      container_button.classList.add('button_disabled');
      button_background.classList.add('button_disabled');
      button_text.classList.add('button_disabled');
    }
  }

  /**
   * enables button
   */
  enable() {
    this.state = true;
    SVG.add_onclickEvent(this.svg, this.func);
    this.svg.text.setAttribute('stroke', 'black');
  }

  /**
   * disables button
   */
  disable() {
    this.state = false;
    SVG.remove_onclickEvent(this.svg)
    this.svg.text.setAttribute('stroke', 'grey');
  }
}
