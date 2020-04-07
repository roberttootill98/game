'use strict'

let socket;

async function updateReceived(ev) {
  gameData = ev;

  // redraw elements
  const canvas = document.getElementById('gameCanvas');
  // clear canvas
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  drawPlayerModels(canvas);
}
