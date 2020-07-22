// functions to do with the shop
// shop is a modal window
'use strict';

function add_shopButtons() {
  // get container
  const container_footer = document.getElementById('container_footer');
  const width = container_footer.getAttribute('width');
  const height = container_footer.getAttribute('height');

  // add open shop button to footer
  const container_openButton = document.createElementNS(svgns, 'svg');
  container_footer.appendChild(container_openButton);
  container_openButton.id = 'shop_openButton';
  container_openButton.onclick = promptShop;
  // svg attributes
  container_openButton.setAttribute('width', width * 0.2);
  container_openButton.setAttribute('height', height * 0.75);
  container_openButton.setAttribute('x', width * 0.05);
  container_openButton.setAttribute('y', height * 0.125);

  // background
  const openButton_background = document.createElementNS(svgns, 'rect');
  container_openButton.appendChild(openButton_background);
  openButton_background.onclick = promptShop;
  // svg attributes
  openButton_background.setAttribute('width', container_openButton.getAttribute('width'));
  openButton_background.setAttribute('height', container_openButton.getAttribute('height'));
  openButton_background.setAttribute('x', 0);
  openButton_background.setAttribute('y', 0);
  openButton_background.setAttribute('fill', 'white');

  // text
  const openButton_text = document.createElementNS(svgns, 'text');
  container_openButton.appendChild(openButton_text);
  openButton_text.setAttribute('stroke', 'black');
  openButton_text.textContent = 'Open shop';
  openButton_text.onclick = promptShop;
  // svg attributes
  openButton_text.setAttribute('x', container_openButton.getAttribute('width') * 0.5 - openButton_text.getComputedTextLength() / 2);
  openButton_text.setAttribute('y', container_openButton.getAttribute('height') * 0.5);
}

async function promptShop() {
  const game_svg_workspace = document.getElementById('game_svg_workspace');
  const width = game_svg_workspace.getAttribute('width');
  const height = game_svg_workspace.getAttribute('height');

  const cardAttributes = {
    'width': 100,
    'height': 200,
    'seperation': {
      'horizontal': 25,
      'vertical': 25
    }
  }

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

    // cards must appended to top level workspace
    const cardSVG = buildCardSVG_full(card, game_svg_workspace, cardAttributes.width, cardAttributes.height, card_x, card_y);
    //const cardSVG = buildCardSVG_full(card, container_shop, cardAttributes.width, cardAttributes.height, card_x, card_y);
  }
}

function closeShop() {
  // remove shop
  document.getElementById('container_shop').remove();

  // enable open shop button

  // const openButton = document.getElementById('shop_openButton');
  // openButton.disabled = false;
  // openButton.classList.remove('button_disabled');

}
