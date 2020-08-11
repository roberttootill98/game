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
    return {
      'width': container_companion.getAttribute('width') * 0.35,
      'height': container_companion.getAttribute('height') * 0.8 * 0.25,
      'x': container_companion.getAttribute('width') * 0.65,
      'y': container_companion.getAttribute('height') * 0.2 +
        container_companion.getAttribute('height') * 0.8 * 0.25 * index
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

    const cardSlot = document.createElementNS(svgns, 'svg');
    this.svg = cardSlot;
    target.appendChild(cardSlot);
    cardSlot.id = CardSlot.getNextID();
    cardSlot.classList.add('cardSlot' + index);
    cardSlot.classList.add('cardSlot_empty');
    cardSlot.classList.add('cardSlot_' + this.owner);
    // svg attributes
    cardSlot.setAttribute('width', this.width);
    cardSlot.setAttribute('height', this.height);
    cardSlot.setAttribute('x', this.x);
    cardSlot.setAttribute('y', this.y);

    // background
    const cardSlot_background = document.createElementNS(svgns, 'rect');
    this.svg.background = cardSlot_background;
    cardSlot.appendChild(cardSlot_background);
    // svg attributes
    cardSlot_background.setAttribute('width', cardSlot.getAttribute('width'));
    cardSlot_background.setAttribute('height', cardSlot.getAttribute('height'));
    cardSlot_background.setAttribute('fill', 'pink');
    cardSlot_background.setAttribute('stroke', 'black');
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

    const card_svg = document.createElementNS(svgns, 'svg');
    this.svg = card_svg;
    topLevel.appendChild(card_svg);
    card_svg.id = CardSlot.getNextID();
    card_svg.classList.add('cardSlot' + index);
    card_svg.classList.add('cardSlot_filled');
    card_svg.classList.add('cardSlot_' + this.owner);
    // svg attributes
    card_svg.setAttribute('width', this.width);
    card_svg.setAttribute('height', this.height);
    card_svg.setAttribute('x', this.x + container_position.x);
    card_svg.setAttribute('y', this.y + container_position.y);

    // background
    const card_background = document.createElementNS(svgns, 'rect');
    this.svg.background = card_background;
    card_svg.appendChild(card_background);
    // svg attributes
    card_background.setAttribute('width', this.width);
    card_background.setAttribute('height', this.height);
    card_background.setAttribute('x', 0);
    card_background.setAttribute('y', 0);
    card_background.setAttribute('fill', 'purple');
    card_background.setAttribute('stroke', 'black');

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
