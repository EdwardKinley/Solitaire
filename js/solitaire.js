document.addEventListener('DOMContentLoaded', () => {

  const board = document.querySelector('.board');

  addRows();
  addSquares();
  addHoles();
  addMarbles();

  movables = [];
  selected = null;
  moves = [];
  lastMover = null;

  prepareToMove();

  function addRows() {
    for (i=0; i<7; i++) {
      addRow(i);
    }
  }

  function addRow(i) {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = `row${i}`;
    row.style.height = `${90/7}%`;
    board.appendChild(row);
  }

  function addSquares() {
    for (j=0; j<7; j++) {
      const row = document.querySelector(`#row${j}`);
      addSquaresToRow(row);
    }
  }

  function addSquaresToRow(row) {
    const rowID = row.id[3];
    for (k=0; k<7; k++) {
      const square = document.createElement('div');
      square.className = 'square';
      square.id = `square${rowID}${k}`;
      square.style.width = `${90/7}%`;
      row.appendChild(square);
    }
  }

  function addHoles() {
    for (i=0; i<7; i++) {
      for (j=0; j<7; j++) {
        if (((i<2 || i>4) && ((j>1) && (j<5))) || (i>1 && i<5)) {
          addHole(document.querySelector(`#square${i}${j}`));
        }
      }
    }
  }

  function addHole(square) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    hole.id = `hole${square.id.substring(6)}`;
    square.appendChild(hole);
  }

  function addMarbles() {
    const photos = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];
    for (i=0; i<7; i++) {
      for (j=0; j<7; j++) {
        if (((i<2 || i>4) && ((j>1) && (j<5))) || (i==2 || i==4) || (i==3 && j!=3)) {
          // const rn1 = Math.floor(Math.random()*29) + 10;
          const rn = Math.floor(Math.random() * photos.length);
          const pn = photos[rn];
          photos.splice(rn, 1);
          // addMarble(document.querySelector(`#hole${i}${j}`), rn1);
          addMarble(document.querySelector(`#hole${i}${j}`), pn);
        }
      }
    }
  }

  function addMarble(hole, photo) {
    const marble = document.createElement('div');
    marble.className = 'marble';
    marble.id = `marble${hole.id.substring(4)}`;
    marble.style.backgroundImage = `url("images/marble${photo}.png")`;
    hole.appendChild(marble);
  }

  function prepareToMove() {
    movables = identifyMovables();
    if (movables.includes(lastMover)) {
      marble = lastMover;
      makeSelected(lastMover);
    } else {
      lastMover = null;
    }
    if (movables.length == 0) { endGame(); }
    for (i=0; i<movables.length; i++) {
      makeSpinnable(movables[i]);
      movables[i].addEventListener('click', movableClicked);
    }
  }

  function identifyMovables() {
    tempMovables = [];
    const marbles = document.querySelectorAll('.marble');
    for (i=0; i<marbles.length; i++) {
      const thisI = i;
      if (isMovable(marbles[thisI])) {
        tempMovables.push(marbles[thisI]);
      }
    }
    return tempMovables;
  }

  function isMovable(marble) {
    const marbleOneAbove = document.querySelector(`#marble${parseInt(marble.id[6])-1}${parseInt(marble.id[7])}`);
    const holeTwoAbove = document.querySelector(`#hole${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);
    const marbleTwoAbove = document.querySelector(`#marble${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);

    const marbleOneBelow = document.querySelector(`#marble${parseInt(marble.id[6])+1}${parseInt(marble.id[7])}`);
    const holeTwoBelow = document.querySelector(`#hole${parseInt(marble.id[6])+2}${parseInt(marble.id[7])}`);
    const marbleTwoBelow = document.querySelector(`#marble${parseInt(marble.id[6])+2}${parseInt(marble.id[7])}`);

    const marbleOneRight = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])+1}`);
    const holeTwoRight = document.querySelector(`#hole${parseInt(marble.id[6])}${parseInt(marble.id[7])+2}`);
    const marbleTwoRight = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])+2}`);

    const marbleOneLeft = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])-1}`);
    const holeTwoLeft = document.querySelector(`#hole${parseInt(marble.id[6])}${parseInt(marble.id[7])-2}`);
    const marbleTwoLeft = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])-2}`);

    if ((marbleOneAbove != null) && (holeTwoAbove != null) && (marbleTwoAbove == null)) {
      return true;
    } else if ((marbleOneBelow != null) && (holeTwoBelow != null) && (marbleTwoBelow == null)) {
      return true;
    } else if ((marbleOneRight != null) && (holeTwoRight != null) && (marbleTwoRight == null)) {
      return true;
    } else if ((marbleOneLeft != null) && (holeTwoLeft != null) && (marbleTwoLeft == null)) {
      return true;
    }
  }

  function makeSpinnable(marble) {
    marble.classList.add('selectable');
  }

  function movableClicked() {
    const marble = this;
    if (selected == null) { makeSelected(marble); }
    else if (selected != null && selected != marble) { switchSelection(marble); }
    else if (selected == marble) { removeSelection(marble); }
  }

  function makeSelected(marble) {
    selected = marble;
    addBorder(marble);
    identifyMoves(marble);
  }

  function switchSelection(marble) {
    disenableMoves();
    moves = [];
    removeBorder(selected);
    selected = marble;
    addBorder(marble);
    identifyMoves(marble);
  }

  function removeSelection(marble) {
    removeBorder(marble);
    selected = null;
    disenableMoves();
    moves = [];
  }

  function addBorder(marble) {
    marble.parentNode.style.border = '0.5vh solid gold';
  }

  function removeBorder(marble) {
    marble.parentNode.style.border = 0;
  }

  function identifyMoves(marble) {
    tempMoves = [];
    const marbleOneAbove = document.querySelector(`#marble${parseInt(marble.id[6])-1}${parseInt(marble.id[7])}`);
    const holeTwoAbove = document.querySelector(`#hole${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);
    const marbleTwoAbove = document.querySelector(`#marble${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);

    const marbleOneBelow = document.querySelector(`#marble${parseInt(marble.id[6])+1}${parseInt(marble.id[7])}`);
    const holeTwoBelow = document.querySelector(`#hole${parseInt(marble.id[6])+2}${parseInt(marble.id[7])}`);
    const marbleTwoBelow = document.querySelector(`#marble${parseInt(marble.id[6])+2}${parseInt(marble.id[7])}`);

    const marbleOneRight = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])+1}`);
    const holeTwoRight = document.querySelector(`#hole${parseInt(marble.id[6])}${parseInt(marble.id[7])+2}`);
    const marbleTwoRight = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])+2}`);

    const marbleOneLeft = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])-1}`);
    const holeTwoLeft = document.querySelector(`#hole${parseInt(marble.id[6])}${parseInt(marble.id[7])-2}`);
    const marbleTwoLeft = document.querySelector(`#marble${parseInt(marble.id[6])}${parseInt(marble.id[7])-2}`);

    if ((marbleOneAbove != null) && (holeTwoAbove != null) && (marbleTwoAbove == null)) {
      tempMoves.push(holeTwoAbove);
    }
    if ((marbleOneBelow != null) && (holeTwoBelow != null) && (marbleTwoBelow == null)) {
      tempMoves.push(holeTwoBelow);
    }
    if ((marbleOneRight != null) && (holeTwoRight != null) && (marbleTwoRight == null)) {
      tempMoves.push(holeTwoRight);
    }
    if ((marbleOneLeft != null) && (holeTwoLeft != null) && (marbleTwoLeft == null)) {
      tempMoves.push(holeTwoLeft);
    }
    moves = tempMoves;
    enableMoves();
  }

  function enableMoves() {
    for (i=0; i<moves.length; i++) {
      moves[i].addEventListener('click', move);
    }
  }

  function disenableMoves() {
    for (i=0; i<moves.length; i++) {
      moves[i].removeEventListener('click', move);
    }
  }

  function move() {
    makeUnspinnable();
    makeUnmovable();
    movables = [];
    doNotMove();
    moves = [];
    const destination = this;
    const captured = identifyCaptured(selected, destination);
    removeBorder(selected);
    removeMarble(selected);
    removeMarble(captured);
    const photo = `${selected.style.backgroundImage[18]}${selected.style.backgroundImage[19]}`;
    addMarble(this, photo);
    selected = null;
    lastMover = this.firstChild;
    prepareToMove();
  }

  function removeMarble(marble) {
    marble.parentNode.removeChild(marble);
  }

  function identifyCaptured(captor, destination) {
    if (captor.id[6] == destination.id[4] && captor.id[7] > destination.id[5]) { return document.querySelector(`#marble${parseInt(captor.id[6])}${parseInt(captor.id[7])-1}`); }
    else if (captor.id[6] == destination.id[4] && captor.id[7] < destination.id[5]) { return document.querySelector(`#marble${parseInt(captor.id[6])}${parseInt(captor.id[7])+1}`); }
    else if (captor.id[7] == destination.id[5] && captor.id[6] > destination.id[4]) { return document.querySelector(`#marble${parseInt(captor.id[6])-1}${parseInt(captor.id[7])}`); }
    else if (captor.id[7] == destination.id[5] && captor.id[6] < destination.id[4]) { return document.querySelector(`#marble${parseInt(captor.id[6])+1}${parseInt(captor.id[7])}`); }
  }

  function makeUnspinnable() {
    for (i=0; i<movables.length; i++) {
      movables[i].classList.remove('selectable');
    }
  }

  function makeUnmovable() {
    for (i=0; i<movables.length; i++) {
      movables[i].removeEventListener('click', movableClicked);
    }
  }

  function doNotMove() {
    for (i=0; i<moves.length; i++) {
      moves[i].removeEventListener('click', move);
    }
  }

  function endGame() {
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play again';
    document.querySelector('#hole33').appendChild(playAgainButton);
    playAgainButton.addEventListener('click', () => {
      location.reload();
    })
  }

})
