// functions to do with cards

'use strict'

// name and icon are unique
const cards = [
  {
    'name': 'air_1',
    'element': 'air',
    'cost': {
      'mana': 1
    },
    'damage': 1,
    'target': ['enemy']
    // hits 2 people
  },
  {
    'name': 'air_2',
    'element': 'air',
    'cost': {
      'mana': 2
    },
    'damage': 2,
    'target': ['enemy']
    // 50% dodge chance
  },
  {
    'name': 'air_3',
    'element': 'air',
    'cost': {
      'mana': 1,
    },
    'heal': 2,
    'target': ['self', 'ally']
    // 100% dodge chance
  },
  {
    'name': 'air 4',
    'element': 'air',
    'damage': 4,
    'mana': 4
    // hits 2 people
  },
  {
    'name': 'water 1',
    'element': 'water',
    'damage': 1,
    'mana': 1
    // healing: 1
  },
  {
    'name': 'water 2',
    'element': 'water',
    'damage': 0,
    'mana': 2
    // aoe healing: 1
  },
  {
    'name': 'water 3',
    'element': 'water',
    'damage': 3,
    'mana': 3
    // self heal: 3
  },
  {
    'name': 'water 4',
    'element': 'water',
    'damage': 0,
    'mana': 4
    // heal: 8
  },
  {
    'name': 'earth 1',
    'element': 'earth',
    'damage': 1,
    'mana': 1
    // block: 1
  },
  {
    'name': 'earth 2',
    'element': 'earth',
    'damage': 0,
    'mana': 2
    // block: 4
  },
  {
    'name': 'earth 3',
    'element': 'earth',
    'damage': 5,
    'mana': 3
    // block: 2
  },
  {
    'name': 'earth 4',
    'element': 'earth',
    'damage': 2,
    'mana': 4
    // damage aoe- aoe block: 2
  },
  {
    'name': 'fire 1',
    'element': 'fire',
    'damage': 2,
    'mana': 1
    //
  },
  {
    'name': 'fire 2',
    'element': 'fire',
    'damage': 4,
    'mana': 2
    //
  },
  {
    'name': 'fire 3',
    'element': 'fire',
    'damage': 2,
    'mana': 3
    // damage aoe
  },
  {
    'name': 'fire 4',
    'element': 'fire',
    'damage': 10,
    'mana': 4
    // self damage: 4
  }
]

function myEffect() {
  console.log("my effect");
}

// gets all cards
exports.getCards = function() {
  return cards;
}

exports.getCard_name = function(name) {
  for(const card of cards) {
    if(card.name == name) {
      return card;
    }
  }
}
