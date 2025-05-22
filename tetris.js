const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let score = 0;
let highScore = 0;
const arena = createMatrix(18, 30);
const colors = [
    null,
    '#FF0A54',
    '#FF477E',
    '#FF7096',
    '#FF85A1',
    '#FBB1BD',
    '#F9BEC7',
    '#FDCEDF',
];

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

function createMatrix(w, h) {
    const matrix = [];
    while (h--) matrix.push(new Array(w).fill(0));
    return matrix;
}

function createPiece(type) {
    switch(type) {
        case 'T': return [[0, 0, 0],[1, 1, 1],[0, 1, 0]];
        case 'O': return [[2, 2],[2, 2]];
        case 'L': return [[0, 3, 0],[0, 3, 0],[0, 3, 3]];
        case 'J': return [[0, 4, 0],[0, 4, 0],[4, 4, 0]];
        case 'I': return [[0, 5, 0, 0],[0, 5, 0, 0],[0, 5, 0, 0],[0, 5, 0, 0]];
        case 'S': return [[0, 6, 6],[6, 6, 0],[0, 0, 0]];
        case 'Z': return [[7, 7, 0],[0, 7, 7],[0, 0, 0]];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                 arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}
function showGameOver() {
  const gameOverDiv = document.getElementById('game-over');
  gameOverDiv.style.display = 'block';

  setTimeout(() => {
    gameOverDiv.style.display = 'none';
  }, 2000);
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) player.pos.x -= dir;
}

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    if (score > highScore) highScore = score;
    score = 0;
    showGameOver();
    updateScore();
}
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [ matrix[x][y], matrix[y][x] ] = [ matrix[y][x], matrix[x][y] ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function arenaSweep() {
    outer: for (let y = arena.length - 1; y >= 0; y--) {
        for (let x = 0; x < arena[y].length; x++) {
            if (arena[y][x] === 0) continue outer;
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        y++;
        score += 10;
    }
}

function updateScore() {
  document.getElementById('tetris-title').textContent = `🎮 ¡Jugá al Tetris! (Puntos: ${score})`;
  document.getElementById('high-score').textContent = `🏆 Puntuación máxima: ${highScore}`;
}


function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '];
    if (keys.includes(event.key)) event.preventDefault();

    if (event.key === 'ArrowLeft') playerMove(-1);
    else if (event.key === 'ArrowRight') playerMove(1);
    else if (event.key === 'ArrowDown') playerDrop();
    else if (event.key === ' ' || event.key === 'ArrowUp') playerRotate(1);
});

playerReset();
updateScore();
update();
