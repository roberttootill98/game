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
  /**
   * creates an SVG
   * @constructor
   * @param {float} width, of SVG
   * @param {float} height, of SVG
   * @param {float} x, position of SVG
   * @param {float} y, position of SVG
   */
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  /**
   * gets top level svg element from inner svg element
   * @param {node} node, the starting node
   * @param {<string>} classes, list of class names to be added to predefined excluded classes
   * @param {<string>} ids, list of ids to be added to predefined excluded ids
   * @returns {node} the top level node
   */
  static getTopLevelSVG(node, classes, ids) {
    // list of strings that refer to classes that should be ignored when looking for top level svg
    // svg within svgs that are not top level svgs
    const excludedClasses = [
      'card_icon',
      'card_attribute_text',
      'container_companion_name',
      'container_companion_health',
      'container_companion_mana',
      'container_companion_icon'
    ].concat(classes);
    const excludedIDs = [
      'shopConfirm_yes',
      'shopConfirm_no'
    ].concat(ids);

    // checks if an element has at least one excluded class
    function checkForExcludedClass(element) {
      for(const excludedClass of excludedClasses) {
        if(element.classList.contains(excludedClass)) {
          return true;
        }
      }
    }

    while(node.nodeName != 'svg' || checkForExcludedClass(node) ||
      excludedIDs.includes(node.id)) {
      node = node.parentNode;
    }
    return node;
  }
  
  /**
   * gets the absolute coordinates of a given element relative to the game svg workspace
   * @param {element} target, the element we are retrieving the coordinates of
   * @returns {json} containing x and y values
   */
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

  /**
   * Adds class to all elements contained within an svg
   * calls recursively
   * @param {element} element, the element that needs to have the class
   * @param {string} className, the DOM class that is added to class list
   */
  static addClass(element, className) {
    element.classList.add(className);
    for(const child of element.children) {
      SVG.addClass(child, className);
    }
  }

  /**
   * Adds class to all elements contained within an svg
   * calls recursively
   * @param {element} element, the element that needs to have the class removed
   * @param {string} className, the DOM class that is removed from the class list
   */
  static removeClass(element, className) {
    element.classList.remove(className);
    for(const child of element.children) {
      SVG.removeClass(child, className);
    }
  }

  /**
   * adds onclick event to all children of an element and the element
   * calls recursively
   * @param {element} element, the element we are adding the event to
   * @param {function} func, the function called when the event is run
   */
  static add_onclickEvent(element, func) {
    element.onclick = func;
    element.classList.add('button_enabled');
    element.classList.remove('button_disabled');

    for(const child of element.children) {
      SVG.add_onclickEvent(child, func);
    }
  }

  /**
   * removes onclick event from all children of an element and the element
   * calls recursively
   * @param {element} element, the element we are remove the event from
   */
  static remove_onclickEvent(element) {
    element.onclick = null;
    element.classList.remove('button_enabled');
    element.classList.add('button_disabled');

    for(const child of element.children) {
      SVG.remove_onclickEvent(child);
    }
  }
}
