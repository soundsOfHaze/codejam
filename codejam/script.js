const container = document.createElement('div');
const containerBtns = document.createElement('div');
const containerMoves = document.createElement('div');
const win = document.createElement('div');
const shuffle = document.createElement('button');
const stopp = document.createElement('button');
const text = document.createElement('h2');
const moves = document.createElement('h2');
const timer = document.createElement('h2');
const hoorayAlert = document.createElement('h2');
const sound = document.createElement('img');
container.classList.add('container');
containerBtns.classList.add('containerBtns');
shuffle.classList.add('shufBtn');
stopp.classList.add('shufBtn');
stopp.classList.add('disabled');
containerMoves.classList.add('movesCont');
hoorayAlert.classList.add('hooray');
win.classList.add('win');

document.body.appendChild(container);
document.body.appendChild(win);
document.body.prepend(containerBtns);
document.body.insertBefore(containerMoves, container);
containerBtns.appendChild(shuffle);
containerBtns.appendChild(stopp);
containerMoves.appendChild(text);
containerMoves.appendChild(moves);
containerMoves.appendChild(timer);
containerMoves.appendChild(sound);
win.appendChild(hoorayAlert);

shuffle.textContent = 'Shuffle and start';
stopp.textContent = 'Stop';

text.textContent = `Moves:`;
moves.textContent = 0;
timer.textContent = 'Time: 00:00';
let moveCount = 0;
let canBeSwapped = true;

//audio
let isSound = true;
const click = new Audio('sound/ck.wav');
sound.src = 'icons/sound.png';
sound.addEventListener('click', function () {
  if (isSound) {
    sound.src = 'icons/no-sound.png';
    click.volume = 0;
    isSound = false;
  } else {
    sound.src = 'icons/sound.png';
    click.volume = 1;
    isSound = true;
  }
});
//

//timer

let min = 0;
let sec = 0;
let timeCounter;
stopp.addEventListener('click', stopTimer);
//

const btns = [];

for (i = 0; i < 16; i++) {
  const btn = document.createElement('button');
  btn.textContent = i + 1;
  btn.className = 'numberBtn';

  btns.push(btn);
}

btns.forEach((e) => {
  container.appendChild(e);
});
btns[15].style.display = 'none';

let matrixGem = doMatrix(btns.map((e) => Number(e.textContent)));
let a = btns.map((e) => Number(e.textContent));
positionGems(matrixGem);

shuffle.addEventListener('click', function gglol() {
  container.style.pointerEvents = 'unset';
  clearInterval(timeCounter);
  stopp.classList.remove('disabled');
  canBeSwapped = true;
  let timerShuffle = 0;
  let shuffleCount = 0;
  if (shuffleCount === 0) {
    timerShuffle = setInterval(() => {
      mix();
      shuffleCount += 1;
      document.body.style.pointerEvents = 'none';
      container.style.opacity = 0.8;
      if (shuffleCount > 100) {
        clearInterval(timerShuffle);
        document.body.style.pointerEvents = 'unset';
        container.style.opacity = 1;
        ggTimer();
      }
    }, 25);
  }
});

let emptyCell = btns.length;

container.addEventListener('click', (event) => {
  const gg = event.target.closest('button');

  if (!gg) {
    return;
  }

  const numb = Number(gg.textContent);
  const positionBut = findPosNumb(numb, matrixGem);
  const positionEmpty = findPosNumb(emptyCell, matrixGem);

  const swappable = isSwappable(positionBut, positionEmpty);
  if (swappable && canBeSwapped) {
    click.play();
    swap(positionEmpty, positionBut, matrixGem);
    positionGems(matrixGem);
    moveCount += 1;
    moves.textContent = moveCount;
    if (timeCounter) {
      return;
    } else {
      timeCounter = timers();
      stopp.classList.remove('disabled');
    }
  }
});

// Функции

function doMatrix(array) {
  const matrix = [[], [], [], []];
  let x = 0;
  let y = 0;

  for (let i = 0; i < array.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = array[i];
    x++;
  }
  return matrix;
}

function positionGems(matrixGem) {
  for (let y = 0; y < matrixGem.length; y++) {
    for (let x = 0; x < matrixGem[y].length; x++) {
      const val = matrixGem[y][x];
      const num = btns[val - 1];
      styleGems(num, x, y);
    }
  }
}

function styleGems(num, x, y) {
  const trans = 100;
  num.style.transform = `translate3D(${x * trans}%, ${y * trans}%,0)`;
}

// function mixArr(arr) {
//   return arr
//     .map((e) => ({ e, sort: Math.random() }))
//     .sort((a, b) => a.sort - b.sort)
//     .map(({ e }) => e);
// }

function findPosNumb(n, matrixGem) {
  for (let y = 0; y < matrixGem.length; y++) {
    for (let x = 0; x < matrixGem[y].length; x++) {
      if (matrixGem[y][x] === n) {
        return { x, y };
      }
    }
  }
}

function isSwappable(pos1, pos2) {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);

  return (dx === 1 || dy === 1) && (pos1.x === pos2.x || pos1.y === pos2.y);
}

function swap(pos1, pos2, matrixGem) {
  const posCords1 = matrixGem[pos1.y][pos1.x];
  matrixGem[pos1.y][pos1.x] = matrixGem[pos2.y][pos2.x];
  matrixGem[pos2.y][pos2.x] = posCords1;

  if (uWon(matrixGem)) {
    ggWonPosition();
    console.log(uWon(matrixGem));
  }
}

function ggTimer() {
  if (timeCounter) {
    timeCounter = clearInterval(timeCounter);
    timer.textContent = 'Time: 00:00';
    min = 0;
    sec = 0;
    timeCounter = timers();
  } else {
    timeCounter = timers();
  }
}

function timers() {
  return setInterval(function () {
    sec += 1;
    if (sec > 59) {
      sec = 0;
      min += 1;
    }
    timer.textContent = `Time: ${standartTimer(min)}:${standartTimer(sec)}`;
  }, 1000);
}

function standartTimer(x) {
  return x < 10 ? '0' + x : x;
}

function stopTimer() {
  if (timeCounter) {
    timeCounter = clearInterval(timeCounter);
    stopp.textContent = 'Start';
    shuffle.classList.add('disabled');
    canBeSwapped = false;
  } else {
    timeCounter = timers();
    stopp.textContent = 'Stop';
    shuffle.classList.remove('disabled');
    canBeSwapped = true;
  }
}

let forbiddenCords = null;
function mix() {
  moves.textContent = 0;
  moveCount = 0;
  const positionEmpty = findPosNumb(emptyCell, matrixGem);
  const swapCords = findCords({
    positionEmpty,
    matrixGem,
    forbiddenCords,
  });
  const ggCoords = swapCords[Math.floor(Math.random() * swapCords.length)];
  swap(positionEmpty, ggCoords, matrixGem);
  positionGems(matrixGem);
  forbiddenCords = positionEmpty;
}

function findCords({ positionEmpty, matrixGem, forbiddenCords }) {
  const arrCords = [];
  for (let y = 0; y < matrixGem.length; y++) {
    for (let x = 0; x < matrixGem[y].length; x++) {
      if (isSwappable({ x, y }, positionEmpty)) {
        if (!forbiddenCords || !(forbiddenCords.x === x && forbiddenCords.y === y)) {
          arrCords.push({ x, y });
        }
      }
    }
  }
  return arrCords;
}

function lolGG() {
  let timerShuffle = 0;
  let shuffleCount = 0;
  if (shuffleCount === 0) {
    timerShuffle = setInterval(() => {
      mix();
      shuffleCount += 1;
      document.body.style.pointerEvents = 'none';
      container.style.opacity = 0.8;
      if (shuffleCount > 100) {
        clearInterval(timerShuffle);
        document.body.style.pointerEvents = 'unset';
        container.style.opacity = 1;
      }
    }, 0);
  }
}

const won = btns.map((e) => Number(e.textContent));

function uWon(matrixGem) {
  const gem = matrixGem.flat();
  for (let i = 0; i < won.length; i++) {
    if (gem[i] !== won[i]) {
      return false;
    }
  }
  return true;
}

function ggWonPosition() {
  setTimeout(() => {
    hoorayAlert.textContent = `Hooray! You solved the puzzle in ${timer.textContent} and ${moves.textContent} moves!
    Push Shuffle button to start again!`;
    hoorayAlert.style.opacity = '1';
    container.style.pointerEvents = 'none';
    clearInterval(timeCounter);
    setTimeout(() => {
      hoorayAlert.style.opacity = '0';
    }, 5000);
  }, 200);
  // setTimeout(function () {
  //   console.log('URA');
  //   hoorayAlert.textContent = `Hooray! You solved the puzzle in ${timer.textContent} and ${moves.textContent} moves!`;
  //   clearInterval(timeCounter);
  //   container.style.pointerEvents = 'none';
  // }, 200);
}
console.log(won);
window.addEventListener('load', lolGG());
