'use strict';

class Field {
  constructor(heigth, width, header = '', score = 0) {
    this.heigth = heigth;
    this.width = width;
    this.header = header;
    this.score = score;
  }

  scoreAdd(num) {
    this.score += num;
  }

  getScore() {
    return this.score;
  }

  toString() {
    const diversion = this.width - 2;
    const head = '┌' + '―'.repeat(diversion) + '┐';
    const footer = '└' + '―'.repeat(diversion) + '┘';

    if (this.header.length > 0)
      process.stdout.write(`\x1b[0;0H${this.header} `);
    process.stdout.write(`\x1b[43m\x1b[30mScore: ${this.score}\x1b[0m`);
    process.stdout.write('\x1b[2;0H');
    process.stdout.write(head);

    for (let i = 3; i < this.heigth; i++) {
      process.stdout.write(`\x1b[${i};0H`);
      process.stdout.write('|');
      process.stdout.write(`\x1b[${i};${this.width}H`);
      process.stdout.write('|');
    }
    process.stdout.write(`\x1b[${this.heigth};0H`);
    process.stdout.write(footer);
  }
}

if (typeof exports !== 'undefined') exports.Field = Field;
