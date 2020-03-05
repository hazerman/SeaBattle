'use strict';

const record = document.querySelector('#record');
const shot = document.querySelector('#shot');
const hit = document.querySelector('#hit');
const dead = document.querySelector('#dead');
const enemy = document.querySelector('#enemy');
const reloadButton = document.querySelector('#again');
const header = document.querySelector('.header');

const game = {
  record: localStorage.getItem('seaBattleRecord') || 0,
  shot: 0,
  hit: 0,
  dead: 0,
  set updateData(data) {
    ++this[data];
    this.render();
  },
  render() {
    record.textContent = this.record;
    shot.textContent = this.shot;
    hit.textContent = this.hit;
    dead.textContent = this.dead;
  }
};

const field = {
  ships: [
    {
      location: ['11', '12', '13', '14'],
      hit: ['', '', '', '']
    },
    {
      location: ['56', '66', '76'],
      hit: ['', '', '']
    },
    {
      location: ['31', '32'],
      hit: ['', '']
    },
    {
      location: ['88'],
      hit: ['']
    }
  ],
  shipCount: 4,
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
        ship.hit[index] = 'x';
        const isDead = ship.hit.every(item => item === 'x');
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

const init = () => {
  enemy.addEventListener('click', fire);
  game.render();
  reloadButton.addEventListener('click', () => {
    location.reload();
  });
};

init();
