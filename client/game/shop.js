// functions to do with the shop
// shop is a modal window
'use strict';

function add_shopButtons() {
  // add open shop button to footer
  const openButton = document.createElement('button');
  document.getElementById('container_footerButtons').appendChild(openButton);
  openButton.id = 'shop_openButton';
  openButton.classList.add('button');
  openButton.textContent = 'Open shop';
  openButton.onclick = promptShop;
  // disabled because shop opens by on phase start
  openButton.disabled = true;
  openButton.classList.add('button_disabled');
}

async function promptShop() {
  // shop container
  const shopContainer = document.createElement('div');
  document.body.appendChild(shopContainer);
  shopContainer.id = 'shop_container';
  shopContainer.classList.add('modalWindow');

  // close button
  const closeButton = document.createElement('button');
  shopContainer.appendChild(closeButton);
  closeButton.id = 'shop_closeButton';
  closeButton.classList.add('button');
  closeButton.textContent = 'X';
  closeButton.onclick = closeShop;

  displaySpells(await getShopCards());
}

function closeShop() {
  document.getElementById('shop_container').remove();

  const openButton = document.getElementById('shop_openButton');
  openButton.disabled = false;
  openButton.classList.remove('button_disabled');
}

function displaySpells(spells) {
  const shopContainer = document.getElementById('shop_container');

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
    name.id = spell.name;
    name.textContent = spell.name;
    // icon
    const icon = document.createElement('img');
    spellContainer.appendChild(icon);
    icon.id = spell.name;
    icon.classList.add('shop_spell');
    icon.src = '/assets/spells/' + spell.icon;
    icon.draggable = true; // only add if money is valid
    // cost
    const cost = document.createElement('p');
    spellContainer.appendChild(cost);
    cost.textContent = spell.cost;

    // drag event listeners
    icon.addEventListener('dragstart', spell_icon_dragstart);
    icon.addEventListener('dragend', spell_icon_dragend);
  }
}

function spell_icon_dragstart(ev) {
  // encapsulate data
  ev.dataTransfer.setData('text/plain', ev.target.id);
  console.log("starting drag");
  // change cursor
}

function spell_icon_dragend(ev) {
  console.log('drag ended');
}
