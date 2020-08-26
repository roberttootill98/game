// class for modal window made as svgs
'use strict';

class ModalWindow extends SVG {
  static instance;

  constructor(id, width, height) {
    const topLevel = document.getElementById('game_svg_workspace');

    super(width, height, topLevel.getAttribute('width') * 0.5 - width * 0.5,
      topLevel.getAttribute('height') * 0.5 - height * 0.5);
    this.id = id;

    ModalWindow.instance = this;
  }

  /**
   * draws modal window on page
   * drawn at top level in the centre of the game workspace
   */
  draw() {
    // add backdrop

    const topLevel = document.getElementById('game_svg_workspace');

    // container
    const container = document.createElementNS(svgns, 'svg');
    this.svg = container;
    topLevel.appendChild(container);
    container.id = this.id;
    // svg attributes
    container.setAttribute('width', this.width);
    container.setAttribute('height', this.height);
    container.setAttribute('x', this.x);
    container.setAttribute('y', this.y);

    // background
    const background = document.createElementNS(svgns, 'rect');
    container.appendChild(background);
    // svg attributes
    background.setAttribute('width', container.getAttribute('width'));
    background.setAttribute('height', container.getAttribute('height'));
    background.setAttribute('x', 0);
    background.setAttribute('y', 0);
    background.setAttribute('fill', 'blue');
    background.setAttribute('stroke', 'black');
  }

  /**
   * disables all events that aren't related to the modal window
   */
  static disableAllEvents() {

  }
}
