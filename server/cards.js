'use strict'

const cards = [
  {
    'name': 'air 1',
    'damage': 1,
    'mana': 1
    // hits 2 people
  },
  {
    'name': 'air 2',
    'damage': 2,
    'mana': 2
    // 50% dodge chance
  },
  {
    'name': 'air 3',
    'damage': 3,
    'mana': 3
    // 100% dodge chance
  },
  {
    'name': 'air 4',
    'damage': 4,
    'mana': 4
    // hits 2 people
  },
  {
    'name': 'water 1',
    'damage': 1,
    'mana': 1
    // healing: 1
  },
  {
    'name': 'water 2',
    'damage': 0,
    'mana': 2
    // aoe healing: 1
  },
  {
    'name': 'water 3',
    'damage': 3,
    'mana': 3
    // self heal: 3
  },
  {
    'name': 'water 4',
    'damage': 0,
    'mana': 4
    // heal: 8
  },
  {
    'name': 'earth 1',
    'damage': 1,
    'mana': 1
    // block: 1
  },
  {
    'name': 'earth 2',
    'damage': 0,
    'mana': 2
    // block: 4
  },
  {
    'name': 'earth 3',
    'damage': 5,
    'mana': 3
    // block: 2
  },
  {
    'name': 'earth 4',
    'damage': 2,
    'mana': 4
    // damage aoe- aoe block: 2
  },
  {
    'name': 'fire 1',
    'damage': 2,
    'mana': 1
    //
  },
  {
    'name': 'fire 2',
    'damage': 4,
    'mana': 2
    //
  },
  {
      'name': 'fire 3',
      'damage': 2,
      'mana': 3
      // damage aoe
  },
  {
      'name': 'fire 4',
      'damage': 10,
      'mana': 4
      // self damage: 4
  }

]

function myEffect() {
  console.log("my effect");
}

function getCards() {
  return cards;
}

module.exports = {
  getCards: getCards
}
