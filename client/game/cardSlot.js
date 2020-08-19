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
let clicked_cardSlot = null;

class CardSlot extends SVG {
  /**
   * creates new card slot
   * @constructor
   * @param {JSON} card, as a card json or null
   * @param {float} width, width of svg
   * @param {float} height, hieght of svg
   * @param {float} x, x position of svg
   * @param {float} y, y position of svg
   */
  constructor(card, width, height, x, y) {
    super(width, height, x, y);
    this.card = card;
    if(this.card) {
      if(card_effects[card.name]) {
        this.card.effect = card_effects.default;
      } else {
        this.card.effect = card_effects[card.name];
      }
    }

    cardSlots.push(this);
  }

  destroy() {
    this.svg.remove();
    cardSlots.splice(cardSlots.indexOf(this), 1);
    delete this;
  }

  /**
   * gets a card based on the id of svg
   * @param {integer} id, of the svg
   * @returns {cardSlot} object if found else null
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
    const container_icon = container_companion.querySelector('.container_companion_icon');
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
   * draws the cardSlot
   * @param {element} target, which companion svg it is being appended to
   * @param {integer} index, which card slot within the companion this is
   */
  draw(target, index) {
    // get rid of current svg
    if(this.svg) {
      this.svg.remove();
    }

    this.svg = document.createElementNS(svgns, 'svg');
    target.appendChild(this.svg);
    this.svg.id = CardSlot.getNextID();
    this.svg.classList.add('cardSlot' + index);
    if(this.card) {
      this.svg.classList.add('cardSlot_filled');
    } else {
      this.svg.classList.add('cardSlot_empty');
    }
    // get owner
    if(this.companion.svg.classList.contains('player_companion')) {
      this.svg.classList.add('cardSlot_player');
    } else if(this.companion.svg.classList.contains('opposition_companion')) {
      this.svg.classList.add('cardSlot_opposition');
    }
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
    if(this.card) {
      this.svg.background.setAttribute('fill', element_colours[this.card.element]);
    } else {
      this.svg.background.setAttribute('fill', 'pink');
    }
    this.svg.background.setAttribute('stroke', 'black');
  }

  /**
   * highlights the card slot as moused over
   */
  highlight() {
    this.svg.classList.add('cardSlot_highlighted');
    this.svg.background.setAttribute('stroke', 'red');
  }

  /**
   * highlights the card slot as being selected
   */
  highlight_selected() {
    this.svg.classList.add('cardSlot_highlighted_selected');
    this.svg.background.setAttribute('stroke', 'green');
  }

  /**
   * strip all card slots of highlighting
   * ignores the currently clicked card slot
   */
  static removeHighlighting() {
    for(const cardSlot of Array.from(document.querySelectorAll('.cardSlot_highlighted')).concat(
      Array.from(document.querySelectorAll('.cardSlot_highlighted_selected')))) {
      if(clicked_cardSlot && cardSlot == clicked_cardSlot.svg) {
        continue;
      } else {
        cardSlot.classList.remove('cardSlot_highlighted');
        cardSlot.querySelector('rect').setAttribute('stroke', 'black');
      }
    }
  }

  /**
   * @returns {Companion} that the CardSlot is associated with
   */
  get companion() {
    if(this.card) {
      const container_companion = document.querySelectorAll('.container_companion')[
        parseInt(this.svg.id - 1) / 4 >> 0];
      return Companion.getByID(container_companion.id);
    } else {
      return Companion.getByID(this.svg.parentNode.id);
    }
  }

  /**
   * @returns {integer} index of the card slot in reference to its companion
   */
  get index() {
    return parseInt(this.svg.id - 1) % 4;
  }

  /** DRAG AND DROP FUNCTIONS **/
  async addListeners() {
    switch((await getPhase()).slice(8)) {
      case "phase_arrangement":
        // events
        this.svg.onmouseover = CardSlot.mouseover;
        this.svg.onmouseleave = CardSlot.mouseleave;

        if(this.card) {
          this.svg.onmousedown = CardSlot.filled_startDrag;
          // DOM
          // add draggable class to all elements of svg
          SVG.addClass(this.svg, 'draggable');
        }
        break;
      case "phase_attacking":
        if(this.card) {
          this.svg.onmouseover = CardSlot.attacking_onmouseover;
          this.svg.onmouseleave = CardSlot.attacking_onmouseleave;
          this.svg.onmousedown = CardSlot.attacking_onmousedown;
        }
        break;
      default:
        break;
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
    const coords = SVG.getAbsoluteCoords(cardSlot.svg);

    // setup data transfer
    // get details before deleting
    currently_dragged_cardSlot_card = cardSlot.card;
    const companion = cardSlot.companion;
    currently_dragged_cardSlot_target = companion.svg;
    currently_dragged_cardSlot_oldIndex = cardSlot.index;

    // draw filled slot as empty slot
    companion.setCard(null, currently_dragged_cardSlot_oldIndex)
    // remember card slot
    currently_dragged_cardSlot = cardSlot;

    // create new fully sized card to be dragged
    const cardObj = new Card_Arrangement(currently_dragged_cardSlot_card,
      cardAttributes.width, cardAttributes.height, coords.x, coords.y);
    cardObj.draw(document.getElementById('game_svg_workspace'));
    currently_dragged_card = cardObj;

    // capture initial mouse coords
    old_clientX = ev.clientX;
    old_clientY = ev.clientY;

    old_position_x = topLevel.getAttribute('x');
    old_position_y = topLevel.getAttribute('y');
  }

  static attacking_onmouseover(ev) {
    const topLevel = SVG.getTopLevelSVG(ev.target);
    const cardSlot = CardSlot.getByID(topLevel.id);

    if(!cardSlot.svg.classList.contains('cardSlot_highlighted_selected')) {
      cardSlot.highlight();
    }
  }

  static attacking_onmouseleave(ev) {
    CardSlot.removeHighlighting();
  }

  static attacking_onmousedown(ev) {
    const topLevel = SVG.getTopLevelSVG(ev.target);
    clicked_cardSlot = CardSlot.getByID(topLevel.id);
    const self_companion = clicked_cardSlot.companion;

    // deny if insufficient attributes
    for(const key in clicked_cardSlot.card.cost) {
      if(clicked_cardSlot.card.cost[key] > self_companion[key]) {
        return;
      }
    }

    // highlight this cardSlot
    clicked_cardSlot.highlight_selected();

    // display full sized card in the middle of page


    // consider the card's target
    // card may have more than one target
    if(clicked_cardSlot.card.target.includes('self')) {
      // add listeners to parent companion of card slot
      self_companion.svg.onmouseover = attacking_onmouseover;
      self_companion.svg.onmouseleave = attacking_onmouseleave;
      self_companion.svg.onmousedown = self_onmousedown;
    }

    if(clicked_cardSlot.card.target.includes('ally')) {
      // add listeners to player side companions except self
      const player_side = document.getElementById('container_player');
      for(const companion of player_side.querySelectorAll('.container_companion')) {
        if(companion == self_companion.svg) {
          continue;
        }
        companion.onmouseover = attacking_onmouseover;
        companion.onmouseleave = attacking_onmouseleave;
        companion.onmousedown = ally_onmousedown;
      }
    }

    if(clicked_cardSlot.card.target.includes('enemy')) {
      // add listeners to opponent companions
      const opponent_side = document.getElementById('container_opposition');
      for(const companion of opponent_side.querySelectorAll('.container_companion')) {
        companion.onmouseover = attacking_onmouseover;
        companion.onmouseleave = attacking_onmouseleave;
        companion.onmousedown = opponent_onmousedown;
      }
    }
  }
}
