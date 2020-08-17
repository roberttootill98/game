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

  console.log();
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
  const topLevel = SVG.getTopLevelSVG(ev.target);
  const companion = Companion.getByID(topLevel.id);
  companion.highlight();
}

function attacking_onmouseleave(ev) {
  Companion.removeHighlighting();
}

async function self_onmousedown(ev) {

}

async function ally_onmousedown(ev) {

}

async function opponent_onmousedown(ev) {
  const topLevel = SVG.getTopLevelSVG(ev.target);
  const player_companion = clicked_cardSlot.companion;
  const opponent_companion = Companion.getByID(topLevel.id);

  if(clicked_cardSlot.damage) {
    // execute card damage
    opponent_companion.setHealth(opponent_companion.health -
      clicked_cardSlot.card.damage);
  }

  // execute card effect


  // execute card cost
  player_companion.setMana(player_companion.mana - clicked_cardSlot.card.mana);

  if(opponent_companion >= 0) {
    console.log("companion dead");
  }

  // tear down
  clicked_cardSlot = null;
  CardSlot.removeHighlighting();
  Companion.removeHighlighting();
}
