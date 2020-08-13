// functions to do with cards
'use strict'

const cardAttributes = {
  'width': 100,
  'height': 200,
  'seperation': {
    'horizontal': 25,
    'vertical': 25
  }
}

const cardsInPlay = [];

// for drag and drop
let currently_dragged_card_svg = null;

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
    this.svg = document.createElementNS(svgns, 'svg');
    target.appendChild(this.svg);
    this.svg.id = Card.getNextID();
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('x', this.x);
    this.svg.setAttribute('y', this.y);

    // background
    // covers complete size of svg
    this.svg.background = document.createElementNS(svgns, 'rect');
    this.svg.appendChild(this.svg.background);
    this.svg.background.setAttribute('width', this.width);
    this.svg.background.setAttribute('height', this.height);
    this.svg.background.setAttribute('fill', element_colours[this.element]);
    this.svg.background.setAttribute('stroke', 'black');

    // icon
    this.svg.icon = icon_table.draw(this.name, this.svg, 50, 50);

    // name container
    this.svg.name = {};
    // name text
    this.svg.name.text = document.createElementNS(svgns, 'text');
    this.svg.appendChild(this.svg.name.text);
    this.svg.name.text.classList.add('card_name');
    this.svg.name.text.textContent = this.name;
    // svg attributes
    this.svg.name.text.setAttribute('x', '50%');
    this.svg.name.text.setAttribute('y', '50%');
    this.svg.name.text.setAttribute('alignment-baseline', 'middle');
    this.svg.name.text.setAttribute('text-anchor', 'middle');
    this.svg.name.text.setAttribute('stroke', 'black');

    // container for cost, damage and mana info
    // header line for container
    this.svg.header_line = document.createElementNS(svgns, 'line');
    this.svg.header_line.height = this.height * 0.75;
    this.svg.appendChild(this.svg.header_line);
    this.svg.header_line.setAttribute('x1', 0);
    this.svg.header_line.setAttribute('y1', this.svg.header_line.height);
    this.svg.header_line.setAttribute('x2', this.width);
    this.svg.header_line.setAttribute('y2', this.svg.header_line.height);
    this.svg.header_line.setAttribute('stroke', 'black');
    // vertical line 1
    this.vertical_line_1 = document.createElementNS(svgns, 'line');
    this.svg.appendChild(this.vertical_line_1);
    this.vertical_line_1.setAttribute('x1', this.width * (1/3));
    this.vertical_line_1.setAttribute('y1', this.svg.header_line.height);
    this.vertical_line_1.setAttribute('x2', this.width * (1/3));
    this.vertical_line_1.setAttribute('y2', this.height);
    this.vertical_line_1.setAttribute('stroke', 'black');
    // vertical line 2
    this.vertical_line_2 = document.createElementNS(svgns, 'line');
    this.svg.appendChild(this.vertical_line_2);
    this.vertical_line_2.setAttribute('x1', this.width * 2 * (1/3));
    this.vertical_line_2.setAttribute('y1', this.svg.header_line.height);
    this.vertical_line_2.setAttribute('x2', this.width * 2 * (1/3));
    this.vertical_line_2.setAttribute('y2', this.height);
    this.vertical_line_2.setAttribute('stroke', 'black');

    // text in container for cost, damage and mana
    // wrapped in svgs for allignment

    // cost
    // container
    this.svg.cost = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.cost);
    this.svg.cost.classList.add('card_attribute_text');
    // svg attributes
    this.svg.cost.setAttribute('width', `${1/3 * 100}%`);
    this.svg.cost.setAttribute('height', this.svg.getAttribute('height') -
      this.svg.header_line.height);
    this.svg.cost.setAttribute('x', 0);
    this.svg.cost.setAttribute('y', this.svg.header_line.height);
    // text
    this.svg.cost.text = document.createElementNS(svgns, 'text');
    this.svg.cost.appendChild(this.svg.cost.text);
    this.svg.cost.text.textContent = '£69';
    // svg attributes
    this.svg.cost.text.setAttribute('x', '50%');
    this.svg.cost.text.setAttribute('y', '50%');
    this.svg.cost.text.setAttribute('alignment-baseline', 'middle');
    this.svg.cost.text.setAttribute('text-anchor', 'middle');
    this.svg.cost.text.setAttribute('fill', 'gold');

    // damage
    // container
    this.svg.damage = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.damage);
    this.svg.damage.classList.add('card_attribute_text');
    // svg attributes
    this.svg.damage.setAttribute('width', `${1/3 * 100}%`);
    this.svg.damage.setAttribute('height', this.svg.getAttribute('height') -
      this.svg.header_line.height);
    this.svg.damage.setAttribute('x', `${1/3 * 100}%`);
    this.svg.damage.setAttribute('y', this.svg.header_line.height);
    // text
    this.svg.damage.text = document.createElementNS(svgns, 'text');
    this.svg.damage.appendChild(this.svg.damage.text);
    this.svg.damage.text.textContent = this.damage;
    // svg attributes
    this.svg.damage.text.setAttribute('x', '50%');
    this.svg.damage.text.setAttribute('y', '50%');
    this.svg.damage.text.setAttribute('alignment-baseline', 'middle');
    this.svg.damage.text.setAttribute('text-anchor', 'middle');
    this.svg.damage.text.setAttribute('stroke', 'red');

    // mana
    // container
    this.svg.mana = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.mana);
    this.svg.mana.classList.add('card_attribute_text');
    // svg attributes
    this.svg.mana.setAttribute('width', `${1/3 * 100}%`);
    this.svg.mana.setAttribute('height', this.svg.getAttribute('height') -
      this.svg.header_line.height);
    this.svg.mana.setAttribute('x', `${2/3 * 100}%`);
    this.svg.mana.setAttribute('y', this.svg.header_line.height);
    // text
    this.svg.mana.text = document.createElementNS(svgns, 'text');
    this.svg.mana.appendChild(this.svg.mana.text);
    this.svg.mana.text.textContent = this.mana;
    // svg attributes
    this.svg.mana.text.setAttribute('x', '50%');
    this.svg.mana.text.setAttribute('y', '50%');
    this.svg.mana.text.setAttribute('alignment-baseline', 'middle');
    this.svg.mana.text.setAttribute('text-anchor', 'middle');
    this.svg.mana.text.setAttribute('stroke', 'blue');

    this.addListeners();
  }

  /** DRAG AND DROP FUNCTIONS **/

  addListeners() {
    SVG.addClass(this.svg, 'draggable');
  }

  static drag(ev) {
    if(currently_dragged_card_svg && !modalWindow) {
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
}
