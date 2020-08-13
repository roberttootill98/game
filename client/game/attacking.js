// functions todo with the attacking phase
'use strict';

async function start_phase_attacking() {
  const attacker = await getAttacker();
  // + 5 to ignore opponent companions
  const companion = Companion.getByID(attacker + 5);

  // highlight attacking companion
  companion.svg.setAttribute('stroke', 'yellow');

  // add listeners to card slots for attacking companion
  for(const cardSlot of companion.cardSlots) {
    await cardSlot.addListeners();
  }

  console.log();
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
