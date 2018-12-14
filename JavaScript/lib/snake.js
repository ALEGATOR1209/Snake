'use strict';

const DEFAULT_SNAKE = {
  length: 5,
  direction: 'down',
  positions: [
    { y: 1, x: 5 },
    { y: 0, x: 5 },
    { y: -1, x: 5 },
    { y: -2, x: 5 },
    { y: -3, x: 5 },
  ],
};
const DIRECTIONS = {
  up: '⇑',
  down: '⇓',
  left: '⇐',
  right: '⇒',
};

module.exports = class Snake {
  constructor(snake = DEFAULT_SNAKE) {
    const { length, direction, positions } = snake;
    this.length = length;
    this.direction = direction;
    this.positions = positions;
  }

  move() {
    for (let i = this.length - 1; i > 0; i--)
      this.positions[i].x === this.positions[i - 1].x ?
        this.positions[i].y = this.positions[i - 1].y :
        this.positions[i].x = this.positions[i - 1].x;

    if (this.direction === 'down')
      this.positions[0].y++;

    else if (this.direction === 'up')
      this.positions[0].y--;

    else if (this.direction === 'right')
      this.positions[0].x++;

    else if (this.direction === 'left')
      this.positions[0].x--;

    return this;
  }

  turn(direction) {
    if (DIRECTIONS[direction])
      this.direction = direction;
    return this;
  }

  getHeadPosition() {
    return this.positions[0];
  }

  getAllPositions() {
    return this.positions;
  }

  toDefaults() {
    this.length = 5;
    this.direction = 'down';
    this.positions = [
      { y: 1, x: 5 },
      { y: 0, x: 5 },
      { y: -1, x: 5 },
      { y: -2, x: 5 },
      { y: -3, x: 5 },
    ];
    return this;
  }

  toString() {
    process.stdout.write('\x1Bc');
    for (let i = 1; i < this.length - 1; i++) {
      const next = this.positions[i + 1];
      const current = this.positions[i];
      const prev = this.positions[i - 1];

      if (current.x > 1 && current.y > 1) {
        process.stdout.write(`\x1b[${current.y};${current.x}H`);

        if (prev.x === next.x)
          process.stdout.write('\x1b[32m║\x1b[0m');
        else
          process.stdout.write('\x1b[32m=\x1b[0m');
      }
    }
    const arrow = DIRECTIONS[this.direction];
    const head = this.positions[0];
    process.stdout.write(`\x1b[${head.y};${head.x}H`);
    process.stdout.write(`\x1b[32m${arrow}\x1b[0m`);
    return this;
  }
}
