// functions todo with the attacking phase
'use strict';

async function start_phase_attacking() {
  const attacker = await getAttacker();
  // + 5 to ignore opponent companions
  const companion = Companion.getByID(attacker + 5);

  // highlight attacking companion
  companion.highlight();

  // add listeners to card slots for attacking companion
  for(const cardSlot of companion.cardSlots) {
    await cardSlot.addListeners();
  }
}

function teardown_phase_attacking() {
  // disable end phase button, it is now the opponent's phases
  FooterButton.getByID('button_endPhase').disable();

  Companion.removeHighlighting();
  CardSlot.removeHighlighting();
}

// as index, 0-3
async function getAttacker() {
  const response = await fetch('/api/game/attacking/companion');
  if(response.ok) {
    return (await response.json()).index;
  } else {
    console.error("failed to get attacker");
  }
}

function attacking_onmouseover(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target,
    ['cardSlot_empty', 'cardSlot_filled']);
  const companion = Companion.getByID(topLevel.id);
  companion.highlight();
}

function attacking_onmouseleave(ev) {
  Companion.removeHighlighting();
}

async function self_onmousedown(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target);

  if(!topLevel.classList.contains('cardSlot_filled')) {
    console.log("casting on self...");

    executeCard(clicked_cardSlot.card, clicked_cardSlot.companion,
      clicked_cardSlot.companion);
  }
}

async function ally_onmousedown(ev) {
  console.log("casting on ally");

  const topLevel = SVG.getTopLevelSVG(ev.target,
    ['cardSlot_empty', 'cardSlot_filled']);

  executeCard(clicked_cardSlot.card, clicked_cardSlot.companion,
    Companion.getByID(topLevel.id));
}

async function opponent_onmousedown(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target,
    ['cardSlot_empty', 'cardSlot_filled']);

  executeCard(clicked_cardSlot.card, clicked_cardSlot.companion,
    Companion.getByID(topLevel.id));
}

/**
 * generic function for executing a cards effect to be used in all types of card cast
 * @param {json} card, the card being used
 * @param {Companion} user, the user of the card
 * @param {Companion} target, the target of the cards use
 */
async function executeCard(card, user, target) {
  if(card.damage) {
    // execute card damage
    target.setHealth(target.health -
      card.damage);
  }
  if(card.heal) {
    target.setHealth(target.health + card.heal);
  }

  // execute card effect


  // execute card cost
  // it has already been checked that the user can afford the cost
  user.setMana(user.mana - card.cost.mana);

  if(target.health >= 0) {
    console.log("companion dead");
  }

  // tear down
  clicked_cardSlot = null;
  CardSlot.removeHighlighting();
  Companion.removeHighlighting();
  // remove listeners
}
