// contains the icon table
// this is a collection of the functions required to draw each card's icon
// each function returns an svg that can be appended to a card
// each functions requires a target, width and height
// all icons must be drawn at _:_ ratio
// to get a particular icon do `icon_table.${cardName}`;
'use strict'

const icon_table = {};

icon_table.default = function(target, width, height) {
  // container
  const icon_container = document.createElementNS(svgns, 'svg');
  target.appendChild(icon_container);
  icon_container.classList.add('card_icon');
  icon_container.setAttribute('width', width);
  icon_container.setAttribute('height', height);

  return icon_container;
}
