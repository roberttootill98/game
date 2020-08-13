// class definition for companion
'use strict';

const companions = [];

class Companion extends SVG {
  /**
   * creates a new companion
   * @constructor
   * @param {string} side, 'player' or 'opponent'
   * @param {int} index, which number companion this is within side
   * @param {string} name, of companion
   * @param {int} health, of companion
   * @param {int} mana, of companion
   * @param {json} cards, list of jsons containing card info,
   *  length must always be 4, can contain null entries
   */
  constructor(side, index, name, health, mana, cards) {
    // calculate attributes
    const game_svg_workspace = document.getElementById('game_svg_workspace');
    const container_side = document.querySelectorAll('.container_side')[0];
    const width = game_svg_workspace.getAttribute('width') * 0.2;
    const height = container_side.getAttribute('height') * 0.9;
    // 4 is total number of companions per side
    const x = game_svg_workspace.getAttribute('width') / 4 * index;
    super(width, height, x, 0);

    this.side = side;
    this.index = index;
    this.name = name;
    this.health = health;
    this.mana = mana;
    this.cards = cards;

    this.cardSlots = [];
    companions.push(this);
  }

  static getByID(id) {
    for(const companion of companions) {
      if(companion.svg.id == id) {
        return companion;
      }
    }
  }

  draw(container_side) {
    // container
    this.svg = document.createElementNS(svgns, 'svg');
    container_side.appendChild(this.svg);
    this.svg.id = companions.length;
    this.svg.classList.add('container_companion');
    // type dependent
    if(this.side == 'container_opposition') {
      this.svg.classList.add('opposition_companion');
    } else if(this.side == 'container_player') {
      this.svg.classList.add('player_companion');
    }
    // svg attributes
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('x', this.x);
    this.svg.setAttribute('y', this.y);

    this.svg.background = document.createElementNS(svgns, 'rect');
    this.svg.appendChild(this.svg.background);
    // svg attributes
    this.svg.background.setAttribute('width', this.svg.getAttribute('width'));
    this.svg.background.setAttribute('height', this.svg.getAttribute('height'));
    this.svg.background.setAttribute('fill', 'pink');

    // name
    // wrapped in an svg for text allignment
    // container
    this.svg.name = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.name);
    // svg attributes
    this.svg.name.setAttribute('width', this.svg.getAttribute('width') * 0.65);
    this.svg.name.setAttribute('height', this.svg.getAttribute('height') * 0.2);
    this.svg.name.setAttribute('x', 0);
    this.svg.name.setAttribute('y', 0);
    // text
    this.svg.name.text = document.createElementNS(svgns, 'text');
    this.svg.name.appendChild(this.svg.name.text);
    this.svg.name.text.textContent = this.name;
    // svg attributes
    this.svg.name.text.setAttribute('x', '50%');
    this.svg.name.text.setAttribute('y', '50%');
    this.svg.name.text.setAttribute('alignment-baseline', 'middle');
    this.svg.name.text.setAttribute('text-anchor', 'middle');
    this.svg.name.text.setAttribute('stroke', 'black');

    // health
    this.svg.health = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.health);
    // svg attributes
    this.svg.health.setAttribute('width', (this.svg.getAttribute('width') -
      this.svg.name.getAttribute('width')) / 2);
    this.svg.health.setAttribute('height', this.svg.name.getAttribute('height'));
    this.svg.health.setAttribute('x', this.svg.name.getAttribute('width'));
    this.svg.health.setAttribute('y', 0);
    // background
    this.svg.health.background = document.createElementNS(svgns, 'rect');
    this.svg.health.appendChild(this.svg.health.background);
    // svg attributes
    this.svg.health.background.setAttribute('width',
      this.svg.health.getAttribute('width'));
    this.svg.health.background.setAttribute('height',
      this.svg.health.getAttribute('height'));
    this.svg.health.background.setAttribute('fill', 'green');
    this.svg.health.background.setAttribute('stroke', 'black');
    // text
    this.svg.health.text = document.createElementNS(svgns, 'text');
    this.svg.health.appendChild(this.svg.health.text);
    this.svg.health.text.textContent = this.health;
    // svg attributes
    this.svg.health.text.setAttribute('x', '50%');
    this.svg.health.text.setAttribute('y', '50%');
    this.svg.health.text.setAttribute('alignment-baseline', 'middle');
    this.svg.health.text.setAttribute('text-anchor', 'middle');
    this.svg.health.text.setAttribute('stroke', 'black');

    // mana
    this.svg.mana = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.mana);
    // svg attributes
    this.svg.mana.setAttribute('width', this.svg.health.getAttribute('width'));
    this.svg.mana.setAttribute('height', this.svg.name.getAttribute('height'));
    this.svg.mana.setAttribute('x', parseFloat(this.svg.health.getAttribute('x')) +
      parseFloat(this.svg.health.getAttribute('width')));
    this.svg.mana.setAttribute('y', 0);
    // background
    this.svg.mana.background = document.createElementNS(svgns, 'rect');
    this.svg.mana.appendChild(this.svg.mana.background);
    // svg attributes
    this.svg.mana.background.setAttribute('width',
      this.svg.mana.getAttribute('width'));
    this.svg.mana.background.setAttribute('height',
      this.svg.mana.getAttribute('height'));
    this.svg.mana.background.setAttribute('fill', 'blue');
    this.svg.mana.background.setAttribute('stroke', 'black');
    // text
    this.svg.mana.text = document.createElementNS(svgns, 'text');
    this.svg.mana.appendChild(this.svg.mana.text);
    this.svg.mana.text.textContent = this.mana;
    // svg attributes
    this.svg.mana.text.setAttribute('x', '50%');
    this.svg.mana.text.setAttribute('y', '50%');
    this.svg.mana.text.setAttribute('alignment-baseline', 'middle');
    this.svg.mana.text.setAttribute('text-anchor', 'middle');
    this.svg.mana.text.setAttribute('stroke', 'black');

    // icon
    this.svg.icon = document.createElementNS(svgns, 'svg');
    this.svg.appendChild(this.svg.icon);
    this.svg.icon.classList.add('container_icon');
    // svg attributes
    this.svg.icon.setAttribute('width', this.svg.name.getAttribute('width'));
    this.svg.icon.setAttribute('height', this.svg.getAttribute('height') -
      this.svg.name.getAttribute('height'));
    this.svg.icon.setAttribute('y', this.svg.name.getAttribute('height'));
    // background
    this.svg.icon.background = document.createElementNS(svgns, 'rect');
    this.svg.icon.appendChild(this.svg.icon.background);
    // svg attributes
    this.svg.icon.background.setAttribute('width',
      this.svg.icon.getAttribute('width'));
    this.svg.icon.background.setAttribute('height',
      this.svg.icon.getAttribute('height'));
    this.svg.icon.background.setAttribute('fill', 'brown');

    // card slots
    for(const [i, card] of this.cards.entries()) {
      const cardSlot_attributes = CardSlot.calculateSize(this.svg, i);

      const cardSlot = new CardSlot(card, this.side.slice(10),
        cardSlot_attributes.width, cardSlot_attributes.height,
        cardSlot_attributes.x, cardSlot_attributes.y);
      this.cardSlots.push(cardSlot);

      if(cardSlot.card) {
        cardSlot.draw_filled(game_svg_workspace, this.svg, i);
      } else {
        cardSlot.draw_empty(this.svg, i);
      }
    }
  }

  setHealth(health) {
    this.health = health;
    this.svg.health.text.textContent = health;
  }

  setMana(mana) {
    this.mana = mana;
    this.svg.mana.text.textContent = mana;
  }

  /**
   * sets value of one card
   * @param {json} card, new card, pass null to eliminate card
   * @param {integer} index, which card we are setting
   */
  setCard(card, index) {
    this.cards[index] = card;
    const cardSlot = this.cardSlots[index];
    cardSlot.card = card;

    // redraw card slot
    if(card) {
      cardSlot.draw_filled(document.getElementById('game_svg_workspace'),
        this.svg, index);
    } else {
      cardSlot.draw_empty(this.svg, index);
    }
  }
}
