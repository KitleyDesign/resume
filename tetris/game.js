const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

const arenaWidth = 12;
const arenaHeight = 20;

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

const pieces = {
  'T': [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  'O': [
    [2, 2],
    [2, 2]
  ],
  'L': [
    [0, 3, 0],
    [0, 3, 0],
    [0, 3, 3]
  ],
  'J': [
    [0, 4, 0],
    [0, 4, 0],
    [4, 4, 0]
  ],
  'I': [
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0],
    [0, 5, 0, 0]
  ],
  'S': [
    [0, 6, 6],
    [6, 6, 0],
    [0, 0, 0]
  ],
  'Z': [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0]
  ]
};

const colors = [
  null,
  '#FFB6C1',
  '#FFC0CB',
  '#FF69B4',
  '#FF1493',
  '#DB7093',
  '#FFA07A',
  '#FF6347'
];

const arena = createMatrix(arenaWidth, arenaHeight);

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

const player = {
  pos: {x: 0, y: 0},
  matrix: null,
  score: 0
};

function collide(arena, player) {
  const m = player.matrix;
  const o = player.pos;
  for(let y = 0; y < m.length; ++y) {
    for(let x = 0; x < m[y].length; ++x) {
      if(m[y][x] !== 0 &&
         (arena[y + o.y] &&
          arena[y + o.y][x + o.x]) !== 0) {
            return true;
      }
    }
  }
  return false;
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function rotate(matrix, dir) {
  for(let y = 0; y < matrix.length; ++y) {
    for(let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if(dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

function playerReset() {
  const piecesKeys = Object.keys(pieces);
  const rand = piecesKeys[Math.floor(Math.random() * piecesKeys.length)];
  player.matrix = pieces[rand];
  player.pos.y = 0;
  player.pos.x = Math.floor((arenaWidth / 2) - (player.matrix[0].length / 2));

  if(collide(arena, player)) {
    arena.forEach(row => row.fill(0));

    // Játék vége - kérjük be a nevet és mentsük az eredményt
    let name = prompt('Game Over! Add meg a neved (max 10 karakter):');
    if(name === null || name.trim() === '') {
      name = 'Anon';
    }
    name = name.trim().substring(0,10);

    addScore(name, player.score);

    player.score = 0;
    updateScore();
    updateScoreboard();
  }
}

function playerDrop() {
  player.pos.y++;
  if(collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    sweepArena();
    updateScore();
    playerReset();
  }
  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;
  if(collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerRotate(dir) {
  const pos = player.pos.x;
  rotate(player.matrix, dir);
  let offset = 1;
  while(collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if(offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function sweepArena() {
  outer: for(let y = arena.length - 1; y >= 0; --y) {
    for(let x = 0; x < arena[y].length; ++x) {
      if(arena[y][x] === 0) {
        continue outer;
      }
    }
    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    player.score += 10;
    y++;
  }
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x,
                         y + offset.y,
                         1, 1);
      }
    });
  });
}

function draw() {
  context.fillStyle = '#fff0f5';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x:0, y:0});
  drawMatrix(player.matrix
