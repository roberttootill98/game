// lookup table for functions for card effects
// keys are card names
'use strict';

const card_effects = {};

card_effects.default = function() {
  console.log("default card effect");
}

card_effects.air_1 = function() {
  console.log("air 1 effect");
}
