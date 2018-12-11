'use strict';
/************************************/
/*---->IMPORTS AND KEYPRES INIT<----*/
/************************************/
const snake = require('./lib/snake.js');
const field = require('./lib/field.js');
const brick = require('./lib/brick.js');
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
console.clear();

/******************/
/*>MAIN VARIABLES<*/
/******************/
const HEIGTH = 20;
const WIDTH = 50;
const HEADER = 'Best game I ever played. \x1b[32m(c) ALEGATOR1209\x1b[0m';
const Field = new field.Field(HEIGTH, WIDTH, HEADER);
const BrickMaster = new brick.Brick(WIDTH - 2, HEIGTH - 1);
const python = new snake.Snake();
/*******************/
/*>KEYPRESS LAUNCH<*/
/*******************/
process.stdin.on('keypress', (str, key) => {
  const dir = key.name;
  if (key.ctrl && dir === 'c' || dir === 'q') {
    console.clear();
    console.log('\x1B[?25h');
    process.exit(0);
  }

  const head = python.getHeadPosition();
  if (head.y > 1)
    python.turn(dir);
});

/*************/
/*>FUNCTIONS<*/
/*************/
const finish = game => {
  clearInterval(game);
  game = null;
  const loserText = 'YOU LOST!';
  const score = Field.getScore();

  const finishField = new field.Field(HEIGTH, WIDTH, loserText, score);
  python.toString();
  BrickMaster.toString();
  finishField.toString();
  console.log('\x1B[?25h\n');
  process.exit(0);
};

const generateFood = (minX, maxX, minY, maxY) => {
  const snake = python.getAllPositions();
  const bricks = BrickMaster.getAllPositions();
  const wrongPositions = [...snake, ...bricks];
  const goodPositions = [];

  for (let i = minY; i < maxY; i++) {
    for (let j = minX; j < maxX; j++) {
      const isWrong = wrongPositions.find((pos) => pos.x === j && pos.y === i);
      if (!isWrong) goodPositions.push({ x: j, y: i });
    }
  }

  const getRandomPos = length => Math.floor(Math.random() * Math.floor(length));
  const randomPos = getRandomPos(goodPositions.length);
  return goodPositions[randomPos];
};

const getFood = () => generateFood(2, WIDTH, 3, HEIGTH - 1);
let food = getFood();

const badFood = () => {
  const wrongPositions = BrickMaster.getAllPositions();
  for (const pos of wrongPositions)
    if (food.x === pos.x && food.y === pos.y)
      return true;
  return false;
};

const drawFood = () => {
  process.stdout.write(`\x1b[${food.y};${food.x}H`);
  process.stdout.write('\x1b[31m*\x1b[0m');
};

/***********************/
/*-->MAIN GAME LOGIC<--*/
/***********************/
const game = setInterval(() => {
  python
    .move()
    .toString();
  const head = python.getHeadPosition();
  const bricks = BrickMaster.getAllPositions();
  if (head.x === 1 || head.x === WIDTH)
    finish(game);
  if (head.y === 1 || head.y === HEIGTH)
    finish(game);
  bricks.forEach(brick => {
    if (head.x === brick.x && head.y === brick.y)
      finish(game);
  });
  if (badFood())
    food = getFood();
  if (head.y === food.y && head.x === food.x) {
    food = getFood();
    BrickMaster.addBrick(python.getAllPositions());
    python.toDefaults();
    Field.scoreAdd(1);
  }
  drawFood();
  BrickMaster
    .toString()
    .moveEmAll();
  if (BrickMaster.isLines())
    Field.scoreAdd(10);
  Field.toString();
  console.log('\x1B[?25l');
}, 200);
