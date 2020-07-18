// functions to do with cards

'use strict'

// gets card details using
async function getCard(name) {
  const response = await fetch(`/api/card?name=${name}`);
  if(response.ok) {
    return await response.json();
  } else {
    console.error("card not found");
  }
}

// gets items for shop from server
async function getShopCards() {
  const response = await fetch('/api/cards_shop');
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to get shop cards");
  }
}

const element_colours = {
  'air': '#823451',
  'water': '#123456',
  'earth': '#154328',
  'fire': '#654321'
};

// builds svg of card using card object
function buildCardSVG(card, width, height) {
  const svgns = "http://www.w3.org/2000/svg";

  const card_svg = document.createElementNS(svgns, 'svg');
  card_svg.setAttribute('width', width);
  card_svg.setAttribute('height', height);

  // main card
  // covers complete size of svg
  const card_rect = document.createElementNS(svgns, 'rect');
  card_svg.appendChild(card_rect);
  card_rect.setAttribute('width', width);
  card_rect.setAttribute('height', height);
  card_rect.setAttribute('fill', element_colours[card.element]);

  // damage
  // container
  const card_damage = document.createElementNS(svgns, 'circle');
  card_svg.appendChild(card_damage);
  card_damage.setAttribute('cx', 17.5);
  card_damage.setAttribute('cy', 17.5);
  card_damage.setAttribute('r', 15);
  card_damage.setAttribute('fill', 'red');
  card_damage.setAttribute('stroke', 'black');
  card_damage.setAttribute('stroke-width', 1);
  // text
  const card_damage_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(card_damage_text);
  card_damage_text.setAttribute('x', 13);
  card_damage_text.setAttribute('y', 22);
  card_damage_text.setAttribute('fill', 'black');
  card_damage_text.textContent = card.damage;

  // mana
  // container
  const card_mana = document.createElementNS(svgns, 'circle');
  card_svg.appendChild(card_mana);
  card_mana.setAttribute('cx', width - 17.5);
  card_mana.setAttribute('cy', 17.5);
  card_mana.setAttribute('r', 15);
  card_mana.setAttribute('fill', 'blue');
  card_mana.setAttribute('stroke', 'black');
  card_mana.setAttribute('stroke-width', 1);
  // text
  // text
  const card_mana_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(card_mana_text);
  card_mana_text.setAttribute('x', width - 21);
  card_mana_text.setAttribute('y', 22);
  card_mana_text.setAttribute('fill', 'black');
  card_mana_text.textContent = card.mana;

  // effect text
  return card_svg;
}

async function createAirCard() {
  document.body.appendChild(buildCardSVG(await getCard('air 1'), 100, 200));
}
