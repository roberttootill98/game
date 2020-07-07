// dom gameboard functions
'use strict'

// creates dom for game board
async function createGameBoard() {
  console.log("creating game board");

  const gameContainer = document.createElement('div');
  document.body.appendChild(gameContainer);
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
      spellSlot.classList.add('spell' + j);
      spellSlot.classList.add('spell');

      // drag events
      spellSlot.addEventListener('dragover', icon_dragover);
      spellSlot.addEventListener('dragleave', icon_dragleave);

      if(spell) {
        spellSlot.textContent = spell.name;
        spellSlot.classList.add(spell.element);
      }
    }
  }
}

// fires when a spell is dragged from the shop over a spell slot
// highlight if drop location is valid
async function icon_dragover(ev) {
  ev.preventDefault();
  ev.target.classList.add('spell_dragover');
}

// fires when a spell is dragged away from the shop over a spell slot
// highlight if drop location is valid
async function icon_dragleave(ev) {
  ev.target.classList.remove('spell_dragover');
}
