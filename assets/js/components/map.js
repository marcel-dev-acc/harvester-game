import { goldInMines } from './constants.js';


class Map {
  constructor(numberTitlesAcross) {
    this.width = window.innerWidth;
    this.tiles = numberTitlesAcross;
    this.tileWidth = 20;
    this.tileHeight = 20;
  }

  setMap() {
    const table = document.querySelector('table');
    for (let i = 0; i < this.tiles; i++) {
      table.appendChild(document.createElement('tr'));
    }
    const trs = document.querySelectorAll('tr');
    let tdValue = 1;
    for (let i = 0; i < trs.length; i++) {
      let tr = trs[i];
      for (let j = 0; j < this.tiles; j++) {
        let td = document.createElement('td');
        td.classList.add(`${tdValue}`);
        tr.appendChild(td);
        tdValue++;
      }
    }
  }

  setTileWidth() {
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      let td = tds[i];
      td.style.width = `${this.tileWidth * 1.15}px`;
    }
  }

  setTileHeight() {
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      let td = tds[i];
      td.style.height = `${this.tileHeight}px`;
    }
  }

  setTileSize() {
    this.setTileWidth();
    this.setTileHeight();
    const table = document.querySelector('table');
    table.style.width = `${this.tileWidth * 1.15 * this.tiles}px`;
    table.style.height = `${this.tileHeight * this.tiles}px`;
  }

  setTileColour() {
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      let td = tds[i];
      td.classList.add('desert');
    }
  }
}

class Resources {
  constructor(numberTitlesAcross) {
    this.tiles = numberTitlesAcross;
    this.reservedList = ['gold'];
    this.goldPercentage = 2;
  }

  setGoldDeposit() {
    const tds = document.querySelectorAll('td');
    while (true) {
      // Get random location for gold spawn
      let tile = Math.floor(Math.random() * this.tiles * this.tiles);
      // Get a tile for tiles
      let td = tds[tile];
      // Check if gold can be placed
      let goldCanBePlace = true;
      /**
       *  Iterate over class list to see if any classes added are in the reserved list,
       *  i.e. gold may not be placed if it is already gold.
      */
      for (let i = 0; i < td.classList.length; i++) {
        for (let j = 0; j < this.reservedList.length; j++) {
          if (td.classList[i] == this.reservedList[j]) {
            goldCanBePlace = false;
          }
        }
      }
      if (goldCanBePlace) {
        td.classList.add('gold');
        td.classList.add(`gold:${goldInMines}`);
        break;
      }
      continue;
    }
  }

  initialisation() {
    const goldDeposits = Math.floor(this.tiles * this.tiles * (this.goldPercentage / 100));
    for (let i = 0; i < goldDeposits; i++) {
      this.setGoldDeposit();
    }
  }
}

export { Map, Resources };