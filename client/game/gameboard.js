// dom gameboard functions
'use strict'

const element_colours = {
  'air': '#823451',
  'water': '#123456',
  'earth': '#154328',
  'fire': '#654321'
};

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
    const companionObj = new Companion(side_type, i, companion.name,
      companion.health, companion.mana, companion.cards);
    companionObj.draw(container_side);
  }

  return container_side;
}

async function getCompanions() {
  return [
    {
      'name': 'aang',
      'health': 5,
      'mana': 7,
      'cards': [
        await Card.getCardDetails('air 1'),
        await Card.getCardDetails('air 3'),
        null,
        null
      ]
    },
    {
      'name': 'katara',
      'health': 5,
      'mana': 7,
      'cards': [
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
      'health': 5,
      'mana': 7,
      'cards': [
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
      'health': 5,
      'mana': 7,
      'cards': [
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

/* FOOTER BAR */

// contains buttons for the game
// and phase label
function createFooterBar(game_svg_workspace) {
  const width = game_svg_workspace.getAttribute('width');
  const height = game_svg_workspace.getAttribute('height');

  const container_player = document.getElementById('container_player');
  const container_player_y_end = parseFloat(container_player.getAttribute('y')) +
    parseFloat(container_player.getAttribute('height'))

  const container_footer = document.createElementNS(svgns, 'svg');
  game_svg_workspace.appendChild(container_footer);
  container_footer.id = 'container_footer';
  // svg attributes
  container_footer.setAttribute('width', width);
  container_footer.setAttribute('height',
    parseFloat(game_svg_workspace.getAttribute('height')) -
    container_player_y_end);
  container_footer.setAttribute('x', 0);
  container_footer.setAttribute('y', container_player_y_end);

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
  phaseLabel_text.textContent = 'Waiting for other players...';
  // svg attributes
  phaseLabel_text.setAttribute('x', '50%');
  phaseLabel_text.setAttribute('y', '50%');
  phaseLabel_text.setAttribute('alignment-baseline', 'middle');
  phaseLabel_text.setAttribute('text-anchor', 'middle');
  phaseLabel_text.setAttribute('stroke', 'black');

  // end phase button
  const button_endPhase = new FooterButton('button_endPhase', endPhase, false,
    'End phase', container_footer.getAttribute('width'),
    container_footer.getAttribute('height'));
  button_endPhase.draw();
}

function phaseLabel_setText(text) {
  // get elements
  const phaseLabel = document.getElementById('phaseLabel')
  const phaseLabel_text = phaseLabel.querySelector('text');
  // change text content
  phaseLabel_text.textContent = text;
}
