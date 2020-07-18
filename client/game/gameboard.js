// dom gameboard functions
'use strict'

// creates dom for game board
async function createGameBoard() {
  console.log("creating game board");

  const gameContainer = document.createElement('div');
  document.getElementById('main').appendChild(gameContainer);
  gameContainer.id = 'gameContainer';

  // create opposition side
  const oppositionContainer = document.createElement('div');
  gameContainer.appendChild(oppositionContainer);
  oppositionContainer.id = 'oppositionContainer';
  oppositionContainer.classList.add('sideContainer');
  // add companions
  const oppositionCompanions = await getCompanions();
  createCompanions(oppositionContainer, oppositionCompanions);

  // battlefield container
  const battlefieldContainer = document.createElement('div');
  gameContainer.appendChild(battlefieldContainer);
  battlefieldContainer.id = 'battlefieldContainer';

  // create player side
  const playerContainer = document.createElement('div');
  gameContainer.appendChild(playerContainer);
  playerContainer.id = 'playerContainer';
  playerContainer.classList.add('sideContainer');

  const container_footerButtons = document.createElement('div');
  gameContainer.appendChild(container_footerButtons);
  container_footerButtons.id = 'container_footerButtons';

  add_footerButtons(container_footerButtons);

  // add companions
  const playerCompanions = await getCompanions();
  createCompanions(playerContainer, playerCompanions);
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

// should get companion data and create them according to state
function createCompanions(container, companions) {
  // in memory data
  for(let i = 0; i < companions.length; i++) {
    const companion = companions[i];

    const companionContainer = document.createElement('div');
    container.appendChild(companionContainer);
    companionContainer.classList.add('companionContainer');
    companionContainer.classList.add('companion' + i);

    // header
    const header = document.createElement('div');
    companionContainer.appendChild(header);
    header.classList.add('header');
    // name
    const name = document.createElement('p');
    header.appendChild(name);
    name.textContent = companion.name;

    // main area
    // icon
    const icon = document.createElement('div');
    companionContainer.appendChild(icon);
    icon.classList.add('icon');
    icon.textContent = 'companion icon';

    // spells, always create 4 slots, may not all be filled
    for(let j = 0; j < companion.spells.length; j++) {
      const spell = companion.spells[j];

      const spellSlot = document.createElement('div');
      companionContainer.appendChild(spellSlot);
      spellSlot.id = 'spellSlot' + j;
      spellSlot.classList.add('spell');

      // drag events
      spellSlot.addEventListener('dragover', spellSlot_dragover);
      spellSlot.addEventListener('dragleave', spellSlot_dragleave);
      spellSlot.addEventListener('drop', spellSlot_drop);

      if(spell) {
        spellSlot.textContent = spell.name;
        spellSlot.classList.add(spell.element);
      }
    }
  }
}

// fires when a spell is dragged from the shop over a spell slot
// highlight if drop location is valid
async function spellSlot_dragover(ev) {
  ev.preventDefault();
  ev.target.classList.add('spell_dragover');
}

// fires when a spell is dragged away from the shop over a spell slot
// highlight if drop location is valid
async function spellSlot_dragleave(ev) {
  ev.target.classList.remove('spell_dragover');
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
