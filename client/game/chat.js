// functions todo with chat associated with game
'use strict';

// called when a message is sent down the game socket
async function gameSocket_message(ev) {
  console.log("game socket message received");
  console.log(ev);
}
