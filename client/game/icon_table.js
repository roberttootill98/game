// contains the icon table
// this is a collection of the functions required to draw each card's icon
// each function returns an svg that can be appended to a card
// each functions requires a target, width and height
// all icons must be drawn at _:_ ratio
// to get a particular icon do `icon_table.${cardName}`;
'use strict'

const icon_table = {};

// will try to draw with name passed, otherwise will use default
icon_table.draw = function(name, target, width, height) {
  if(icon_table[name]) {
    return icon_table[name](target, width, height);
  } else {
    return icon_table.default(target, width, height);
  }
}

icon_table.default = function(target, width, height) {
  // container
  const icon_container = document.createElementNS(svgns, 'svg');
  target.appendChild(icon_container);
  icon_container.classList.add('card_icon');
  icon_container.setAttribute('width', width);
  icon_container.setAttribute('height', height);

  const icon_background = document.createElementNS(svgns, 'rect');
  icon_container.appendChild(icon_background);
  icon_background.setAttribute('width', width);
  icon_background.setAttribute('height', height);
  icon_background.setAttribute('x', 0);
  icon_background.setAttribute('y', 0);
  icon_background.setAttribute('stroke', 'white');
  icon_background.setAttribute('fill', 'black');

  return icon_container;
}
