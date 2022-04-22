import { Map, Resources } from './map.js';
import { tileClick } from './navigation.js';
import { numberTitlesAcross } from './constants.js';
import { sleep } from './utils.js';


async function setup() {
  // Set up the base map
  const map = new Map(numberTitlesAcross);
  map.setMap();
  map.setTileSize();
  map.setTileColour();

  // Set up map resources
  const resources = new Resources(numberTitlesAcross)
  resources.initialisation();

  /* Set up navigation */
  // Set up td event listeners for click events
  tileClick();

  // Game loop
  let goldCountIncrease = 0;
  while (true) {
    await sleep(1000);
    goldCountIncrease++;
    if (goldCountIncrease > 20) {
      resources.setGoldDeposit();
      goldCountIncrease = 0;
    }
  }
}

export default setup;