// functions to do with the shop
// shop is a modal window
'use strict';

function add_shopButtons() {
  // get container
  const container_footer = document.getElementById('container_footer');
  const width = container_footer.getAttribute('width');
  const height = container_footer.getAttribute('height');

  // open shop button
  const button_openShop = new FooterButton('shop_openButton', promptShop, false,
    width, height, 'Open shop');
  button_openShop.draw();
}

async function promptShop() {
  // disable open shop button
  FooterButton.getByID('shop_openButton').disable();

  const game_svg_workspace = document.getElementById('game_svg_workspace');
  const width = game_svg_workspace.getAttribute('width');
  const height = game_svg_workspace.getAttribute('height');

  // shop container
  const container_shop = document.createElementNS(svgns, 'svg');
  game_svg_workspace.appendChild(container_shop);
  container_shop.id = 'container_shop';
  // svg attributes
  // gap of 0.1 between cards - includes edges
  // therefore with 3 cards there are 4 gaps (cards.length + 1)
  container_shop.setAttribute('width', cardAttributes.width * 3 + 4 * cardAttributes.seperation.horizontal);
  // 3 gaps at top for button and space
  // 1 gap at bottom
  container_shop.setAttribute('height', cardAttributes.height + 4 * cardAttributes.seperation.vertical);
  // display in middle of page
  container_shop.setAttribute('x', width * 0.5 - container_shop.getAttribute('width') / 2);
  container_shop.setAttribute('y', height * 0.5 - container_shop.getAttribute('height') / 2);

  // background
  const shop_background = document.createElementNS(svgns, 'rect');
  container_shop.appendChild(shop_background);
  // svg attributes
  shop_background.setAttribute('width', container_shop.getAttribute('width'));
  shop_background.setAttribute('height', container_shop.getAttribute('height'));
  shop_background.setAttribute('x', 0);
  shop_background.setAttribute('y', 0);
  shop_background.setAttribute('fill', 'grey');
  shop_background.setAttribute('stroke', 'black');

  // dismiss button
  // goes in top right to avoid dragging cards over it
  const container_shop_closeButton = document.createElementNS(svgns, 'svg');
  container_shop.appendChild(container_shop_closeButton);
  container_shop_closeButton.onclick = closeShop;
  // svg attributes
  // width of card
  container_shop_closeButton.setAttribute('width', cardAttributes.width);
  // enough to display text
  container_shop_closeButton.setAttribute('height', cardAttributes.seperation.vertical);
  // display in above card on the right
  container_shop_closeButton.setAttribute('x', container_shop.getAttribute('width') - cardAttributes.seperation.horizontal - cardAttributes.width);
  container_shop_closeButton.setAttribute('y', cardAttributes.seperation.vertical);

  // background
  const shop_closeButton_background = document.createElementNS(svgns, 'rect');
  container_shop_closeButton.appendChild(shop_closeButton_background);
  shop_closeButton_background.onclick = closeShop;
  // svg attributes
  shop_closeButton_background.setAttribute('width', container_shop_closeButton.getAttribute('width'));
  shop_closeButton_background.setAttribute('height', container_shop_closeButton.getAttribute('height'));
  shop_closeButton_background.setAttribute('fill', 'white');
  shop_closeButton_background.setAttribute('stroke', 'black');

  // text
  const shop_closeButton_text = document.createElementNS(svgns, 'text');
  container_shop_closeButton.appendChild(shop_closeButton_text);
  shop_closeButton_text.onclick = closeShop;
  shop_closeButton_text.textContent = 'X';
  // svg attributes
  shop_closeButton_text.setAttribute('x', container_shop_closeButton.getAttribute('width') * 0.5 - shop_closeButton_text.getComputedTextLength() / 2);
  shop_closeButton_text.setAttribute('y', container_shop_closeButton.getAttribute('height') / 2);
  shop_closeButton_text.setAttribute('stroke', 'black');

  // cards
  const cards = await getShopCards();
  for(const [i, card] of cards.entries()) {
    const card_x = parseFloat(container_shop.getAttribute('x')) + cardAttributes.seperation.horizontal * (i + 1) + cardAttributes.width * i;
    const card_y = parseFloat(container_shop.getAttribute('y')) + cardAttributes.seperation.vertical * 3;

    const cardObj = new Card_Shop(card.name, cardAttributes.width, cardAttributes.height,
      card_x, card_y);
    await cardObj.init();
    cardObj.draw(game_svg_workspace);
  }
}

function closeShop() {
  // avoid erroring on multiple clicks before shop fully disappears
  // can also be called when shop is not present
  const container_shop = document.getElementById('container_shop');
  if(container_shop) {
    // remove shop
    container_shop.remove();
    // remove any remaining cards
    let cardNodes = document.querySelectorAll('.shop_card');
    while(cardNodes.length != 0) {
      cardNodes[0].remove();
      cardNodes = document.querySelectorAll('.shop_card');
    }

    // enable open shop button
    FooterButton.getByID('shop_openButton').enable();
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
