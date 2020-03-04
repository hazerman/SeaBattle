'use strict';

const record = document.querySelector('#record');
const shot = document.querySelector('#shot');
const hit = document.querySelector('#hit');
const dead = document.querySelector('#dead');
const enemy = document.querySelector('#enemy');

const game = {
  record: 0,
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
  showMiss(data) {
    this.changeClass(data, 'miss');
  },
  changeClass(data, className) {
    data.className = className;
  }
};

const fire = (evt) => {
  const target = evt.target.closest('td');
  if (target && target.className !== 'miss') {
    field.showMiss(target);
    game.updateData = 'shot';
  }
};

const init = () => {
  enemy.addEventListener('click', fire);
};

init();
