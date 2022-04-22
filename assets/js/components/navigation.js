/*
GLOBAL constants below
*/
const harvesterCost = 250;

/*
Setup imports
*/
import { HarvesterMovement } from "./move.js";
import { fetchPosition } from "./utils.js";

function addCloseBtn(menu) {
    const closeBtn = document.createElement('div');
    closeBtn.classList.add('menuBtn');
    closeBtn.innerHTML = 'Close';
    closeBtn.onclick = () => {
        menu.style.display = 'none';
        removeActiveClick();
    }
    menu.appendChild(closeBtn);
}

function addHomeBase(menu) {
    const homeBaseExists = document.getElementsByClassName('homeBase').length > 0;
    if (homeBaseExists) {
        return;
    }
    const homeBaseBtn = document.createElement('div');
    homeBaseBtn.classList.add('menuBtn');
    homeBaseBtn.innerHTML = 'Deploy Home Base';
    homeBaseBtn.onclick = () => {
        const td = document.getElementsByClassName('activeClick')[0];
        td.classList.add('homeBase');
        menu.style.display = 'none';
        removeActiveClick();
    }
    menu.appendChild(homeBaseBtn);
}

function addHarvester(menu) {
    const homeBaseExists = document.getElementsByClassName('homeBase').length > 0;
    if (!homeBaseExists) {
        return;
    }
    const harvesterBtn = document.createElement('div');
    harvesterBtn.classList.add('menuBtn');
    harvesterBtn.innerHTML = 'Deploy Harvester';
    harvesterBtn.onclick = () => {
        // Check if there is enough money in the bank
        const moneyBadge = document.getElementById('money');
        let currentBalance = moneyBadge.innerHTML;
        currentBalance = parseInt(currentBalance.replace('$', '').trim());
        currentBalance = currentBalance - harvesterCost;
        if (currentBalance < 0) {
            alert('You do not have enough money');
            return;
        }
        // TODO, show a loading bar of the harvester being built

        // Add a harvester next to home base
        const homeBase = document.getElementsByClassName('homeBase')[0];
        // Get the home base position
        const position = fetchPosition(homeBase);
        // TODO Make this more robust -> for the time being place the harvester to the right of the home base
        const tds = document.querySelectorAll('td');
        const td = tds[position];  // This will error if the base is the last block :(
        td.classList.add('harvester');
        const harvesterMovement = new HarvesterMovement(position + 1).movementLoop();
        // Deduct the cost of a harvester from the cash amount
        moneyBadge.innerHTML = `$ ${currentBalance}`;
        // Hide the menu
        menu.style.display = 'none';
        removeActiveClick();
    }
    menu.appendChild(harvesterBtn);
}

function loadSelectionMenu() {
    const menu = document.getElementById('playerSelectionMenu');
    // Reset the player menu
    menu.innerHTML = '';
    // Add a close button
    addCloseBtn(menu);
    // Add a deploy home base button
    addHomeBase(menu);
    // Add harvester button
    addHarvester(menu);
    // Reveal menu
    menu.style.display = 'block';
}

function removeActiveClick() {
    // Remove all previous active clicks
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
        tds[i].classList.remove('activeClick');
    }
}

function tileClick() {
    const tds = document.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
        let td = tds[i];
        td.addEventListener('click', (event) => {
            // Remove all previous active clicks
            removeActiveClick();
            // Display active click :: might be for testing purposes only
            let targetTd = event.target;
            targetTd.classList.add('activeClick');
            // Load player selection menu
            loadSelectionMenu();
        });
    }
}




export { tileClick };