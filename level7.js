/* 
  level7.js (Updated)
  -------------------------
  Puzzle: "Token Guardian" (Protocol Security)
  - A classic memory matching game.
  - Flip two cards at a time to find matching tokens.
  - Scaled down to fit better on screen (80% original size).
*/

function initLevel7() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Container for the memory game
  const gameContainer = document.createElement('div');
  // Instead of a fixed 520px width, let's use a grid that fits 4 columns at 96px each
  gameContainer.style.display = 'grid';
  gameContainer.style.gridTemplateColumns = 'repeat(4, 96px)';
  gameContainer.style.gridGap = '16px';
  gameContainer.style.justifyContent = 'center';
  puzzleArea.appendChild(gameContainer);

  // Intro dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome, Token Guardian!</strong><br><br>
      Flip two cards at a time to find matching tokens. 
      Secure the protocol by successfully identifying all pairs!
    `);
  }, 300);

  // We define a set of 8 tokens (so total 16 cards)
  const tokenSet = [
    '🔒','🔑','💎','⚔️','🛡️','🌐','⚙️','🔥'
    // You can replace these with your own symbols/emojis/images
  ];

  // We'll create an array that has each token twice
  let cardsArray = [];
  tokenSet.forEach(token => {
    cardsArray.push(token);
    cardsArray.push(token);
  });

  // Shuffle the cards
  cardsArray = shuffleArray(cardsArray);

  // Keep track of revealed cards and matched pairs
  let revealedCards = [];
  let matchedCount = 0;

  // Create card elements
  cardsArray.forEach((token, index) => {
    const card = document.createElement('div');
    card.style.width = '96px';
    card.style.height = '112px';
    card.style.backgroundColor = '#66bb6a'; // green accent color
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.fontSize = '2rem';
    card.style.cursor = 'pointer';
    card.style.userSelect = 'none';

    // We'll track the face state with a data attribute
    card.dataset.state = 'face-down';
    card.dataset.index = index;
    card.dataset.token = token;

    // Initially hidden token
    card.textContent = '';

    // Click event
    card.addEventListener('click', () => handleCardClick(card));

    gameContainer.appendChild(card);
  });

  // Handle a card flip
  function handleCardClick(card) {
    // If already face-up or we already have 2 revealed, ignore
    if (card.dataset.state === 'face-up' || revealedCards.length === 2) {
      return;
    }

    // Flip this card face-up
    flipCardUp(card);
    revealedCards.push(card);

    // If we have 2 revealed cards, check for match
    if (revealedCards.length === 2) {
      checkMatch();
    }
  }

  function flipCardUp(card) {
    card.dataset.state = 'face-up';
    card.textContent = card.dataset.token;
    card.style.backgroundColor = '#aed581'; // slightly lighter green
  }

  function flipCardDown(card) {
    card.dataset.state = 'face-down';
    card.textContent = '';
    card.style.backgroundColor = '#66bb6a';
  }

  function checkMatch() {
    const [card1, card2] = revealedCards;
    if (card1.dataset.token === card2.dataset.token) {
      // Match
      matchedCount++;
      // They remain face-up but disable further clicks
      card1.style.cursor = 'default';
      card2.style.cursor = 'default';
      revealedCards = [];

      // If matchedCount == tokenSet.length, puzzle complete
      if (matchedCount === tokenSet.length) {
        puzzleComplete();
      }
    } else {
      // Not a match, flip them back down after a short delay
      setTimeout(() => {
        flipCardDown(card1);
        flipCardDown(card2);
        revealedCards = [];
      }, 1000);
    }
  }

  function puzzleComplete() {
    setTimeout(() => {
      showGrokDialogue(`
        <strong>All Tokens Matched!</strong><br><br>
        You've ensured only correct tokens are revealed, 
        securing the protocol. Well done, Token Guardian!
      `);
    }, 300);
  }

  // Shuffle helper
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
  }
}
