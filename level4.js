/* 
  level4.js
  -------------------------
  Puzzle: "Help Your Friends" (Proof of Repayment)
  - A swapping puzzle: 3x3 grid of tiles scrambled.
  - The goal is to swap tiles until the grid is in the correct order.
  - Highlights community repayment incentives in Superseed.
*/

function initLevel4() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Container for the puzzle
  const puzzleContainer = document.createElement('div');
  puzzleContainer.style.display = 'flex';
  puzzleContainer.style.flexDirection = 'column';
  puzzleContainer.style.alignItems = 'center';
  puzzleContainer.style.gap = '1rem';
  puzzleArea.appendChild(puzzleContainer);

  // Title
  const title = document.createElement('h2');
  title.textContent = 'Help Your Friends: Proof of Repayment';
  puzzleContainer.appendChild(title);

  // Intro dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome!</strong><br><br>
      Your friends need help reuniting in the correct order.
      Click on two tiles to swap them, and restore the 3x3 grid.
      By helping others, you earn positive proof in your community.
      Let’s see how quickly you can do it!
    `);
  }, 300);

  // We’ll have a 3x3 grid with 9 tiles
  // The "correct" order will be [0,1,2,3,4,5,6,7,8]
  // We'll label them "F1" through "F9" (F for friends).
  const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let currentOrder = shuffleArray([...correctOrder]);

  // Create a grid container
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateRows = 'repeat(3, 80px)';
  grid.style.gridTemplateColumns = 'repeat(3, 80px)';
  grid.style.gap = '6px';

  puzzleContainer.appendChild(grid);

  // Keep track of first clicked tile for swapping
  let firstClickIndex = null;

  // Render the grid based on currentOrder
  function renderGrid() {
    grid.innerHTML = '';

    currentOrder.forEach((val, index) => {
      const tile = document.createElement('div');
      tile.style.width = '80px';
      tile.style.height = '80px';
      tile.style.display = 'flex';
      tile.style.alignItems = 'center';
      tile.style.justifyContent = 'center';
      tile.style.fontSize = '1.2rem';
      tile.style.fontWeight = 'bold';
      tile.style.backgroundColor = '#ffcc00';
      tile.style.cursor = 'pointer';
      tile.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      tile.textContent = `F${val + 1}`; // “F1” through “F9”

      // Click handler
      tile.addEventListener('click', () => handleTileClick(index));

      grid.appendChild(tile);
    });
  }

  function handleTileClick(index) {
    // If firstClickIndex is null, this is the first tile we pick
    if (firstClickIndex === null) {
      firstClickIndex = index;
    } else {
      // We already have a first tile; swap with the second
      swapTiles(firstClickIndex, index);
      firstClickIndex = null;
      checkSolution();
    }
  }

  // Swap two tiles in currentOrder
  function swapTiles(i, j) {
    const temp = currentOrder[i];
    currentOrder[i] = currentOrder[j];
    currentOrder[j] = temp;
    renderGrid();
  }

  // Check if currentOrder matches correctOrder
  function checkSolution() {
    for (let i = 0; i < correctOrder.length; i++) {
      if (currentOrder[i] !== correctOrder[i]) {
        return; // Not solved yet
      }
    }
    puzzleComplete();
  }

  function puzzleComplete() {
    setTimeout(() => {
      showGrokDialogue(`
        <strong>Great job!</strong><br><br>
        You helped your friends return to the right order.
        In Superseed, helping others shows your positive 
        actions and boosts your reputation and rewards. 
        This is what we call “Proof of Repayment!”
      `);
    }, 300);
  }

  // Shuffle helper function
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
  }

  // Initial render
  renderGrid();
}
