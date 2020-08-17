// functions todo with companions
// class definition
'use strict';

exports.Companion = class Companion {
  /**
   * creates a companion
   * @constructor
   */
   constructor(id) {
     // retrieve attributes from database
     this.health = 5;
     this.mana = 5;
     this.name = "aang";

     // default properties
     // cards starts undefined
     this.cards = Array(4);
   }

   /**
    * sets the card at a given index
    */
   setCard(card, index) {
     this.cards[index] = card;
   }
}
