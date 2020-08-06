// abstract class for svgs
// draggable svgs are drawn at the top level
// the currently dragged svg is immediately redrawn at the top level so it can't disppear behind other elements
'use strict'

// svg namespace
const svgns = "http://www.w3.org/2000/svg";

// mouse position
let old_clientX;
let old_clientY;
// for snapback
let old_position_x;
let old_position_y;

class SVG {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  // gets top level svg element from inner svg element
  static getTopLevelSVG(node) {
    while(node.nodeName != 'svg') {
      node = node.parentNode;
    }
    return node;
  }

  static getCoords(ev, topLevel) {
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

  static getAbsoluteCoords(target) {
    let svg_element = target;
    let x = 0;
    let y = 0;

    while(svg_element.id != 'game_svg_workspace') {
      x += parseFloat(svg_element.getAttribute('x'));
      y += parseFloat(svg_element.getAttribute('y'));

      svg_element = SVG.getTopLevelSVG(svg_element.parentNode);
    }

    return {
      'x': x,
      'y': y
    }
  }
}
