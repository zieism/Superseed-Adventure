/* 
  level8.js (Updated)
  -------------------------
  Puzzle: "Future City" (Community Focus)
  - A simplified Tetris-like game, scaled down ~20% (24px blocks).
  - After clearing enough lines, ask if user wants to keep playing 
    or return to the main menu.
*/

function initLevel8() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Container for the Tetris board
  const gameContainer = document.createElement('div');
  // Scaled down from 300x600 to 240x480
  gameContainer.style.width = '240px';
  gameContainer.style.height = '480px';
  gameContainer.style.border = '2px solid #ccc';
  gameContainer.style.position = 'relative';
  puzzleArea.appendChild(gameContainer);

  // Intro dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to Future City!</strong><br><br>
      Stack these falling city blocks to build a thriving community.
      Use <em>Left/Right</em> to move, <em>Up</em> to rotate,
      and <em>Down</em> to speed-drop. Clear lines to grow the city!
    `);
  }, 300);

  // Dimensions
  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 24; // 24px instead of 30

  // Create the board array (ROWS x COLS), all null
  let board = [];
  for (let r = 0; r < ROWS; r++) {
    const row = new Array(COLS).fill(null);
    board.push(row);
  }

  // Create cell divs for rendering
  let cellDivs = [];
  for (let r = 0; r < ROWS; r++) {
    const rowDivs = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.style.position = 'absolute';
      cell.style.width = BLOCK_SIZE + 'px';
      cell.style.height = BLOCK_SIZE + 'px';
      cell.style.left = c * BLOCK_SIZE + 'px';
      cell.style.top = r * BLOCK_SIZE + 'px';
      cell.style.border = '1px solid #eee';
      cell.style.boxSizing = 'border-box';
      gameContainer.appendChild(cell);
      rowDivs.push(cell);
    }
    cellDivs.push(rowDivs);
  }

  // Tetrimino definitions
  const SHAPES = {
    I: [[0,0],[0,1],[0,2],[0,3]],
    O: [[0,0],[0,1],[1,0],[1,1]],
    T: [[0,1],[1,0],[1,1],[1,2]],
    S: [[0,1],[0,2],[1,0],[1,1]],
    Z: [[0,0],[0,1],[1,1],[1,2]],
    J: [[0,0],[1,0],[1,1],[1,2]],
    L: [[0,2],[1,0],[1,1],[1,2]],
  };
  const SHAPE_KEYS = Object.keys(SHAPES);
  const COLORS = {
    I: '#ff6f91',
    O: '#ffcc00',
    T: '#66f',
    S: '#a0ff9b',
    Z: '#f99',
    J: '#9fc',
    L: '#fc9',
  };

  let currentShape = null;
  let currentColor = null;
  let position = { row: 0, col: 3 };
  let rotationState = 0;

  // Track lines
  let linesCleared = 0;
  const LINES_TO_CLEAR = 2;

  // Interval for dropping pieces
  let gameInterval = null;

  // Spawn a new piece
  function spawnPiece() {
    const randKey = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
    currentShape = SHAPES[randKey];
    currentColor = COLORS[randKey];
    position = { row: 0, col: 3 };
    rotationState = 0;

    // If we can't move at spawn, "end" the puzzle
    if (!canMove(0, 0, currentShape)) {
      puzzleComplete();
    }
  }

  // Rotation logic
  function rotatePiece() {
    // naive rotation: (row, col) => (col, -row)
    let newShape = currentShape.map(([r, c]) => [c, -r]);
    // shift so they're >= 0
    let minRow = Math.min(...newShape.map(pt => pt[0]));
    let minCol = Math.min(...newShape.map(pt => pt[1]));
    newShape = newShape.map(([r, c]) => [r - minRow, c - minCol]);

    if (canMove(0, 0, newShape)) {
      currentShape = newShape;
    }
  }

  // Check collisions
  function canMove(dRow, dCol, shape) {
    for (let [r, c] of shape) {
      let newR = position.row + r + dRow;
      let newC = position.col + c + dCol;
      // out of bounds
      if (newR < 0 || newR >= ROWS || newC < 0 || newC >= COLS) {
        return false;
      }
      // collision with existing block
      if (board[newR][newC]) {
        return false;
      }
    }
    return true;
  }

  // Place piece in board
  function placePiece() {
    for (let [r, c] of currentShape) {
      let newR = position.row + r;
      let newC = position.col + c;
      board[newR][newC] = currentColor;
    }
    clearLines();
  }

  // Clear filled lines
  function clearLines() {
    for (let r = 0; r < ROWS; r++) {
      if (board[r].every(cell => cell !== null)) {
        board.splice(r, 1);
        board.unshift(new Array(COLS).fill(null));
        linesCleared++;
      }
    }
    if (linesCleared >= LINES_TO_CLEAR) {
      puzzleComplete();
    }
  }

  // Drop piece each tick
  function tick() {
    if (canMove(1, 0, currentShape)) {
      position.row++;
    } else {
      placePiece();
      spawnPiece();
    }
    render();
  }

  // Render everything
  function render() {
    // clear board
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let color = board[r][c];
        cellDivs[r][c].style.backgroundColor = color ? color : '';
      }
    }
    // draw current piece
    for (let [r, c] of currentShape) {
      let drawR = position.row + r;
      let drawC = position.col + c;
      if (drawR >= 0 && drawR < ROWS && drawC >= 0 && drawC < COLS) {
        cellDivs[drawR][drawC].style.backgroundColor = currentColor;
      }
    }
  }

  // Keyboard events
  function handleKey(e) {
    const key = e.key.toLowerCase();
    if (key === 'arrowleft') {
      if (canMove(0, -1, currentShape)) {
        position.col--;
        render();
      }
    } else if (key === 'arrowright') {
      if (canMove(0, 1, currentShape)) {
        position.col++;
        render();
      }
    } else if (key === 'arrowup') {
      rotatePiece();
      render();
    } else if (key === 'arrowdown') {
      // fast drop
      if (canMove(1, 0, currentShape)) {
        position.row++;
        render();
      }
    }
  }
  window.addEventListener('keydown', handleKey);

  // Start the game
  spawnPiece();
  render();
  gameInterval = setInterval(tick, 600);

  // Puzzle completion with Yes/No prompt
  function puzzleComplete() {
    clearInterval(gameInterval);
    setTimeout(() => {
      showEndgamePrompt();
    }, 300);
  }

  function showEndgamePrompt() {
    const dialogueBox = document.getElementById('grok-dialogue');
    const dialogueText = document.getElementById('grok-dialogue-text');
    const closeButton = document.getElementById('grok-dialogue-close');

    dialogueText.innerHTML = `
      <strong>Skyline Complete!</strong><br><br>
      You’ve built a thriving future city!<br><br>
      Now that you’ve finished all the levels,<br>
      would you like to continue playing Tetris?<br><br>
    `;

    // Hide the default OK button
    closeButton.style.display = 'none';

    // Yes button
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes, I’ll continue';
    yesBtn.style.marginRight = '1rem';

    // No button
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No, thanks';

    yesBtn.addEventListener('click', () => {
      // Close dialogue, restore the close button, resume the game
      dialogueBox.style.display = 'none';
      closeButton.style.display = '';
      linesCleared = 0; // reset lines if you want
      gameInterval = setInterval(tick, 600); // continue playing
    });

    noBtn.addEventListener('click', () => {
      dialogueBox.style.display = 'none';
      closeButton.style.display = '';
      showScreen('main-menu'); // back to main menu
    });

    // Add buttons to the dialogue
    dialogueText.appendChild(yesBtn);
    dialogueText.appendChild(noBtn);

    // Show the dialogue box
    dialogueBox.style.display = 'block';
  }
}
