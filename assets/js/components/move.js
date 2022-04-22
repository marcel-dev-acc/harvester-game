import { fetchPosition, sleep } from './utils.js';
import { numberTitlesAcross, goldInMines } from './constants.js';

class HarvesterMovement {
    constructor(position) {
        this.harvesterId = new Date().valueOf();
        this.currentPosition = position;
        this.harvesterCapacity = 5;
        this.harvesterGoldCount = 0;
        this.IsMining = false;
        this.IsOffloading = false;
        this.IsMoving = true;
    }

    nearestGold() {
        const gold = document.getElementsByClassName('gold');
        let nearestGoldPosition = 0;
        let distance = 0;
        let distanceSquared = 0;
        for (let i = 0; i < gold.length; i++) {
            let goldPosition = fetchPosition(gold[i]);
            if (i == 0) {
                nearestGoldPosition = goldPosition;
                distance = this.currentPosition - goldPosition;
                distanceSquared = distance * distance; // Easier to measure an absolute value
            } else {
                distance = this.currentPosition - goldPosition;
                // Validate that the distanceSquared new is less than current distanceSquared
                if (distance * distance < distanceSquared) {
                    nearestGoldPosition = goldPosition;
                    distanceSquared = distance * distance;
                }
            }
        }
        return nearestGoldPosition;
    }

    getNextPosition(targetPosition) {
        /* Ultimately in this method you are trying to ascertain
         * if you move left, right, up or down if the distance between
         * your next position and the mine has been diminished the most.
         * In this way the harvester moves in the optimal manner.
        */
        // Check if you move right you are closer to mine
        const rightDistDiff = (this.currentPosition - 1) - targetPosition;
        // Check if you move left you are closer to mine
        const leftDistDiff = (this.currentPosition + 1) - targetPosition;
        // Check if you move up you are closer to mine
        const upDistDiff = (this.currentPosition - numberTitlesAcross) - targetPosition;
        // Check if you move down you are closer to mine
        const downDistDiff = (this.currentPosition + numberTitlesAcross) - targetPosition;

        // Evaluate to find the smallest square value
        let smallestValue = Math.min(
            (rightDistDiff * rightDistDiff),
            (leftDistDiff * leftDistDiff),
            (upDistDiff * upDistDiff),
            (downDistDiff * downDistDiff)
        );

        if ((rightDistDiff * rightDistDiff) == smallestValue) {
            return this.currentPosition - 1;
        } else if ((leftDistDiff * leftDistDiff) == smallestValue) {
            return this.currentPosition + 1;
        } else if ((upDistDiff * upDistDiff) == smallestValue) {
            return this.currentPosition - numberTitlesAcross;
        } else {
            return this.currentPosition + numberTitlesAcross;
        }

        alert('Error in movement');
        throw 'Error in movement';
    }

    checkHarvesterIsAtDest(targetPosition, Position) {
        if (targetPosition == Position) {
            return true;
        } else {
            return false;
        }
    }

    setHarvesterPosition(old, _new) {
        // Fetch all td's
        let tds = document.querySelectorAll('td');
        // Remember the array is indexed @ 0
        // Remove previous position
        tds[(old - 1)].classList.remove('harvester');
        // Set the new position
        tds[(_new - 1)].classList.add('harvester');
    }

    setupHarvesterStats() {
        const harvesterSpace = document.createElement('div');
        harvesterSpace.id = this.harvesterId;
        harvesterSpace.innerHTML = `<p>Harvester: ${this.harvesterId}</p>`;
        document.getElementById('stats').appendChild(harvesterSpace);
    }

    setHarvesterStats() {
        document.getElementById(`${this.harvesterId}`).innerHTML = `
        <p>Harvester: ${this.harvesterId}</p>
        <ul>
            <li>Gold count: ${this.harvesterGoldCount}</li>
        </ul>
        `;
    }

    depleteGold(position) {
        let tds = document.querySelectorAll('td');
        let td = tds[(position - 1)];
        let goldCount = goldInMines;
        let goldClassCount = `gold:${goldCount}`;
        for (let i = 0; i < td.classList.length; i++) {
            if (td.classList[i] == undefined) {
                continue;
            }
            if (td.classList[i].indexOf('gold') > -1 && td.classList[i].split(':').length > 1) {
                goldClassCount = td.classList[i];
                goldCount = parseInt(td.classList[i].split(':')[1]);
            }
        }
        if ((goldCount - 1) == 0) {
            td.classList.remove(goldClassCount);
            td.classList.remove('gold');
        } else {
            td.classList.remove(goldClassCount);
            td.classList.add(`gold:${(goldCount - 1)}`);
        }
    }

    async movementLoop() {
        this.setupHarvesterStats();
        while (true) {
            await sleep(1000);
            // Set stats
            this.setHarvesterStats();
            // Determine the target position
            let homeBase = document.getElementsByClassName('homeBase')[0];
            let targetPosition = fetchPosition(homeBase);
            if (this.IsMoving && this.harvesterGoldCount < this.harvesterCapacity) {
                targetPosition = this.nearestGold();
            }
            if (this.IsMoving && this.harvesterGoldCount == this.harvesterCapacity) {
                // Get the home base position
                targetPosition = fetchPosition(homeBase);
            }
            if (this.IsMining) {
                targetPosition = this.nearestGold();
            }
            if (this.IsOffloading) {
                // Get the home base position
                targetPosition = fetchPosition(homeBase);
            }

            let nextPosition = this.getNextPosition(targetPosition);
            if (this.checkHarvesterIsAtDest(targetPosition, this.currentPosition)) {
                nextPosition = this.currentPosition;
            }
            this.setHarvesterPosition(this.currentPosition, nextPosition);
            this.currentPosition = nextPosition; // The harvester has moved into the current position

            // If the harvester is at the target position then action mine or off load
            if (this.checkHarvesterIsAtDest(targetPosition, this.currentPosition)) {
                // Mine
                if (targetPosition == this.nearestGold() && this.harvesterGoldCount < this.harvesterCapacity) {
                    this.IsMoving = false;
                    this.IsMining = true;
                    this.depleteGold(targetPosition);
                    this.harvesterGoldCount++;
                } else {
                    this.IsMoving = true;
                    this.IsMining = false;
                }
                // Off load @ home base
                if (targetPosition == fetchPosition(homeBase) && this.harvesterGoldCount > 0) {
                    this.IsMoving = false;
                    this.IsOffloading = true;
                    this.harvesterGoldCount--;
                    if (this.harvesterGoldCount == 0) {
                        let moneyBadge = document.getElementById('money');
                        let currentBalance = moneyBadge.innerHTML;
                        currentBalance = parseInt(currentBalance.replace('$', '').trim());
                        currentBalance = currentBalance + 50;
                        moneyBadge.innerHTML = `$ ${currentBalance}`;
                        this.IsMoving = true;
                        this.IsOffloading = false;
                    }
                }
            }
        }
    }
}

export { HarvesterMovement };