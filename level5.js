/* 
  level5.js
  -------------------------
  Puzzle: "Busy Market" (Supersale)
  - A simple Match-3 style game on a 6x6 grid.
  - Players swap adjacent tokens to make lines of 3+.
  - Matches disappear, new tokens fall in.
  - Illustrates fair token distribution in a busy market.
*/

function initLevel5() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Container for the puzzle
  const gameContainer = document.createElement('div');
  gameContainer.style.width = '360px'; // 6 columns * 60px tokens
  gameContainer.style.height = '360px'; // 6 rows * 60px tokens
  gameContainer.style.border = '2px solid #ccc';
  gameContainer.style.display = 'grid';
  gameContainer.style.gridTemplateRows = 'repeat(6, 60px)';
  gameContainer.style.gridTemplateColumns = 'repeat(6, 60px)';
  gameContainer.style.gap = '2px';
  puzzleArea.appendChild(gameContainer);

  // Intro dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to the Busy Market!</strong><br><br>
      A rush of people want Superseed tokens. 
      Swap adjacent tokens to align 3 or more of the same color. 
      This ensures fair distribution in a frenzied market!
    `);
  }, 300);

  // We define a 6x6 grid
  const rows = 6;
  const cols = 6;
  const colors = ['red', 'green', 'blue', 'yellow', 'purple'];

  // Board data structure (2D array)
  let board = [];

  // For swapping, track first clicked cell
  let firstClick = null;

  // Initialize the board with random colors
  function initBoard() {
    board = [];
    for (let r = 0; r < rows; r++) {
      const rowArr = [];
      for (let c = 0; c < cols; c++) {
        // Choose a random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        rowArr.push(color);
      }
      board.push(rowArr);
    }
    // Remove any initial matches
    removeMatches();
  }

  // Render the board to the screen
  function renderBoard() {
    gameContainer.innerHTML = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.style.width = '60px';
        cell.style.height = '60px';
        cell.style.backgroundColor = board[r][c];
        cell.style.borderRadius = '4px';
        cell.style.cursor = 'pointer';
        cell.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

        cell.dataset.row = r;
        cell.dataset.col = c;

        // Click handler
        cell.addEventListener('click', () => handleCellClick(r, c));

        gameContainer.appendChild(cell);
      }
    }
  }

  function handleCellClick(r, c) {
    if (!firstClick) {
      // First click
      firstClick = { row: r, col: c };
    } else {
      // Second click
      const secondClick = { row: r, col: c };

      // Check if adjacent
      if (isAdjacent(firstClick, secondClick)) {
        // Swap
        swapCells(firstClick.row, firstClick.col, secondClick.row, secondClick.col);
        // After swap, check for matches
        if (!removeMatches()) {
          // If no match formed, swap back
          swapCells(firstClick.row, firstClick.col, secondClick.row, secondClick.col);
        } else {
          // If matches formed, keep them, then fill the board
          dropAndRefill();
        }
      }

      firstClick = null;
    }
  }

  function isAdjacent(a, b) {
    const rowDiff = Math.abs(a.row - b.row);
    const colDiff = Math.abs(a.col - b.col);
    return (rowDiff + colDiff === 1);
  }

  // Swap two cells in the board array
  function swapCells(r1, c1, r2, c2) {
    const temp = board[r1][c1];
    board[r1][c1] = board[r2][c2];
    board[r2][c2] = temp;
    renderBoard();
  }

  // Remove matches of 3 or more
  // Returns true if any match was found
  function removeMatches() {
    let matched = false;
    const toRemove = [];

    // Mark cells to remove
    // Horizontal checks
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
        const color = board[r][c];
        if (color && board[r][c+1] === color && board[r][c+2] === color) {
          toRemove.push({ r, c });
          toRemove.push({ r, c: c+1 });
          toRemove.push({ r, c: c+2 });
        }
      }
    }
    // Vertical checks
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
        const color = board[r][c];
        if (color && board[r+1][c] === color && board[r+2][c] === color) {
          toRemove.push({ r, c });
          toRemove.push({ r: r+1, c });
          toRemove.push({ r: r+2, c });
        }
      }
    }

    if (toRemove.length > 0) {
      matched = true;
      // Remove duplicates
      const uniqueRemovals = [];
      toRemove.forEach(obj => {
        if (!uniqueRemovals.find(u => u.r === obj.r && u.c === obj.c)) {
          uniqueRemovals.push(obj);
        }
      });

      // Clear matched cells
      uniqueRemovals.forEach(cell => {
        board[cell.r][cell.c] = null; 
      });
      renderBoard();
    }

    return matched;
  }

  // Let tokens "drop" into empty spaces, then refill the top
  function dropAndRefill() {
    // Drop down
    for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c] === null) {
          // Find above cell that isn't null
          for (let above = r - 1; above >= 0; above--) {
            if (board[above][c] !== null) {
              board[r][c] = board[above][c];
              board[above][c] = null;
              break;
            }
          }
        }
      }
    }
    // Fill top row nulls with new color
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c] === null) {
          board[r][c] = colors[Math.floor(Math.random() * colors.length)];
        }
      }
    }

    renderBoard();

    // Check if new matches formed
    setTimeout(() => {
      if (removeMatches()) {
        // Keep dropping and refilling until no new matches
        setTimeout(() => {
          dropAndRefill();
        }, 300);
      }
    }, 300);
  }

  // Initialize board and render
  initBoard();
  renderBoard();

  // Show a final note if the player keeps matching
  // (Optional) We can show success once the user achieves certain combos 
  // but for simplicity, we'll show a general completion after some time or multiple matches.
  // For demonstration, let's show a "Market Balanced" message if many matches occur.
  let matchCount = 0;
  const originalRemoveMatches = removeMatches;
  removeMatches = function() {
    const result = originalRemoveMatches.apply(this, arguments);
    if (result) {
      matchCount++;
      if (matchCount >= 3) {
        showGrokDialogue(`
          <strong>Fantastic!</strong><br><br>
          You've demonstrated how fair distribution works 
          even in a hectic environment. Everyone gets a fair 
          chance at these tokens. That’s the essence of Supersale!
        `);
        // Reset matchCount so they can keep playing
        matchCount = 0;
      }
    }
    return result;
  };
}
