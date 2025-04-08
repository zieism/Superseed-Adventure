/* 
  level6.js
  -------------------------
  Puzzle: "Magic Bridges" (Superchain)
  - We have several islands that must be connected with "bridges."
  - The user clicks on two islands to draw a bridge.
  - Once the correct network of bridges is established, the puzzle completes.
  - Demonstrates Superseed’s bridging role in the Superchain.
*/

function initLevel6() {
  const puzzleArea = document.getElementById('puzzle-area');
  puzzleArea.innerHTML = '';

  // Container for the islands and bridges
  const mapContainer = document.createElement('div');
  mapContainer.style.width = '600px';
  mapContainer.style.height = '400px';
  mapContainer.style.position = 'relative';
  mapContainer.style.border = '2px solid #ccc';
  mapContainer.style.backgroundColor = '#ffffff';
  puzzleArea.appendChild(mapContainer);

  // Intro dialogue
  setTimeout(() => {
    showGrokDialogue(`
      <strong>Welcome to Magic Bridges!</strong><br><br>
      These islands represent different blockchains. Connect them
      in the correct way to form a seamless Superchain. 
      Click one island, then another to build a bridge.
    `);
  }, 300);

  /* 
   Islands Setup
   -------------
   We'll define 5 islands, each with:
     - an id
     - coordinates (x, y) within the mapContainer
   We'll define a "correctBridges" array that lists which pairs must be connected.
   Puzzle completes when all required pairs are connected (in any order).
  */

  const islands = [
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 400, y: 100 },
    { id: 'C', x: 250, y: 200 },
    { id: 'D', x: 150, y: 300 },
    { id: 'E', x: 450, y: 300 }
  ];

  // Bridges that must be formed to solve the puzzle (unordered pairs of island IDs)
  const correctBridges = [
    ['A','C'],
    ['B','C'],
    ['C','D'],
    ['C','E']
  ];
  // The puzzle logic: 
  //  - A <-> C
  //  - B <-> C
  //  - C <-> D
  //  - C <-> E
  // This effectively makes island C the central hub connecting to all others.
  // You can tweak this to any bridging pattern you like.

  // We'll track bridges the player has made using a Set for quick checks
  // We'll store them as strings like "A|C" always sorted alphabetically to avoid duplicates ("C|A" vs "A|C")
  const playerBridges = new Set();

  // Draw islands on the map
  islands.forEach(island => {
    const islandDiv = document.createElement('div');
    islandDiv.textContent = island.id;
    islandDiv.style.width = '40px';
    islandDiv.style.height = '40px';
    islandDiv.style.borderRadius = '50%';
    islandDiv.style.backgroundColor = '#ffcc00';
    islandDiv.style.display = 'flex';
    islandDiv.style.alignItems = 'center';
    islandDiv.style.justifyContent = 'center';
    islandDiv.style.position = 'absolute';
    islandDiv.style.left = `${island.x - 20}px`; 
    islandDiv.style.top = `${island.y - 20}px`;  
    islandDiv.style.cursor = 'pointer';
    islandDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    islandDiv.style.fontWeight = 'bold';

    // For identification
    islandDiv.dataset.id = island.id;

    // Click handling
    islandDiv.addEventListener('click', () => handleIslandClick(island.id));

    mapContainer.appendChild(islandDiv);
  });

  // We'll store the first island clicked
  let firstIsland = null;

  function handleIslandClick(islandId) {
    if (!firstIsland) {
      // This is the first island in a potential bridge
      firstIsland = islandId;
    } else {
      // Second island
      if (firstIsland !== islandId) {
        // Create a bridge (or attempt to)
        addBridge(firstIsland, islandId);
      }
      // Reset firstIsland to null
      firstIsland = null;
    }
  }

  // Function to add a bridge visually and record it
  function addBridge(id1, id2) {
    // Sort the IDs alphabetically to maintain consistency (e.g. "A|C" instead of "C|A")
    const pair = [id1, id2].sort();
    const bridgeKey = pair.join('|');

    // Check if we already have this bridge
    if (playerBridges.has(bridgeKey)) {
      // Player already connected these islands
      return;
    }

    // Draw the bridge on the map
    drawBridge(pair[0], pair[1]);
    // Record it
    playerBridges.add(bridgeKey);

    // Check for completion
    checkPuzzleComplete();
  }

  // Draw a line between two island centers
  function drawBridge(id1, id2) {
    // Find island objects
    const islandA = islands.find(i => i.id === id1);
    const islandB = islands.find(i => i.id === id2);

    // Coordinates for A
    const x1 = islandA.x;
    const y1 = islandA.y;

    // Coordinates for B
    const x2 = islandB.x;
    const y2 = islandB.y;

    // We'll draw a "bridge" as an absolutely positioned <div> with a 2px solid line
    const bridgeDiv = document.createElement('div');
    bridgeDiv.style.position = 'absolute';
    bridgeDiv.style.backgroundColor = '#66f'; // a simple color for the bridge
    // thickness
    bridgeDiv.style.height = '2px';

    // Calculate the distance and angle
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Position the bridge at midpoint between the two islands
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    bridgeDiv.style.width = distance + 'px';
    // Shift so that the bridge center aligns at midpoint
    bridgeDiv.style.left = (midX - distance/2) + 'px';
    bridgeDiv.style.top = midY + 'px';
    // Rotate
    bridgeDiv.style.transform = `rotate(${angle}deg) translateY(-50%)`;
    bridgeDiv.style.transformOrigin = 'center center';

    mapContainer.appendChild(bridgeDiv);
  }

  // Check if puzzle is complete (if all correctBridges are built)
  function checkPuzzleComplete() {
    // For each pair in correctBridges, see if playerBridges has it
    for (let pair of correctBridges) {
      // Sort pair
      const sortedPair = pair.slice().sort();
      const bridgeKey = sortedPair.join('|');
      if (!playerBridges.has(bridgeKey)) {
        return; // not done yet
      }
    }

    // If we get here, all required bridges exist
    setTimeout(() => {
      showGrokDialogue(`
        <strong>Bridges Complete!</strong><br><br>
        You've connected all islands to form a Superchain! 
        Superseed helps unite multiple blockchains 
        so transactions can flow freely. Nice work!
      `);
    }, 300);
  }
}
