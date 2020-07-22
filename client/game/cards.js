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
function buildCardSVG_full(card, target, width, height, x, y) {
  // container
  const card_svg = document.createElementNS(svgns, 'svg');
  target.appendChild(card_svg);
  card_svg.classList.add('draggable');
  card_svg.setAttribute('width', width);
  card_svg.setAttribute('height', height);
  card_svg.setAttribute('x', x);
  card_svg.setAttribute('y', y);

  // add event listeners
  card_svg.addEventListener('mousedown', startDrag);
  card_svg.addEventListener('mousemove', drag);
  card_svg.addEventListener('mouseup', endDrag);
  card_svg.addEventListener('mouseleave', endDrag);

  // main card
  // covers complete size of svg
  const card_rect = document.createElementNS(svgns, 'rect');
  card_svg.appendChild(card_rect);
  card_rect.classList.add('draggable');
  card_rect.setAttribute('width', width);
  card_rect.setAttribute('height', height);
  card_rect.setAttribute('fill', element_colours[card.element]);
  card_rect.setAttribute('stroke', 'black');

  // name container

  // name text
  const name_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(name_text);
  name_text.classList.add('draggable');
  name_text.textContent = card.name;
  name_text.setAttribute('x', width * 0.5 - name_text.getComputedTextLength() / 2);
  name_text.setAttribute('y', height * 0.6);
  name_text.setAttribute('stroke', 'black');

  // container for cost, damage and mana info
  // header line for container
  const header_line = document.createElementNS(svgns, 'line');
  const header_line_height = height * 0.75;
  card_svg.appendChild(header_line);
  header_line.classList.add('draggable');
  header_line.setAttribute('x1', 0);
  header_line.setAttribute('y1', header_line_height);
  header_line.setAttribute('x2', width);
  header_line.setAttribute('y2', header_line_height);
  header_line.setAttribute('stroke', 'black');
  // vertical line 1
  const vertical_line_1 = document.createElementNS(svgns, 'line');
  card_svg.appendChild(vertical_line_1);
  vertical_line_1.classList.add('draggable');
  vertical_line_1.setAttribute('x1', width * (1/3));
  vertical_line_1.setAttribute('y1', header_line_height);
  vertical_line_1.setAttribute('x2', width * (1/3));
  vertical_line_1.setAttribute('y2', height);
  vertical_line_1.setAttribute('stroke', 'black');
  // vertical line 2
  const vertical_line_2 = document.createElementNS(svgns, 'line');
  card_svg.appendChild(vertical_line_2);
  vertical_line_2.classList.add('draggable');
  vertical_line_2.setAttribute('x1', width * 2 * (1/3));
  vertical_line_2.setAttribute('y1', header_line_height);
  vertical_line_2.setAttribute('x2', width * 2 * (1/3));
  vertical_line_2.setAttribute('y2', height);
  vertical_line_2.setAttribute('stroke', 'black');

  // text in container for cost, damage and mana
  // cost
  const card_cost_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(card_cost_text);
  card_cost_text.classList.add('draggable');
  card_cost_text.textContent = '£69';
  card_cost_text.setAttribute('x', width * (1/6) - card_cost_text.getComputedTextLength() / 2);
  card_cost_text.setAttribute('y', header_line_height + (height - header_line_height) / 2);
  card_cost_text.setAttribute('fill', 'gold');
  // damage
  const card_damage_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(card_damage_text);
  card_damage_text.classList.add('draggable');
  card_damage_text.textContent = card.damage;
  card_damage_text.setAttribute('x', width * 0.5 - card_damage_text.getComputedTextLength() / 2);
  card_damage_text.setAttribute('y', header_line_height + (height - header_line_height) / 2);
  card_damage_text.setAttribute('fill', 'red');
  // mana
  const card_mana_text = document.createElementNS(svgns, 'text');
  card_svg.appendChild(card_mana_text);
  card_mana_text.classList.add('draggable');
  card_mana_text.textContent = card.damage;
  card_mana_text.setAttribute('x', width * 5 * (1/6) - card_mana_text.getComputedTextLength() / 2);
  card_mana_text.setAttribute('y', header_line_height + (height - header_line_height) / 2);
  card_mana_text.setAttribute('fill', 'mana');

  return card_svg;
}

function buildCardSVG_miniature(card, target, width, height, x, y) {
  const card_svg = document.createElementNS(svgns, 'svg');
  target.appendChild(card_svg);
  card_svg.setAttribute('width', width);
  card_svg.setAttribute('height', height);
  card_svg.setAttribute('x', x);
  card_svg.setAttribute('y', y);

  // background
  const card_background = document.createElementNS(svgns, 'rect');
  card_svg.appendChild(card_background);
  // svg attributes
  card_background.setAttribute('width', width);
  card_background.setAttribute('height', height);
  card_background.setAttribute('x', 0);
  card_background.setAttribute('y', 0);
  card_background.setAttribute('fill', 'purple');
  card_background.setAttribute('stroke', 'black');

  // make icon using lookup table functions

  // event listeners

  return card_svg;
}

let currently_dragged_svg = null;
let old_clientX;
let old_clientY;

// gets top level svg element from inner svg element
function getTopLevelSVG(node) {
  while(node.nodeName != 'svg') {
    node = node.parentNode;
  }
  return node;
}

// checks if an element is draggable
function checkIfDraggable(node) {
  return node.classList.contains('draggable');
}

// checks if the current element is being dragged
function currentDragging(node) {
  return node.classList.contains('dragging');
}

function startDrag(ev) {
  if(checkIfDraggable(ev.target)) {
    // indicate that current svg is being dragged
    const topLevel = getTopLevelSVG(ev.target);
    currently_dragged_svg = topLevel;

    old_clientX = ev.clientX;
    old_clientY = ev.clientY;
  }
}

function getCoords(ev, topLevel) {
  // from (0, 0)
  const old_x = topLevel.getAttribute('x');
  const old_y = topLevel.getAttribute('y');

  const x_mousePosition_relative = old_clientX - old_x;
  const y_mousePosition_relative = old_clientY - old_y;

  // new position of top left of card
  const new_x = ev.clientX - x_mousePosition_relative;
  const new_y = ev.clientY - y_mousePosition_relative;

  return {
    'x': new_x,
    'y': new_y
  };
}

function drag(ev) {
  if(currently_dragged_svg && checkIfDraggable(ev.target)) {
    ev.preventDefault();

    // update co-ords of svg to mouse position
    const topLevel = getTopLevelSVG(ev.target);
    const coord = getCoords(ev, topLevel);
    topLevel.setAttribute('x', coord.x);
    topLevel.setAttribute('y', coord.y);

    old_clientX = ev.clientX;
    old_clientY = ev.clientY;
  }
}

function endDrag(ev) {
  if(currently_dragged_svg && checkIfDraggable(ev.target)) {
    // if placed over thing that it can dropped into
    if(ev.target) {
      // data transfer
    } else {
      // snapback
    }

    // indicate that drag is finished on current svg
    currently_dragged_svg = null;
  }
}

// testing
async function createAirCard() {
  buildCardSVG_full(await getCard('air 1'), document.body, 100, 200);
}

async function createAirCard_small() {
  buildCardSVG_miniature(await getCard('air 1'), document.body, 20, 30);
}
