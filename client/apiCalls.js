'use strict'

async function getGames() {
  const response = await fetch('/api/games');
  if(response.ok) {
    return await response.json();
  }
}

async function postGame(name, canvas) {
  // host details
  let query = `?hostCookie=${clientContent.cookie}`;
  // game details
  query = query + `&name=${name}`;

  const url = '/api/game' + query;

  const response = await fetch(url, {method: 'POST'});
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to post game");
  }
}

async function updateGameData() {
  // host details
  let query = `?hostCookie=${clientContent.cookie}`;
  // game details
  query = query + `&gameData=${JSON.stringify(gameData)}`;

  const url = '/api/game' + query;

  const response = await fetch(url, {method: 'PUT'});
  if(response.ok) {
    //console.log("game updated!");
  } else {
    console.error("failed to update game");
  }
}

// gets game data with game id
async function getGameData(gameID) {
  const url = `api/game?gameID=${gameID}&cookie=${clientContent.cookie}`;

  const response = await fetch(url);
  if(response.ok) {
    return await response.json();
  } else {
    console.error("failed to get game");
  }
}
