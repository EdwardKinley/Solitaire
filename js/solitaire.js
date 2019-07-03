document.addEventListener('DOMContentLoaded', () => {

  const board = document.querySelector('.board');

  addRows();
  addSquares();
  addHoles();
  addMarbles();

  movables = [];

  prepareToMove();

  console.log('movables', movables);

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
    // console.log(row);
    const rowID = row.id[3];
    for (k=0; k<7; k++) {
      const square = document.createElement('div');
      square.className = 'square';
      square.id = `square${rowID}${k}`;
      square.style.width = `${90/7}%`;
      // square.textContent = `${square.id}`
      // console.log(square.id);
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
    for (i=0; i<7; i++) {
      for (j=0; j<7; j++) {
        if (((i<2 || i>4) && ((j>1) && (j<5))) || (i==2 || i==4) || (i==3 && j!=3)) {
          addMarble(document.querySelector(`#hole${i}${j}`));
        }
      }
    }
  }

  function addMarble(hole) {
    const marble = document.createElement('div');
    marble.className = 'marble';
    marble.id = `marble${hole.id.substring(4)}`;
    const rn = Math.floor(Math.random()*3) +2;
    marble.style.backgroundImage = `url("images/marble${rn}.png")`;
    hole.appendChild(marble);
  }

  function prepareToMove() {
    movables = identifyMovables();
    for (i=0; i<movables.length; i++) {
      makeSelectable(movables[i]);
    }
  }

  function identifyMovables() {
    movables = [];
    const marbles = document.querySelectorAll('.marble');
    for (i=0; i<marbles.length; i++) {
      const thisI = i;
      if (isMovable(marbles[thisI])) {
        movables.push(marbles[thisI]);
      }
    }
    return movables;
  }

  function isMovable(marble) {
    const marbleOneAbove = document.querySelector(`#marble${parseInt(marble.id[6])-1}${parseInt(marble.id[7])}`);
    const holeTwoAbove = document.querySelector(`#hole${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);
    const marbleTwoAbove = document.querySelector(`#marble${parseInt(marble.id[6])-2}${parseInt(marble.id[7])}`);
    if ((marbleOneAbove != null) && (holeTwoAbove != null) && (marbleTwoAbove == null)) {
      return true;
    }
  }

  function makeSelectable(marble) {
    marble.addEventListener('click', () => {
      addBorder(marble);
      // marble.parentNode.removeChild(marble);
    })
  }

  function addBorder(marble) {
    marble.parentNode.style.border = '0.5vh solid gold';
  }



})
