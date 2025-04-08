/* 
  main.js (Updated)
  -------------------
  1. Displays the main menu
  2. Loads each level’s JS puzzle
  3. Handles "Back", "Reset", "Next Level" buttons
  4. Shows / hides Grok’s dialogue
  5. Controls new "About" and "Help" windows
*/

// Store the currently active level number (1 to 8)
let currentLevel = null;

/************************************************************
 * Screen Switching
 ************************************************************/
function showScreen(screenId) {
  // Hide all screens
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  // Show the requested screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
  }
}

/************************************************************
 * Main Menu Setup
 ************************************************************/
function setupMainMenu() {
  // Grab all level buttons
  const levelButtons = document.querySelectorAll('.level-btn');
  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Parse level number from data attribute
      const levelNum = parseInt(btn.getAttribute('data-level'));
      loadLevel(levelNum);
    });
  });

  // About SuperSeed button
  const aboutBtn = document.getElementById('about-btn');
  aboutBtn.addEventListener('click', () => {
    showFloatingWindow('about-window');
  });

  // Help button
  const helpBtn = document.getElementById('help-btn');
  helpBtn.addEventListener('click', () => {
    showFloatingWindow('help-window');
  });
}

/************************************************************
 * Floating Windows (About, Help)
 ************************************************************/
function showFloatingWindow(windowId) {
  const windowEl = document.getElementById(windowId);
  if (windowEl) {
    windowEl.style.display = 'block';
  }
}

function hideFloatingWindow(windowId) {
  const windowEl = document.getElementById(windowId);
  if (windowEl) {
    windowEl.style.display = 'none';
  }
}

/************************************************************
 * Loading / Unloading Levels
 ************************************************************/
function loadLevel(levelNum) {
  currentLevel = levelNum;

  // Show the level container screen
  showScreen('level-container');

  // Clear any existing puzzle content
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Call the init function from the appropriate level file
  switch (levelNum) {
    case 1:
      initLevel1();
      break;
    case 2:
      initLevel2();
      break;
    case 3:
      initLevel3();
      break;
    case 4:
      initLevel4();
      break;
    case 5:
      initLevel5();
      break;
    case 6:
      initLevel6();
      break;
    case 7:
      initLevel7();
      break;
    case 8:
      initLevel8();
      break;
    default:
      console.error('Invalid level number:', levelNum);
      showScreen('main-menu');
      break;
  }
}

function unloadCurrentLevel() {
  currentLevel = null;
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';
}

/************************************************************
 * Navigation Buttons: Back, Reset, Next Level
 ************************************************************/
function setupNavigationButtons() {
  const backMenuBtn = document.getElementById('back-menu-btn');
  const resetLevelBtn = document.getElementById('reset-level-btn');
  const skipLevelBtn = document.getElementById('skip-level-btn'); // "Next Level"

  // Back to main menu
  backMenuBtn.addEventListener('click', () => {
    unloadCurrentLevel();
    showScreen('main-menu');
  });

  // Reset current level
  resetLevelBtn.addEventListener('click', () => {
    if (currentLevel) {
      loadLevel(currentLevel);
    }
  });

  // Next Level
  skipLevelBtn.addEventListener('click', () => {
    if (currentLevel && currentLevel < 8) {
      loadLevel(currentLevel + 1);
    } else {
      // If we're at level 8, next level goes back to main menu (or we could do something else)
      showScreen('main-menu');
    }
  });
}

/************************************************************
 * Grok's Dialogue: Show / Hide
 ************************************************************/
function showGrokDialogue(text) {
  const dialogueBox = document.getElementById('grok-dialogue');
  const dialogueText = document.getElementById('grok-dialogue-text');
  dialogueText.innerHTML = text;
  dialogueBox.style.display = 'block';
}

function hideGrokDialogue() {
  const dialogueBox = document.getElementById('grok-dialogue');
  dialogueBox.style.display = 'none';
}

/************************************************************
 * Initialization on Page Load
 ************************************************************/
window.addEventListener('DOMContentLoaded', () => {
  // Show main menu by default
  showScreen('main-menu');

  // Prepare main menu level selection & new buttons
  setupMainMenu();

  // Prepare nav buttons in level container
  setupNavigationButtons();

  // Setup Grok's dialogue close button
  const grokCloseBtn = document.getElementById('grok-dialogue-close');
  grokCloseBtn.addEventListener('click', hideGrokDialogue);

  // About & Help windows close buttons
  const closeAbout = document.getElementById('close-about');
  if (closeAbout) {
    closeAbout.addEventListener('click', () => hideFloatingWindow('about-window'));
  }

  const closeHelp = document.getElementById('close-help');
  if (closeHelp) {
    closeHelp.addEventListener('click', () => hideFloatingWindow('help-window'));
  }
});
