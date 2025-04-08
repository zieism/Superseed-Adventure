/* 
  level3.js
  -------------------------
  Puzzle: "Magic of Reduction" (Auto-Repayment)
  - A mini-game where the player moves a character around 
    to collect stars.
  - Each star reduces a "debt" bar. 
  - Once debt is fully repaid (bar reaches 0), puzzle is done.
  - Represents the concept of auto-repayment in Superseed.
*/

function initLevel3() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Create a container for the game
  const gameContainer = document.createElement('div');
  gameContainer.style.width = '600px';
  gameContainer.style.height = '400px';
  gameContainer.style.border = '2px solid #ccc';
  gameContainer.style.position = 'relative';
  gameContainer.style.overflow = 'hidden';
  gameContainer.style.backgroundColor = '#ffffff';
  puzzleArea.appendChild(gameContainer);

  // Debt bar container
  const debtBarContainer = document.createElement('div');
  debtBarContainer.style.width = '80%';
  debtBarContainer.style.height = '20px';
  debtBarContainer.style.backgroundColor = '#eee';
  debtBarContainer.style.border = '1px solid #999';
  debtBarContainer.style.margin = '0 auto 1rem auto';
  debtBarContainer.style.borderRadius = '4px';
  debtBarContainer.style.overflow = 'hidden';
  puzzleArea.insertBefore(debtBarContainer, gameContainer);

  // Debt bar (filled portion)
  const debtBarFill = document.createElement('div');
  debtBarFill.style.width = '100%';  // start at 100% debt
  debtBarFill.style.height = '100%';
  debtBarFill.style.backgroundColor = '#ff6f91';
  debtBarFill.style.transition = 'width 0.5s';
  debtBarContainer.appendChild(debtBarFill);

  // Show initial Grok dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to the Magic of Reduction!</strong><br><br>
      You've got a <em>debt bar</em> above. 
      Collect these moving stars to automatically reduce your debt. 
      Move with <em>arrow keys</em> or <em>WASD</em>. 
      See how each star helps "auto-repay" your balance!
    `);
  }, 300);

  // Track debt as a percentage (start at 100, goal is 0)
  let debt = 100;

  // Create player character
  const player = document.createElement('div');
  player.style.width = '30px';
  player.style.height = '30px';
  player.style.backgroundColor = '#ffcc00';
  player.style.borderRadius = '50%';
  player.style.position = 'absolute';
  player.style.left = '10px';
  player.style.top = '10px';
  player.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  gameContainer.appendChild(player);

  // Player's movement speed
  const speed = 5;

  // Stars array
  const stars = [];
  const starCount = 5;

  // Create stars
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.style.width = '20px';
    star.style.height = '20px';
    star.style.backgroundColor = '#a0ff9b';
    star.style.borderRadius = '50%';
    star.style.position = 'absolute';
    // Random initial position
    star.style.left = Math.random() * (600 - 20) + 'px';
    star.style.top = Math.random() * (400 - 20) + 'px';
    star.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    gameContainer.appendChild(star);

    // Random velocity
    const vx = (Math.random() * 2 - 1) * 1.5; // range: -1.5 to 1.5
    const vy = (Math.random() * 2 - 1) * 1.5; // range: -1.5 to 1.5

    stars.push({ star, vx, vy });
  }

  // Handle player movement
  let keysPressed = {};

  window.addEventListener('keydown', e => {
    keysPressed[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', e => {
    keysPressed[e.key.toLowerCase()] = false;
  });

  // Update loop
  let lastTime = 0;
  function update(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    movePlayer(delta);
    moveStars(delta);
    checkCollisions();
    
    if (debt > 0) {
      requestAnimationFrame(update);
    }
  }

  // Move player based on keys pressed
  function movePlayer(delta) {
    let px = parseFloat(player.style.left);
    let py = parseFloat(player.style.top);

    // For simplicity, the same speed no matter the framerate
    const dist = speed; 

    if (keysPressed['arrowup'] || keysPressed['w']) {
      py -= dist;
    }
    if (keysPressed['arrowdown'] || keysPressed['s']) {
      py += dist;
    }
    if (keysPressed['arrowleft'] || keysPressed['a']) {
      px -= dist;
    }
    if (keysPressed['arrowright'] || keysPressed['d']) {
      px += dist;
    }

    // Boundaries
    px = Math.max(0, Math.min(600 - 30, px));
    py = Math.max(0, Math.min(400 - 30, py));

    player.style.left = px + 'px';
    player.style.top = py + 'px';
  }

  // Move stars in random directions, bounce off walls
  function moveStars(delta) {
    for (let s of stars) {
      let x = parseFloat(s.star.style.left);
      let y = parseFloat(s.star.style.top);

      x += s.vx;
      y += s.vy;

      // Bounce on edges
      if (x < 0) {
        x = 0;
        s.vx *= -1;
      } else if (x > 580) {
        x = 580;
        s.vx *= -1;
      }
      if (y < 0) {
        y = 0;
        s.vy *= -1;
      } else if (y > 380) {
        y = 380;
        s.vy *= -1;
      }

      s.star.style.left = x + 'px';
      s.star.style.top = y + 'px';
    }
  }

  // Check collision between player and stars
  function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    
    for (let i = stars.length - 1; i >= 0; i--) {
      const sRect = stars[i].star.getBoundingClientRect();

      if (isColliding(playerRect, sRect)) {
        // Remove star from game
        gameContainer.removeChild(stars[i].star);
        stars.splice(i, 1);

        // Reduce debt
        debt = Math.max(0, debt - 20); // each star reduces 20% (5 stars total)
        debtBarFill.style.width = debt + '%';

        if (debt === 0) {
          // Puzzle complete
          puzzleComplete();
        }
      }
    }
  }

  function isColliding(r1, r2) {
    return !(
      r1.right < r2.left ||
      r1.left > r2.right ||
      r1.bottom < r2.top ||
      r1.top > r2.bottom
    );
  }

  function puzzleComplete() {
    setTimeout(() => {
      showGrokDialogue(`
        <strong>Debt Repaid!</strong><br><br>
        You collected enough resources to automatically 
        clear your debt. Superseed’s auto-repayment 
        feature ensures liabilities shrink continuously, 
        much like you just demonstrated!
      `);
    }, 300);
  }

  // Start animation
  requestAnimationFrame(update);
}
