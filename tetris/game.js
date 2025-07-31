// 📱 Mobil ellenőrzés
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
  document.getElementById('game-wrapper').style.display = 'none';
  document.getElementById('mobile-warning').classList.remove('hidden');
} else {

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
