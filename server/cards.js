'use strict'

const cards = [
  {
    'name': 'demo',
    'damage': 1,
    'mana': 2,
    // description of card effect
    'effect': myEffect
  },
  {
    'name': 'daniel',
    'attack': 69,
    'defense': 2
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
