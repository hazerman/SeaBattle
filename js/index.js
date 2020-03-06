'use strict';

const HIT_FLAG = 'x';
const record = document.querySelector('#record');
const shot = document.querySelector('#shot');
const hit = document.querySelector('#hit');
const dead = document.querySelector('#dead');
const enemy = document.querySelector('#enemy');
const reloadButton = document.querySelector('#again');
const header = document.querySelector('.header');

const field = {
  size: 10,
  ships: [],
  shipCount: 0,
  restart() {
    this.ships = [];
    this.shipCount = 0;
  },
  showMiss(data) {
    this.changeClass(data, 'miss');
  },
  showHit(data) {
    this.changeClass(data, 'hit');
  },
  showDead(data) {
    this.changeClass(data, 'dead');
  },
  changeClass(data, className) {
    data.className = className;
  }
};

const game = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,
  shipOption: {
    count: [1, 2, 3, 4],
    size: [4, 3, 2, 1]
  },
  collision: new Set(),
  set updateData(data) {
    ++this[data];
    this.render();
  },
  restart() {
    this.shot = 0;
    this.hit = 0;
    this.dead = 0;
    this.collision = new Set();
    this.render();
  },
  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  },
  generateShip() {
    for (let i = 0; i < this.shipOption.count.length; i++) {
      for (let j = 0; j < this.shipOption.count[i]; j++) {
        const size = this.shipOption.size[i];
        const ship = this.generateShipOptions(size);
        field.ships.push(ship);
        field.shipCount++;
      }
    }
  },
  generateShipOptions(shipSize) {
    const ship = {
      hit: [],
      location: []
    };
    const location = {
      x: 0,
      y: 0,
      update(newX, newY) {
        this.x = newX;
        this.y = newY;
      }
    };

    const direction = Math.round(Math.random());
    const cell = Math.floor(Math.random() * field.size);
    const limitedCell = Math.floor(Math.random() * (field.size - shipSize));
    if (direction) {
      location.update(cell, limitedCell);
    } else {
      location.update(limitedCell, cell);
    }
    for (let i = 0; i < shipSize; i++) {
      if (direction) {
        ship.location.push(location.x + '' + (location.y + i));
      } else {
        ship.location.push((location.x + i) + '' + location.y);
      }
      ship.hit.push('');
    }
    if (this.isOnCollision(ship.location)) {
      return this.generateShipOptions(shipSize);
    }
    this.addCollision(ship.location, direction);
    return ship;
  },
  isOnCollision(location) {
    let result = false;
    location.forEach((item) => {
      if (this.collision.has(item)) {
        result = true;
      }
    });
    return result;
  },
  addCollision(location, direction) {
    const startX = location[0][0] - 1;
    const startY = location[0][1] - 1;
    const endX = direction ? startX + 2 : startX + location.length + 1;
    const endY = direction ? startY + location.length + 1 : startY + 2;
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        if (i >= 0 && i < field.size && j >= 0 && j < field.size) {
          const coord = i + '' + j;
          this.collision.add(coord);
        }
      }
    }
  }
};

const fire = (evt) => {
  const target = evt.target.closest('td');
  if (target && !target.classList.length) {
    field.showMiss(target);
    game.updateData = 'shot';
    field.ships.forEach(ship => {
      const index = ship.location.indexOf(target.id);
      if (index >= 0) {
        field.showHit(target);
        game.updateData = 'hit';
        ship.hit[index] = HIT_FLAG;
        const isDead = ship.hit.every(item => item === HIT_FLAG);
        if (isDead) {
          game.updateData = 'dead';
          ship.location.forEach(location => {
            field.showDead(document.getElementById(location));
          });
          --field.shipCount;
          if (field.shipCount < 1) {
            header.textContent = 'Игра Окончена!';
            header.style.color = 'red';
            enemy.removeEventListener('click', fire);
            if (game.shot < game.record || game.record === 0) {
              localStorage.setItem('seaBattleRecord', game.shot);
              game.record = game.shot;
              game.render();
            }
          }
        }
      }
    });
  }
};

const restart = () => {
  const td = document.querySelectorAll('td[class]');
  td.forEach((item) => {
    item.removeAttribute('class');
  });
  if (field.shipCount < 1) {
    header.textContent = 'Sea Battle';
    header.removeAttribute('style');
    enemy.addEventListener('click', fire);
  }
  field.restart();
  game.restart();
  game.generateShip();
};

const init = () => {
  enemy.addEventListener('click', fire);
  game.render();
  game.generateShip();
  reloadButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    restart();
  });
  record.addEventListener('dblclick', () => {
    localStorage.clear();
    game.record = 0;
    game.render();
  });
};

init();
