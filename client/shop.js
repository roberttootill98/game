// functions to do with the shop
// shop is a modal window
'use strict';

async function promptShop() {
  displayShop(await getShopSpells());
}

// gets items for shop from server
//
async function getShopSpells() {
  // in-memory, temp
  return [
    {
      'name': 'hot squat',
      'element': 'fire',
      'cost': '£250',
      'icon': '/assets/spells/hotSquat.png'
    },
    {
      'name': 'freeze',
      'element': 'water',
      'cost': '£420',
      'icon': '/assets/spells/freeze.png'
    },
    {
      'name': 'shield',
      'element': 'none',
      'cost': '£100',
      'icon': '/assets/spells/shield.png'
    }
  ]
}

function displayShop(spells) {
  const shopContainer = document.createElement('div');
  document.body.appendChild(shopContainer);
  shopContainer.id = 'shop_container';
  //shopContainer.classList.add('modalWindow');

  for(let i = 0; i < spells.length; i++) {
    const spell = spells[i];

    // container for spell
    const spellContainer = document.createElement('div');
    shopContainer.appendChild(spellContainer);
    spellContainer.id = 'shop_spell' + i;
    spellContainer.classList.add('shop_spellContainer');
    spellContainer.classList.add(spell.element);
    // content
    // name
    const name = document.createElement('h3');
    spellContainer.appendChild(name);
    name.textContent = spell.name;
    // icon
    const icon = document.createElement('img');
    spellContainer.appendChild(icon);
    icon.classList.add('shop_spell');
    icon.src = spell.icon;
    icon.draggable = true; // only add if money is valid
    // cost
    const cost = document.createElement('p');
    spellContainer.appendChild(cost);
    cost.textContent = spell.cost;

    // drag event listeners
    //icon.addEventListener('dragover', icon_dragover);
    icon.addEventListener('dragend', icon_dragEnd);
  }
}

// tranfers spell from shop to companion
async function icon_dragEnd(ev) {
  console.log("icon drag ended!");
}
