// functions todo with the card slots within the gameboard
// defines card slot as an object that has functions associated with it
'use strict'

const cardSlots = [];

/** DRAG AND DROP FUNCTIONS **/
let currently_dragged_over_cardSlot = null;
let currently_dragged_cardSlot = null;
let currently_dragged_cardSlot_card = null;
let currently_dragged_cardSlot_target = null;
let currently_dragged_cardSlot_oldIndex = null;

class CardSlot extends SVG {
  /**
   * creates new card slot
   * @constructor
   * @param {JSON} card, as a card json or null
   * @param {string} owner, player or opponent
   * @param {float} width, width of svg
   * @param {float} hieght, hieght of svg
   * @param {float} x, x position of svg
   * @param {float} y, y position of svg
   */
  constructor(card, owner, width, height, x, y) {
    super(width, height, x, y);
    this.card = card;
    this.owner = owner;

    cardSlots.push(this);
  }

  destroy() {
    this.svg.remove();
    cardSlots.splice(cardSlots.indexOf(this), 1);
    delete this;
  }

  /**
   * gets a card based on the id
   */
  static getByID(id) {
    for(const cardSlot of cardSlots) {
      if(cardSlot.svg.id == id) {
        return cardSlot;
      }
    }
  }

  /**
   * gets the first unused ID, lowest numeric value that is unused
   * @returns {integer} the unused ID
   */
  static getNextID() {
    let id = 0;

    // while id in use
    while(checkIfInUse(id, cardSlots)) {
      id++;
    }
    return id;
  }

  /**
   * calculates the attributes of card slot before it is drawn
   * @param {svg node} container_companion, the node which the card svg is placed within
   * @param {integer} index, indicates which number card slot is being drawn
   * @returns {JSON} of attributes
   */
  static calculateSize(container_companion, index) {
    const container_icon = container_companion.querySelector('.container_icon');
    // attributes
    const companion_width = parseFloat(container_companion.getAttribute('width'));
    const icon_width = parseFloat(container_icon.getAttribute('width'));
    const icon_height = parseFloat(container_icon.getAttribute('height'));
    const icon_y = parseFloat(container_icon.getAttribute('y'));

    return {
      'width': companion_width - icon_width,
      'height': icon_height / 4,
      'x': icon_width,
      'y': icon_y + icon_height / 4 * index
    }
  }

  /**
   * checks if given (x, y) position is within any of the card slots
   */
  static inRange(coords) {
    // coords.x, coords.y
    // coords are absolute
    for(const [i, cardSlot] of cardSlots.entries()) {
      if(cardSlot.svg.classList.contains('cardSlot_player')) {
        // get absolute cardSlot coords
        const cardSlot_coords = SVG.getAbsoluteCoords(cardSlot.svg);
        const width = parseFloat(cardSlot.svg.getAttribute('width'));
        const height = parseFloat(cardSlot.svg.getAttribute('height'));

        if((coords.x >= cardSlot_coords.x) &&
          (coords.x <= (cardSlot_coords.x + width)) &&
          (coords.y >= cardSlot_coords.y) &&
          (coords.y <= (cardSlot_coords.y + height))) {
            return cardSlot;
        }
      }
    }
  }

  /**
   * strip all card slots of highlighting
   */
  static removeHighlighting() {
    for(const cardSlot of document.querySelectorAll('.cardSlot_highlighted')) {
      cardSlot.classList.remove('cardSlot_highlighted');
      cardSlot.querySelector('rect').setAttribute('stroke', 'black');
    }
  }


  /**
   * draws the svg of the card slot
   * associates svg with object
   * @param {svg node} target, for appending the card slot to, should be a container_companion
   * @param {integer} index, indicates which number card slot is being drawn
   */
  draw_empty(target, index) {
    // get rid of current svg
    if(this.svg) {
      this.svg.remove();
    }

    this.svg = document.createElementNS(svgns, 'svg');
    target.appendChild(this.svg);
    this.svg.id = CardSlot.getNextID();
    this.svg.classList.add('cardSlot' + index);
    this.svg.classList.add('cardSlot_empty');
    this.svg.classList.add('cardSlot_' + this.owner);
    // svg attributes
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('x', this.x);
    this.svg.setAttribute('y', this.y);

    // background
    this.svg.background = document.createElementNS(svgns, 'rect');
    this.svg.appendChild(this.svg.background);
    // svg attributes
    this.svg.background.setAttribute('width', this.svg.getAttribute('width'));
    this.svg.background.setAttribute('height', this.svg.getAttribute('height'));
    this.svg.background.setAttribute('fill', 'pink');
    this.svg.background.setAttribute('stroke', 'black');
  }

  /**
   * draws the svg of a card in miniature form in the card slot
   * drawn at top level in workspace for drag and drop events
   * @param {svg node} topLevel, top level workspace element
   * @param {svg node} target, gets position of svg, should be a container_companion
   * @param {integer} index, indicates which number card slot is being drawn
   */
  draw_filled(topLevel, target, index) {
    // get rid of current svg
    if(this.svg) {
      this.svg.remove();
    }

    const container_position = SVG.getAbsoluteCoords(target);

    this.svg = document.createElementNS(svgns, 'svg');
    topLevel.appendChild(this.svg);
    this.svg.id = CardSlot.getNextID();
    this.svg.classList.add('cardSlot' + index);
    this.svg.classList.add('cardSlot_filled');
    this.svg.classList.add('cardSlot_' + this.owner);
    // svg attributes
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('x', this.x + container_position.x);
    this.svg.setAttribute('y', this.y + container_position.y);

    // background
    this.svg.background = document.createElementNS(svgns, 'rect');
    this.svg.appendChild(this.svg.background);
    // svg attributes
    this.svg.background.setAttribute('width', this.width);
    this.svg.background.setAttribute('height', this.height);
    this.svg.background.setAttribute('x', 0);
    this.svg.background.setAttribute('y', 0);
    this.svg.background.setAttribute('fill', element_colours[this.card.element]);
    this.svg.background.setAttribute('stroke', 'black');

    // make icon using lookup table functions
  }

  /** DRAG AND DROP FUNCTIONS **/
  addListeners() {
    // events
    this.svg.onmouseover = CardSlot.mouseover;
    this.svg.onmouseleave = CardSlot.mouseleave;

    if(this.card) {
      this.svg.onmousedown = CardSlot.filled_startDrag;
      // DOM
      // add draggable class to all elements of svg
      SVG.addClass(this.svg, 'draggable');
    }
  }

  removeListeners() {
    this.svg.onmousedown = null;
    this.svg.onmouseover = null;
    this.svg.onmouseleave = null;

    // DOM
    // remove draggable class from all elements of svg
    SVG.removeClass(this.svg, 'draggable');
  }

  static async filled_startDrag(ev) {
    // immediately draw full sized card, makes sure that it is at the top level
    // wont disappear behind any elements
    const topLevel = SVG.getTopLevelSVG(ev.target);
    // make new card at top level
    const cardSlot = CardSlot.getByID(topLevel.id);

    // setup data transfer
    // get details before deleting
    currently_dragged_cardSlot_card = cardSlot.card;
    currently_dragged_cardSlot_target = document.querySelectorAll(
      '.container_companion')[parseInt(cardSlot.svg.id - 1) / 4 >> 0];
    currently_dragged_cardSlot_oldIndex = parseInt(cardSlot.svg.id - 1) % 4;

    // draw filled slot as empty slot
    cardSlot.card = null;
    cardSlot.draw_empty(currently_dragged_cardSlot_target,
      currently_dragged_cardSlot_oldIndex);
    // remember card slot
    currently_dragged_cardSlot = cardSlot;

    // create new fully sized card to be dragged
    const cardObj = new Card_Arrangement(currently_dragged_cardSlot_card.name,
      cardAttributes.width, cardAttributes.height,
      topLevel.getAttribute('x'), topLevel.getAttribute('y'));
    await cardObj.init();
    cardObj.draw(document.getElementById('game_svg_workspace'));
    currently_dragged_card_svg = cardObj.svg;

    // capture initial mouse coords
    old_clientX = ev.clientX;
    old_clientY = ev.clientY;

    old_position_x = topLevel.getAttribute('x');
    old_position_y = topLevel.getAttribute('y');
  }
}
