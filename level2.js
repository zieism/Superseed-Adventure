/* 
  level2.js
  -------------------------
  Puzzle: "Golden Lock" (Supercollateral)
  - A color-matching puzzle with lock dials.
  - Players rotate each dial until the sequence matches the "correct" pattern.
  - Demonstrates collateral concept: once aligned, vault opens to reveal stablecoins.
*/

function initLevel2() {
  const puzzleArea = document.getElementById('puzzle-area');
  
  // Clear puzzle area just in case
  puzzleArea.innerHTML = '';

  // Create container for the lock puzzle
  const lockContainer = document.createElement('div');
  lockContainer.style.display = 'flex';
  lockContainer.style.flexDirection = 'column';
  lockContainer.style.alignItems = 'center';
  lockContainer.style.gap = '1rem';

  // Title or prompt
  const title = document.createElement('h2');
  title.textContent = 'Golden Lock: Supercollateral';
  lockContainer.appendChild(title);

  // Instruction from Grok (initial)
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to the Golden Lock!</strong><br><br>
      This vault holds magic coins (stablecoins). 
      Turn each dial to match the correct color sequence.
      Think of it like securing collateral: you need 
      the right combination to unlock these coins safely!
    `);
  }, 300);

  // Correct color sequence
  // We'll have 4 dials, each can be one of 4 colors: red, green, blue, yellow
  const correctCombo = ['red', 'green', 'blue', 'yellow'];

  // Create the dial elements
  const dialRow = document.createElement('div');
  dialRow.style.display = 'flex';
  dialRow.style.gap = '1rem';

  const colors = ['red', 'green', 'blue', 'yellow'];

  // We'll store the player's current dial states in an array
  let playerCombo = ['red', 'red', 'red', 'red']; // default all dials to 'red'

  // Function to create each dial
  function createDial(index) {
    const dial = document.createElement('div');
    dial.style.width = '60px';
    dial.style.height = '60px';
    dial.style.borderRadius = '50%';
    dial.style.backgroundColor = playerCombo[index];
    dial.style.cursor = 'pointer';
    dial.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    dial.style.display = 'flex';
    dial.style.justifyContent = 'center';
    dial.style.alignItems = 'center';
    dial.style.fontWeight = 'bold';
    dial.style.color = '#fff';
    dial.style.userSelect = 'none';

    // Each time the dial is clicked, cycle to the next color
    dial.addEventListener('click', () => {
      const currentColor = playerCombo[index];
      const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
      const newColor = colors[nextColorIndex];
      playerCombo[index] = newColor;
      dial.style.backgroundColor = newColor;

      checkCombo();
    });

    return dial;
  }

  // Create 4 dials
  const dials = [];
  for (let i = 0; i < 4; i++) {
    const dial = createDial(i);
    dials.push(dial);
    dialRow.appendChild(dial);
  }

  lockContainer.appendChild(dialRow);

  // Result / Vault reveal area
  const resultBox = document.createElement('div');
  resultBox.style.marginTop = '1rem';
  resultBox.style.textAlign = 'center';
  lockContainer.appendChild(resultBox);

  // Check if player's combo matches correct combo
  function checkCombo() {
    // Compare arrays
    for (let i = 0; i < 4; i++) {
      if (playerCombo[i] !== correctCombo[i]) {
        return; // not matched yet
      }
    }
    // If we reach here, puzzle solved!
    puzzleSolved();
  }

  function puzzleSolved() {
    // Show stablecoins / vault open message
    resultBox.innerHTML = `
      <p style="color: green; font-size: 1.2rem; margin-bottom: 1rem;">
        Vault Unlocked! You’ve aligned the collateral correctly.
      </p>
      <div style="font-size: 1rem;">
        The magic coins (stablecoins) are yours!
      </div>
    `;

    // Also show final explanation from Grok
    setTimeout(() => {
      showGrokDialogue(`
        <strong>Well done!</strong><br><br>
        By matching the correct collateral combination,
        you’ve unlocked stablecoins. In Superseed, 
        collateralization is key: it ensures that these 
        magic coins remain stable and well-backed, 
        just like you've demonstrated with this Golden Lock!
      `);
    }, 500);

    // Optionally, you can disable further clicks on dials
    dials.forEach(dial => {
      dial.style.pointerEvents = 'none';
    });
  }

  // Add lock puzzle to puzzle area
  puzzleArea.appendChild(lockContainer);
}
