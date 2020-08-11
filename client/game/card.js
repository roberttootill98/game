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
    const card_svg = document.createElementNS(svgns, 'svg');
    this.svg = card_svg;
    target.appendChild(card_svg);
    card_svg.id = Card.getNextID();
    card_svg.setAttribute('width', this.width);
    card_svg.setAttribute('height', this.height);
    card_svg.setAttribute('x', this.x);
    card_svg.setAttribute('y', this.y);

    // background
    // covers complete size of svg
    const card_background = document.createElementNS(svgns, 'rect');
    this.svg.background = card_background;
    card_svg.appendChild(card_background);
    card_background.setAttribute('width', this.width);
    card_background.setAttribute('height', this.height);
    card_background.setAttribute('fill', element_colours[this.element]);
    card_background.setAttribute('stroke', 'black');

    // icon
    this.svg.icon = icon_table.draw(this.name, card_svg, 50, 50);

    // name container
    // name text
    const name_text = document.createElementNS(svgns, 'text');
    this.svg.name_text = name_text;
    card_svg.appendChild(name_text);
    name_text.classList.add('card_name');
    name_text.textContent = this.name;
    // svg attributes
    name_text.setAttribute('x', '50%');
    name_text.setAttribute('y', '50%');
    name_text.setAttribute('alignment-baseline', 'middle');
    name_text.setAttribute('text-anchor', 'middle');
    name_text.setAttribute('stroke', 'black');

    // container for cost, damage and mana info
    // header line for container
    const header_line = document.createElementNS(svgns, 'line');
    this.svg.header_line = header_line;
    const header_line_height = this.height * 0.75;
    card_svg.appendChild(header_line);
    header_line.setAttribute('x1', 0);
    header_line.setAttribute('y1', header_line_height);
    header_line.setAttribute('x2', this.width);
    header_line.setAttribute('y2', header_line_height);
    header_line.setAttribute('stroke', 'black');
    // vertical line 1
    const vertical_line_1 = document.createElementNS(svgns, 'line');
    this.vertical_line_1 = vertical_line_1;
    card_svg.appendChild(vertical_line_1);
    vertical_line_1.setAttribute('x1', this.width * (1/3));
    vertical_line_1.setAttribute('y1', header_line_height);
    vertical_line_1.setAttribute('x2', this.width * (1/3));
    vertical_line_1.setAttribute('y2', this.height);
    vertical_line_1.setAttribute('stroke', 'black');
    // vertical line 2
    const vertical_line_2 = document.createElementNS(svgns, 'line');
    this.vertical_line_2 = vertical_line_2;
    card_svg.appendChild(vertical_line_2);
    vertical_line_2.setAttribute('x1', this.width * 2 * (1/3));
    vertical_line_2.setAttribute('y1', header_line_height);
    vertical_line_2.setAttribute('x2', this.width * 2 * (1/3));
    vertical_line_2.setAttribute('y2', this.height);
    vertical_line_2.setAttribute('stroke', 'black');

    // text in container for cost, damage and mana
    // wrapped in svgs for allignment

    // cost
    // container
    const cost_container = document.createElementNS(svgns, 'svg');
    this.svg.cost_container = cost_container;
    card_svg.appendChild(cost_container);
    cost_container.classList.add('card_attribute_text');
    // svg attributes
    cost_container.setAttribute('width', `${1/3 * 100}%`);
    cost_container.setAttribute('height', card_svg.getAttribute('height') - header_line_height);
    cost_container.setAttribute('x', 0);
    cost_container.setAttribute('y', header_line_height);
    // text
    const cost_text = document.createElementNS(svgns, 'text');
    this.svg.cost_text = cost_text;
    cost_container.appendChild(cost_text);
    cost_text.textContent = '£69';
    // svg attributes
    cost_text.setAttribute('x', '50%');
    cost_text.setAttribute('y', '50%');
    cost_text.setAttribute('alignment-baseline', 'middle');
    cost_text.setAttribute('text-anchor', 'middle');
    cost_text.setAttribute('fill', 'gold');

    // damage
    // container
    const damage_container = document.createElementNS(svgns, 'svg');
    this.svg.damage_container = damage_container;
    card_svg.appendChild(damage_container);
    damage_container.classList.add('card_attribute_text');
    // svg attributes
    damage_container.setAttribute('width', `${1/3 * 100}%`);
    damage_container.setAttribute('height', card_svg.getAttribute('height') - header_line_height);
    damage_container.setAttribute('x', `${1/3 * 100}%`);
    damage_container.setAttribute('y', header_line_height);
    // text
    const damage_text = document.createElementNS(svgns, 'text');
    this.svg.damage_text = damage_text;
    damage_container.appendChild(damage_text);
    damage_text.textContent = this.damage;
    // svg attributes
    damage_text.setAttribute('x', '50%');
    damage_text.setAttribute('y', '50%');
    damage_text.setAttribute('alignment-baseline', 'middle');
    damage_text.setAttribute('text-anchor', 'middle');
    damage_text.setAttribute('stroke', 'red');

    // mana
    // container
    const mana_container = document.createElementNS(svgns, 'svg');
    this.svg.mana_container = mana_container;
    card_svg.appendChild(mana_container);
    mana_container.classList.add('card_attribute_text');
    // svg attributes
    mana_container.setAttribute('width', `${1/3 * 100}%`);
    mana_container.setAttribute('height', card_svg.getAttribute('height') - header_line_height);
    mana_container.setAttribute('x', `${2/3 * 100}%`);
    mana_container.setAttribute('y', header_line_height);
    // text
    const mana_text = document.createElementNS(svgns, 'text');
    this.svg.mana_text = mana_text;
    mana_container.appendChild(mana_text);
    mana_text.textContent = this.mana;
    // svg attributes
    mana_text.setAttribute('x', '50%');
    mana_text.setAttribute('y', '50%');
    mana_text.setAttribute('alignment-baseline', 'middle');
    mana_text.setAttribute('text-anchor', 'middle');
    mana_text.setAttribute('stroke', 'blue');

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
