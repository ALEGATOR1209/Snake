'use strict';

class Brick {
  constructor(positions = []) {
    this.positions = positions;
    this.stone = false;
  }
  move(dir = 1) {
    this.positions.forEach(pos => (dir ? pos.y++ : pos.y--));
    return this;
  }
  getMaxPosition() {
    let max = 0;
    for (const position of this.positions) {
      if (position.y > max) max = position.y;
    }
    return max;
  }
  getPositions() {
    return this.positions;
  }
  freezy() {
    this.stone = true;
    return this;
  }
  removePos(x, y) {
    this.positions = this.positions.filter(pos => pos.x !== x && pos.y !== y);
    return this;
  }
  toString() {
    this.positions.forEach(pos => {
      process.stdout.write(`\x1b[${pos.y};${pos.x}H=`);
    });
    return this;
  }
}

class BrickMaster {
  constructor(width, heigth, bricks = []) {
    this.width = width;
    this.heigth = heigth;
    this.bricks = bricks;
    this.toDelete = '';
  }

  addBrick(positions) {
    this.bricks.push(new Brick(positions));
    return this;
  }

  moveEmAll() {
    this.bricks.forEach(brick => {
      if (brick.stone) return;
      if (brick.getMaxPosition() <= this.heigth) brick.move();
      if (brick.getMaxPosition() > this.heigth) brick.freezy();

      const stoneCollision = (() => {
        for (const stone of this.bricks)
          if (stone.stone && BrickMaster.compareBricks(brick, stone))
            return true;
        return false;
      })();

      if (stoneCollision) {
        brick.move(0);
        brick.freezy();
      }
    });
    return this;
  }

  getAllPositions() {
    const positions = [];
    for (const brick of this.bricks) {
      positions.push(...brick.getPositions(positions));
    }
    return positions;
  }

  findLine() {
    const lines = [];
    this.bricks
      .filter(brick => brick.stone)
      .forEach(brick =>
        brick.getPositions()
          .forEach(pos => (lines[pos.y] instanceof Array ?
            lines[pos.y].push({ x: pos.y, y: pos.y, brick }) :
            lines[pos.y] = [{ x: pos.y, y: pos.y, brick }]))
      );

    lines
      .filter(line => line.length === this.width)
      .forEach(line => (
        this.toDelete += `\x1b[${line[0].y};` +
          `2H\x1b[31m${'='.repeat(this.width)}\x1b[0m`,
        line.forEach(pos => pos.brick
          .removePos(pos.x, pos.y)
          .stone = false
        )
      ));

    return this;
  }

  isLines() {
    this.findLine();
    if (this.toDelete.length > 0)
      return true;
    return false;
  }

  toString() {
    this.findLine();
    if (this.toDelete) {
      process.stdout.write(this.toDelete);
      this.toDelete = '';
    }
    this.bricks.forEach(brick => brick.toString());
    return this;
  }

  static compareBricks(brick1, brick2) {
    const pos1 = brick1.getPositions();
    const pos2 = brick2.getPositions();

    for (const i of pos1)
      for (const j of pos2)
        if (i.x === j.x && i.y === j.y)
          return true;
    return false;
  }
}

if (typeof exports !== 'undefined') exports.Brick = BrickMaster;
