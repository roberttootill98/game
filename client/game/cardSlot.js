// functions todo with the card slots within the gameboard
// defines card slot as an object that has functions associated with it
'use strict'

const cardSlots = [];

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

    // event listeners
    cardSlot.onmouseover = cardSlot_mouseover;
    cardSlot.onmouseleave = cardSlot_mouseleave;
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

    // event listeners
  }
}

// keeps track of the card card slot moused over
let current_cardSlot_mouseover;

// fires when a card is dragged from the shop over a card slot
// highlight if drop location is valid
async function cardSlot_mouseover(ev) {
  if(currently_dragged_card_svg) {
    ev.preventDefault();
    ev.target.classList.add('card_mouseover');
    current_cardSlot_mouseover = ev.target;
  }
}

// fires when a card is dragged away from the shop over a card slot
// highlight if drop location is valid
async function cardSlot_mouseleave(ev) {
  if(currently_dragged_card_svg) {
    ev.preventDefault();
    ev.target.classList.remove('card_mouseover');
    current_cardSlot_mouseover = null;
  }
}

async function cardSlot_drop(ev) {
  ev.preventDefault();

  // get info
  const cardSlot = ev.target;
  const cardName = ev.dataTransfer.getData('text/plain');

  // check if purchase is valid
  // validate move via server

  // check if card slot is full
  // prompt are you window

  // reduce money

  // remove card from shop
  document.getElementById(cardName).parentNode.remove();
  // fill card slot with card
  const card = await getCard(cardName);
  cardSlot.id = card.name;
  cardSlot.src = card.icon;
}
