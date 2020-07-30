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

    // spell slots
    for(const [j, spell] of companion.spells.entries()) {
      const card = {
        'width': container_companion.getAttribute('width') * 0.35,
        'height': container_companion.getAttribute('height') * 0.8 * 0.25,
        'x':container_companion.getAttribute('width') * 0.65,
        'y': container_companion.getAttribute('height') * 0.2 + container_companion.getAttribute('height') * 0.8 * 0.25 * j
      };

      if(spell) {
        // if there is a spell the contents of this is filled with
        const mini_card_svg = buildCardSVG_miniature(spell, container_companion, card.width, card.height, card.x, card.y);
        mini_card_svg.id = 'spellSlot' + j;
        mini_card_svg.classList.add('spellSlot_filled');
      } else {
        // if not then make an empty spell slot
        const spellSlot = document.createElementNS(svgns, 'svg');
        container_companion.appendChild(spellSlot);
        spellSlot.id = 'spellSlot' + j;
        spellSlot.classList.add('spellSlot_empty');
        // svg attributes
        spellSlot.setAttribute('width', card.width);
        spellSlot.setAttribute('height', card.height);
        spellSlot.setAttribute('x', card.x);
        spellSlot.setAttribute('y', card.y);

        // background
        const spellSlot_background = document.createElementNS(svgns, 'rect');
        spellSlot.appendChild(spellSlot_background);
        // svg attributes
        spellSlot_background.setAttribute('width', spellSlot.getAttribute('width'));
        spellSlot_background.setAttribute('height', spellSlot.getAttribute('height'));
        spellSlot_background.setAttribute('fill', 'pink');
        spellSlot_background.setAttribute('stroke', 'black');

        // event listeners
        //spellSlot.addEventListener('mouseover', spellSlot_mouseover);
        //spellSlot.addEventListener('mouseleave', spellSlot_mouseleave);

        spellSlots.push(spellSlot);
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

// checks if given (x, y) position is within any of the spell slots
function spellSlot_inRange(coords) {
  // coords.x, coords.y
  // coords are absolute

  for(const [i, spellSlot] of spellSlots.entries()) {
    // get absolute spellSlot coords
    const spellSlot_coords = spellSlot_getAbsoluteCoords(spellSlot);
    const width = parseFloat(spellSlot.getAttribute('width'));
    const height = parseFloat(spellSlot.getAttribute('height'));

    if((coords.x >= spellSlot_coords.x) &&
      (coords.x <= (spellSlot_coords.x + width)) &&
      (coords.y >= spellSlot_coords.y) &&
      (coords.y <= (spellSlot_coords.y + height))) {
        return spellSlot;
    }
  }

  // failed to find any spellSlots which the coords fit inside
  return false;
}

function spellSlot_getAbsoluteCoords(spellSlot) {
  let svg_element = spellSlot;
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

// keeps track of the last spell slot moused over
let current_spellSlot_mouseover;

// fires when a spell is dragged from the shop over a spell slot
// highlight if drop location is valid
async function spellSlot_mouseover(ev) {
  if(currently_dragged_card_svg) {
    ev.preventDefault();
    ev.target.classList.add('spell_mouseover');
    current_spellSlot_mouseover = ev.target;
  }
}

// fires when a spell is dragged away from the shop over a spell slot
// highlight if drop location is valid
async function spellSlot_mouseleave(ev) {
  if(currently_dragged_card_svg) {
    ev.preventDefault();
    ev.target.classList.remove('spell_mouseover');
    current_spellSlot_mouseover = null;
  }
}

async function spellSlot_drop(ev) {
  ev.preventDefault();

  // get info
  const spellSlot = ev.target;
  const spellName = ev.dataTransfer.getData('text/plain');

  // check if purchase is valid
  // validate move via server

  // check if spell slot is full
  // prompt are you window

  // reduce money

  // remove card from shop
  document.getElementById(spellName).parentNode.remove();
  // fill spell slot with card
  const card = await getCard(spellName);
  spellSlot.id = card.name;
  spellSlot.src = card.icon;
}

function spellSlot_removeHighlighting() {
  // strip all spell slots of highlighting
  for(const spellSlot of document.querySelectorAll('.spellSlot_highlighted')) {
    spellSlot.classList.remove('spellSlot_highlighted');
    spellSlot.querySelector('rect').setAttribute('fill', 'pink');
  }
}

/* FOOTER BAR */


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
  footer_background.setAttribute('width', width);
  footer_background.setAttribute('height', height * 0.05);
  footer_background.setAttribute('x', 0);
  footer_background.setAttribute('y', 0);
  footer_background.setAttribute('fill', 'pink');

  // end phase button
}

function add_footerButtons(container_footerButtons) {
  // phase label
  const phaseLabel = document.createElement('p');
  container_footerButtons.appendChild(phaseLabel);
  phaseLabel.id = 'phaseLabel';
  phaseLabel.classList.add('label');
  phaseLabel.textContent = 'Phase: Shop'; // always starts with this phase

  // end phase button
  const button_endPhase = document.createElement('button');
  container_footerButtons.appendChild(button_endPhase);
  button_endPhase.id = 'button_endPhase';
  button_endPhase.classList.add('button');
  button_endPhase.textContent = 'END PHASE';
  button_endPhase.onclick = endPhase;
  // disabled until the player has control
  button_endPhase.disabled = true;
  button_endPhase.classList.add('button_disabled');
}
