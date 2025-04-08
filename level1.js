/* 
  level1.js
  -------------------------
  Puzzle: "Escape the Crowded City"
  - A simple maze puzzle
  - Player starts at top-left, needs to reach bottom-right
  - Movement: arrow keys or WASD
  - Demonstrates the concept of Layer 2 being a "fast route"
*/

function initLevel1() {
  const puzzleArea = document.getElementById('puzzle-area');

  // Maze Layout (7x7 grid):
  // 0 = path, 1 = wall
  // S (start) at [0,0], E (end) at [6,6]
  const maze = [
    [0, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 1],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0],
  ];

  const rows = maze.length;
  const cols = maze[0].length;

  // Player position in the grid
  let playerRow = 0;
  let playerCol = 0;

  // Create a container for the maze
  const mazeContainer = document.createElement('div');
  mazeContainer.style.display = 'grid';
  mazeContainer.style.gridTemplateRows = `repeat(${rows}, 40px)`;
  mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
  mazeContainer.style.gap = '2px';
  mazeContainer.style.position = 'relative';

  // Generate maze cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.style.width = '40px';
      cell.style.height = '40px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.borderRadius = '4px';

      if (maze[r][c] === 1) {
        cell.style.backgroundColor = '#999'; // wall
      } else {
        cell.style.backgroundColor = '#fff'; // path
      }

      // Mark Start and Exit visually
      if (r === 0 && c === 0) {
        cell.style.backgroundColor = '#a0ff9b'; // Start (light green)
      }
      if (r === rows - 1 && c === cols - 1) {
        cell.style.backgroundColor = '#ffd56b'; // Exit (light yellow)
      }

      mazeContainer.appendChild(cell);
    }
  }

  // Append mazeContainer to puzzle area
  puzzleArea.appendChild(mazeContainer);

  // Show Grok’s intro message
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to the Crowded City!</strong><br><br>
      Ethereum streets are jam-packed. Find your way to the exit
      using the <em>arrow keys</em> or <em>WASD</em>.
      Discover how Layer 2 (Superseed) provides a faster route!
    `);
  }, 300);

  // Listen for keyboard events
  window.addEventListener('keydown', handleMove);

  function handleMove(e) {
    let newRow = playerRow;
    let newCol = playerCol;

    const key = e.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') {
      newRow--;
    } else if (key === 'arrowdown' || key === 's') {
      newRow++;
    } else if (key === 'arrowleft' || key === 'a') {
      newCol--;
    } else if (key === 'arrowright' || key === 'd') {
      newCol++;
    } else {
      return;
    }

    // Check if new position is within bounds and not a wall
    if (
      newRow >= 0 && newRow < rows &&
      newCol >= 0 && newCol < cols &&
      maze[newRow][newCol] === 0
    ) {
      // Update old cell color if it's neither start nor exit
      const oldCellIndex = playerRow * cols + playerCol;
      const oldCell = mazeContainer.children[oldCellIndex];
      if (!(playerRow === 0 && playerCol === 0) && !(playerRow === rows - 1 && playerCol === cols - 1)) {
        oldCell.style.backgroundColor = '#fff';
      }

      playerRow = newRow;
      playerCol = newCol;

      // Update new cell color if it's not exit
      const newCellIndex = playerRow * cols + playerCol;
      const newCell = mazeContainer.children[newCellIndex];

      // If the new position is the exit
      if (playerRow === rows - 1 && playerCol === cols - 1) {
        newCell.style.backgroundColor = '#ffd56b';
        // Puzzle complete!
        window.removeEventListener('keydown', handleMove);
        setTimeout(() => {
          showGrokDialogue(`
            <strong>Success!</strong><br><br>
            You've found the faster exit out of the crowded city (Ethereum).
            This is exactly what Layer 2 solutions do — they help you
            skip traffic and reduce fees, making it cheaper and
            more efficient. <br><br>
            Great job! 
          `);
        }, 300);
      } else {
        newCell.style.backgroundColor = '#a0ff9b';
      }
    }
  }
}
