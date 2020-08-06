// functions to do with cards
'use strict'

// GLOBAL CONSTANTS
const cardAttributes = {
  'width': 100,
  'height': 200,
  'seperation': {
    'horizontal': 25,
    'vertical': 25
  }
}

const element_colours = {
  'air': '#823451',
  'water': '#123456',
  'earth': '#154328',
  'fire': '#654321'
};

const cardsInPlay = [];

class Card extends SVG {
  constructor(name, width, height, x, y) {
    super(width, height, x, y);
    this.name = name;

    cardsInPlay.push(this);
  }

  async init() {
    // get rest of card details from server
    const cardDetails = await Card.getCardDetails(this.name);
    this.element = cardDetails.element;
    this.damage = cardDetails.damage;
    this.mana = cardDetails.mana;
  }

  destroy() {
    this.svg.remove();
    cardsInPlay.splice(cardsInPlay.indexOf(this), 1);
    delete this;
  }

  static getByID(id) {
    for(const card of cardsInPlay) {
      if(card.svg.id == id) {
        return card;
      }
    }
  }

  // gets card details using name
  static async getCardDetails(name) {
    const response = await fetch(`/api/card?name=${name}`);
    if(response.ok) {
      return await response.json();
    } else {
      console.error("card not found");
    }
  }

  /**
   * gets the first unused ID, lowest numeric value that is unused
   * @returns {integer} the unused ID
   */
  static getNextID() {
    let id = 0;

    // while id in use
    while(checkIfInUse(id, cardsInPlay)) {
      id++;
    }
    return id;
  }

  /**
   * draws the card
   * @param {element} target, where the svg is appended to, should be top level
   * @param {string} location, the context for the use of the card
   */
  draw(target, location) {
    // container
    const card_svg = document.createElementNS(svgns, 'svg');
    this.svg = card_svg;
    target.appendChild(card_svg);
    card_svg.id = Card.getNextID();
    card_svg.classList.add('card_draggable');
    card_svg.setAttribute('width', this.width);
    card_svg.setAttribute('height', this.height);
    card_svg.setAttribute('x', this.x);
    card_svg.setAttribute('y', this.y);

    // background
    // covers complete size of svg
    const card_background = document.createElementNS(svgns, 'rect');
    this.svg.background = card_background;
    card_svg.appendChild(card_background);
    card_background.classList.add('card_draggable');
    card_background.setAttribute('width', this.width);
    card_background.setAttribute('height', this.height);
    card_background.setAttribute('fill', element_colours[this.element]);
    card_background.setAttribute('stroke', 'black');

    // name container
    // name text
    const name_text = document.createElementNS(svgns, 'text');
    this.svg.name_text = name_text;
    card_svg.appendChild(name_text);
    name_text.classList.add('card_name');
    name_text.classList.add('card_draggable');
    name_text.textContent = this.name;
    name_text.setAttribute('x', this.width * 0.5 - name_text.getComputedTextLength() / 2);
    name_text.setAttribute('y', this.height * 0.6);
    name_text.setAttribute('stroke', 'black');

    // container for cost, damage and mana info
    // header line for container
    const header_line = document.createElementNS(svgns, 'line');
    this.svg.header_line = header_line;
    const header_line_height = this.height * 0.75;
    card_svg.appendChild(header_line);
    header_line.classList.add('draggable');
    header_line.setAttribute('x1', 0);
    header_line.setAttribute('y1', header_line_height);
    header_line.setAttribute('x2', this.width);
    header_line.setAttribute('y2', header_line_height);
    header_line.setAttribute('stroke', 'black');
    // vertical line 1
    const vertical_line_1 = document.createElementNS(svgns, 'line');
    this.vertical_line_1 = vertical_line_1;
    card_svg.appendChild(vertical_line_1);
    vertical_line_1.classList.add('card_draggable');
    vertical_line_1.setAttribute('x1', this.width * (1/3));
    vertical_line_1.setAttribute('y1', header_line_height);
    vertical_line_1.setAttribute('x2', this.width * (1/3));
    vertical_line_1.setAttribute('y2', this.height);
    vertical_line_1.setAttribute('stroke', 'black');
    // vertical line 2
    const vertical_line_2 = document.createElementNS(svgns, 'line');
    this.vertical_line_2 = vertical_line_2;
    card_svg.appendChild(vertical_line_2);
    vertical_line_2.classList.add('draggable');
    vertical_line_2.setAttribute('x1', this.width * 2 * (1/3));
    vertical_line_2.setAttribute('y1', header_line_height);
    vertical_line_2.setAttribute('x2', this.width * 2 * (1/3));
    vertical_line_2.setAttribute('y2', this.height);
    vertical_line_2.setAttribute('stroke', 'black');

    // text in container for cost, damage and mana
    // cost
    const card_cost_text = document.createElementNS(svgns, 'text');
    this.svg.cost_text = card_cost_text;
    card_svg.appendChild(card_cost_text);
    card_cost_text.classList.add('card_draggable');
    card_cost_text.textContent = '£69';
    card_cost_text.setAttribute('x', this.width * (1/6) - card_cost_text.getComputedTextLength() / 2);
    card_cost_text.setAttribute('y', header_line_height + (this.height - header_line_height) / 2);
    card_cost_text.setAttribute('fill', 'gold');
    // damage
    const card_damage_text = document.createElementNS(svgns, 'text');
    this.svg.damage_text = card_damage_text;
    card_svg.appendChild(card_damage_text);
    card_damage_text.classList.add('card_draggable');
    card_damage_text.textContent = this.damage;
    card_damage_text.setAttribute('x', this.width * 0.5 - card_damage_text.getComputedTextLength() / 2);
    card_damage_text.setAttribute('y', header_line_height + (this.height - header_line_height) / 2);
    card_damage_text.setAttribute('fill', 'red');
    // mana
    const card_mana_text = document.createElementNS(svgns, 'text');
    this.svg.mana_text = card_mana_text;
    card_svg.appendChild(card_mana_text);
    card_mana_text.classList.add('card_draggable');
    card_mana_text.textContent = this.mana;
    card_mana_text.setAttribute('x', this.width * 5 * (1/6) - card_mana_text.getComputedTextLength() / 2);
    card_mana_text.setAttribute('y', header_line_height + (this.height - header_line_height) / 2);
    card_mana_text.setAttribute('fill', 'mana');

    this.addListeners();
  }
}

let currently_dragged_card_svg = null;
let currently_dragged_over_cardSlot = null;

// checks if an element is draggable
function card_checkIfDraggable(node) {
  return node.classList.contains('card_draggable');
}

// checks if the current element is being dragged
function card_currentDragging(node) {
  return node.classList.contains('card_dragging');
}

function card_drag(ev) {
  if(currently_dragged_card_svg) {
    ev.preventDefault();

    // update co-ords of svg to mouse position
    const topLevel = SVG.getTopLevelSVG(ev.target);
    const coords = SVG.getCoords(ev, topLevel);
    topLevel.setAttribute('x', coords.x);
    topLevel.setAttribute('y', coords.y);

    old_clientX = ev.clientX;
    old_clientY = ev.clientY;

    // check if there is a card slot underneath card (within range)
    const cardSlot = CardSlot.inRange(coords);
    if(cardSlot) {
      // if so then higlight that these will connect if dropped here
      // remember card slot for data transfer
      currently_dragged_over_cardSlot = cardSlot;

      // remove from all other card slots first
      CardSlot.removeHighlighting();
      // highlight card slot for dropping
      cardSlot.svg.classList.add('cardSlot_highlighted');
      cardSlot.svg.background.setAttribute('stroke', 'red');
    } else {
      currently_dragged_over_cardSlot = null;

      CardSlot.removeHighlighting();
    }
  }
}
