// dom gameboard functions
'use strict'

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

// checks if an id for an svg element is being used in a list of svg elements
function checkIfInUse(id, arr) {
  for(const item of arr) {
    if(item.svg.id == id) {
      // found match
      return true;
    }
  }
  // none found therefore false
  return false;
}

// spell slots
const spellSlots = [];

// creates dom for game board
async function createGameBoard() {
  console.log("creating game board");

  const gameContainer = document.createElement('div');
  document.getElementById('main').appendChild(gameContainer);
  gameContainer.id = 'gameContainer';

  // full size of gameboard
  const game_svg_workspace = document.createElementNS(svgns, 'svg');
  gameContainer.appendChild(game_svg_workspace);
  game_svg_workspace.id = 'game_svg_workspace';
  // svg attributes
  game_svg_workspace.setAttribute('width', getWidth());
  game_svg_workspace.setAttribute('height', getHeight() * 0.95);
  game_svg_workspace.setAttribute('fill', 'blue');

  // create opposition side
  const container_opposition = await createSideContainer(game_svg_workspace, 'container_opposition');

  // create player side
  const container_player = await createSideContainer(game_svg_workspace, 'container_player');

  // create footer bar
  const container_footer = createFooterBar(game_svg_workspace);
}

async function createSideContainer(game_svg_workspace, side_type) {
  const width = game_svg_workspace.getAttribute('width');
  const height = game_svg_workspace.getAttribute('height');

  // main container
  const container_side = document.createElementNS(svgns, 'svg');
  game_svg_workspace.appendChild(container_side);
  container_side.id = side_type;
  container_side.classList.add('container_side');
  // svg attributes
  container_side.setAttribute('width', width);
  container_side.setAttribute('height', height * 0.25);
  container_side.setAttribute('x', 0);
  if(side_type == 'container_opposition') {
    container_side.setAttribute('y', 0);
  } else if(side_type == 'container_player') {
    container_side.setAttribute('y', height - height * 0.30);
  }

  const side_background = document.createElementNS(svgns, 'rect');
  container_side.appendChild(side_background);
  // svg attributes
  side_background.setAttribute('width', container_side.getAttribute('width'));
  side_background.setAttribute('height', container_side.getAttribute('height'));
  side_background.setAttribute('x', 0);
  side_background.setAttribute('y', 0);
  // type dependent svg attributes
  if(side_type == 'container_opposition') {
    side_background.setAttribute('fill', 'red');
  } else if(side_type == 'container_player') {
    side_background.setAttribute('fill', 'green');
  }

  // companion spaces
  const companions = await getCompanions();

  for(const [i, companion] of companions.entries()) {
    // container rect
    const container_companion = document.createElementNS(svgns, 'svg');
    container_side.appendChild(container_companion);
    container_companion.classList.add('container_companion');
    // type dependent
    if(side_type == 'container_opposition') {
      container_companion.classList.add('opposition_companion');
    } else if(side_type == 'container_player') {
      container_companion.classList.add('player_companion');
    }
    // svg attributes
    container_companion.setAttribute('width', width * 0.2);
    container_companion.setAttribute('height', container_side.getAttribute('height') * 0.9);
    container_companion.setAttribute('x', width / 4 * i);
    container_companion.setAttribute('y', 0);

    const companion_background = document.createElementNS(svgns, 'rect');
    container_companion.appendChild(companion_background);
    // svg attributes
    companion_background.setAttribute('width', container_companion.getAttribute('width'));
    companion_background.setAttribute('height', container_companion.getAttribute('height'));
    companion_background.setAttribute('fill', 'blue');

    // name
    const name_text = document.createElementNS(svgns, 'text');
    container_companion.appendChild(name_text);
    name_text.textContent = companion.name;
    // svg attributes
    name_text.setAttribute('x', container_companion.getAttribute('width') * 0.5 - name_text.getComputedTextLength() / 2);
    name_text.setAttribute('y', container_companion.getAttribute('height') * 0.1);
    name_text.setAttribute('stroke', 'black');

    // icon
    const icon_container = document.createElementNS(svgns, 'svg');
    container_companion.appendChild(icon_container);
    // svg attributes
    icon_container.setAttribute('width', container_companion.getAttribute('width') * 0.65);
    icon_container.setAttribute('height', container_companion.getAttribute('height') * 0.8);
    icon_container.setAttribute('y', container_companion.getAttribute('height') * 0.2);

    const icon_background = document.createElementNS(svgns, 'rect');
    icon_container.appendChild(icon_background);
    icon_background.setAttribute('width', icon_container.getAttribute('width'));
    icon_background.setAttribute('height', icon_container.getAttribute('height'));
    icon_background.setAttribute('fill', 'brown');

    // card slots
    for(const [j, card] of companion.spells.entries()) {
      const cardSlot_attributes = CardSlot.calculateCardSize(container_companion, j);

      const cardSlot = new CardSlot(card, cardSlot_attributes.width,
        cardSlot_attributes.height, cardSlot_attributes.position);

      if(cardSlot.card) {
        cardSlot.draw_filled(game_svg_workspace, container_companion, j);
      } else {
        cardSlot.draw_empty(container_companion, j);
      }
    }
  }

  return container_side;
}

async function getCompanions() {
  return [
    {
      'name': 'aang',
      'icon': '/assets/companions/aang.png',
      'spells': [
        {
          'name': 'glider',
          'element': 'air'
        },
        {
          'name': 'hot squat',
          'element': 'fire'
        },
        null,
        null
      ]
    },
    {
      'name': 'katara',
      'icon': '/assets/companions/katara.png',
      'spells': [
        {
          'name': 'healing',
          'element': 'water'
        },
        {
          'name': 'freeze',
          'element': 'water'
        },
        {
          'name': 'wet',
          'element': 'water'
        },
        null
      ]
    },
    {
      'name': 'sokka',
      'icon': '/assets/companions/sokka.png',
      'spells': [
        {
          'name': 'boomerang',
          'element': 'none'
        },
        null,
        null,
        null
      ]
    },
    {
      'name': 'suki',
      'icon': '/assets/companions/suki.png',
      'spells': [
        {
          'name': 'shield',
          'element': 'none'
        },
        null,
        null,
        null
      ]
    }
  ];
}

// checks if given (x, y) position is within any of the card slots
function cardSlot_inRange(coords) {
  // coords.x, coords.y
  // coords are absolute

  for(const [i, cardSlot] of cardSlots.entries()) {
    // check if cardSlot is empty
    if(!cardSlot.card) {
      // get absolute cardSlot coords
      const cardSlot_coords = getAbsoluteCoords(cardSlot.svg);
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

  // failed to find any cardSlot which the coords fit inside
  return false;
}

function getAbsoluteCoords(target) {
  let svg_element = target;
  let x = 0;
  let y = 0;

  while(svg_element.id != 'game_svg_workspace') {
    x += parseFloat(svg_element.getAttribute('x'));
    y += parseFloat(svg_element.getAttribute('y'));

    svg_element = getTopLevelSVG(svg_element.parentNode);
  }

  return {
    'x': x,
    'y': y
  }
}

// adds onclick event to all children of an element
// calls recursively
function svg_add_onclickEvent(element, func) {
  element.onclick = func;
  element.classList.add('button_enabled');
  element.classList.remove('button_disabled');

  for(const child of element.children) {
    svg_add_onclickEvent(child, func);
  }
}

// adds onclick event to all children of an element
// calls recursively
function svg_remove_onclickEvent(element, func) {
  element.onclick = null;
  element.classList.remove('button_enabled');
  element.classList.add('button_disabled');

  for(const child of element.children) {
    svg_remove_onclickEvent(child, func);
  }
}

/* FOOTER BAR */

// contains buttons for the game
// and phase label
function createFooterBar(game_svg_workspace) {
  const width = game_svg_workspace.getAttribute('width');
  const height = game_svg_workspace.getAttribute('height');

  const container_footer = document.createElementNS(svgns, 'svg');
  game_svg_workspace.appendChild(container_footer);
  container_footer.id = 'container_footer';
  // svg attributes
  container_footer.setAttribute('width', width);
  container_footer.setAttribute('height', height * 0.05);
  container_footer.setAttribute('x', 0);
  container_footer.setAttribute('y', height * 0.95);

  // background
  const footer_background = document.createElementNS(svgns, 'rect');
  container_footer.appendChild(footer_background);
  // svg attributes
  footer_background.setAttribute('width', container_footer.getAttribute('width'));
  footer_background.setAttribute('height', container_footer.getAttribute('height'));
  footer_background.setAttribute('x', 0);
  footer_background.setAttribute('y', 0);
  footer_background.setAttribute('fill', 'pink');

  // phase label
  const footer_phaseLabel = document.createElementNS(svgns, 'svg');
  container_footer.appendChild(footer_phaseLabel);
  footer_phaseLabel.id = 'phaseLabel';
  footer_phaseLabel.setAttribute('width', container_footer.getAttribute('width') * 0.2);
  footer_phaseLabel.setAttribute('height', container_footer.getAttribute('height'));
  footer_phaseLabel.setAttribute('x', 0);
  footer_phaseLabel.setAttribute('y', container_footer.getAttribute('height') *
    0.5 - footer_phaseLabel.getAttribute('height') * 0.5);
  // background
  const phaseLabel_background = document.createElementNS(svgns, 'rect');
  footer_phaseLabel.appendChild(phaseLabel_background);
  // svg attributes
  phaseLabel_background.setAttribute('width', footer_phaseLabel.getAttribute('width'));
  phaseLabel_background.setAttribute('height', footer_phaseLabel.getAttribute('height'));
  phaseLabel_background.setAttribute('x', 0);
  phaseLabel_background.setAttribute('y', 0);
  phaseLabel_background.setAttribute('fill', 'blue');
  phaseLabel_background.setAttribute('stroke', 'black');
  // text
  const phaseLabel_text = document.createElementNS(svgns, 'text');
  footer_phaseLabel.appendChild(phaseLabel_text);
  phaseLabel_text.setAttribute('stroke', 'black');
  phaseLabel_text.textContent = 'Waiting for other players...';
  // svg attributes
  phaseLabel_text.setAttribute('x', footer_phaseLabel.getAttribute('width') *
    0.5 - phaseLabel_text.getComputedTextLength() / 2);
  phaseLabel_text.setAttribute('y', footer_phaseLabel.getAttribute('height') * 0.5);

  // end phase button
  const button_endPhase = new FooterButton('button_endPhase', endPhase, false,
    container_footer.getAttribute('width'),
    container_footer.getAttribute('height'), 'End phase');
  button_endPhase.draw();
}

function phaseLabel_setText(text) {
  // get elements
  const phaseLabel = document.getElementById('phaseLabel')
  const phaseLabel_text = phaseLabel.querySelector('text');
  // change text content
  phaseLabel_text.textContent = text;
  // reallign x position of text
  phaseLabel_text.setAttribute('x', phaseLabel.getAttribute('width') *
    0.5 - phaseLabel_text.getComputedTextLength() / 2);
}
