/**
 * Constellation logic controller.
 * Manages responsive layout, HTML node positioning, SVG connection drawing,
 * and user interactions (clicks, hovers, card updates).
 */
import { nodes } from './nodes.js';
import { playClick, playHover, playReveal } from './audio.js';

// State management
let activeNodeId = null;
const discoveredNodes = new Set(['you']);

// DOM element references
let containerEl = null;
let svgEl = null;
let nodesContainerEl = null;
let infoPanelEl = null;
let finalMessageEl = null;

// Track button elements by node ID
const buttonsMap = {};

/**
 * Initializes the constellation, creates HTML buttons for all nodes,
 * and attaches interactions.
 */
export function initConstellation() {
  containerEl = document.getElementById('constellation-container');
  svgEl = document.getElementById('connections-svg');
  nodesContainerEl = document.getElementById('nodes-container');
  infoPanelEl = document.getElementById('node-info-panel');
  finalMessageEl = document.getElementById('final-message-container');

  if (!containerEl || !svgEl || !nodesContainerEl || !infoPanelEl || !finalMessageEl) {
    console.error('Constellation DOM elements missing!');
    return;
  }

  // Create buttons for all nodes (both discovered and undiscovered)
  Object.entries(nodes).forEach(([id, node]) => {
    const btn = document.createElement('button');
    btn.id = `node-${id}`;
    btn.className = 'constellation-node';
    
    // Set custom accent variables
    btn.style.setProperty('--node-accent-color', node.accentColor);
    btn.style.setProperty('--node-accent-glow', node.accentGlow);
    
    // Accessibility
    btn.setAttribute('aria-label', `Node ${node.name}`);
    btn.setAttribute('tabindex', '-1'); // Not tabbable by default if hidden

    // Inner HTML representing the orbital core and label
    btn.innerHTML = `
      <span class="node-orb ${id === 'you' ? 'you-node' : ''}"></span>
      <span class="node-label">${node.name}</span>
    `;

    // Hook up click handler
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop click passing to the background container
      if (discoveredNodes.has(id)) {
        playClick();
        handleNodeClick(id);
      }
    });

    // Hook up hover handler
    btn.addEventListener('mouseenter', () => {
      if (discoveredNodes.has(id)) {
        playHover();
      }
    });

    // Store reference and append to DOM
    buttonsMap[id] = btn;
    nodesContainerEl.appendChild(btn);
  });

  // Setup close button event
  const closeBtnEl = document.getElementById('close-info-btn');
  if (closeBtnEl) {
    closeBtnEl.addEventListener('click', (e) => {
      e.stopPropagation();
      closeInfoPanel();
    });
  }

  // Clicking on background space closes the active info panel
  containerEl.addEventListener('click', () => {
    closeInfoPanel();
  });

  // Setup screen resize handler
  setupResizeHandler();
}

/**
 * Shows the constellation view, starting with the center YOU node.
 */
export function showConstellation() {
  // Ensure we start with just the 'you' node
  discoveredNodes.clear();
  discoveredNodes.add('you');
  activeNodeId = null;

  // Make 'you' button focusable
  if (buttonsMap['you']) {
    buttonsMap['you'].setAttribute('tabindex', '0');
  }

  closeInfoPanel();
  
  if (finalMessageEl) {
    finalMessageEl.classList.add('hidden');
  }

  // Perform initial render
  renderConstellation();
}

/**
 * Computes responsive position coordinates, toggles visibility classes,
 * and draws the SVG connections.
 */
export function renderConstellation() {
  if (!containerEl) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const cx = width / 2;
  const cy = height / 2;

  // Adaptive radius: 28% of the minimum screen dimension (prevents collision with card)
  const radius = Math.min(width, height) * 0.28;

  // 1. Position all HTML nodes
  Object.entries(nodes).forEach(([id, node]) => {
    const btn = buttonsMap[id];
    if (!btn) return;

    const isDiscovered = discoveredNodes.has(id);
    const hasUrl = !!node.url;

    // Calculate screen coordinate
    const x = cx + node.x * radius;
    const y = cy + node.y * radius;

    // Update style coordinates
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    // Set accessibility states (visibility and interaction are managed by CSS)
    btn.setAttribute('tabindex', isDiscovered ? '0' : '-1');

    // Toggle discovery and portal classes
    if (isDiscovered) {
      btn.classList.add('discovered');
      
      if (hasUrl) {
        btn.classList.add('active-portal');
      }
      
      if (id === activeNodeId) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    } else {
      btn.classList.remove('discovered', 'active-portal', 'selected');
    }
    
    // Force a layout reflow on the button to ensure coordinate calculations are up to date
    void btn.offsetWidth;
  });

  // 2. Redraw SVG lines connecting the center node 'you' with discovered nodes
  // Clean existing lines while keeping the <defs> intact
  const oldLines = svgEl.querySelectorAll('line');
  oldLines.forEach(line => line.remove());

  const youBtn = buttonsMap['you'];
  if (!youBtn) return;

  // Measure the visual orb (.node-orb) rather than the whole button to avoid label height offsets
  const youOrb = youBtn.querySelector('.node-orb');
  const youRect = youOrb ? youOrb.getBoundingClientRect() : youBtn.getBoundingClientRect();
  const x1 = youRect.left + youRect.width / 2;
  const y1 = youRect.top + youRect.height / 2;

  Object.entries(nodes).forEach(([id, node]) => {
    // Only draw lines to discovered nodes, except 'you' itself
    if (id === 'you' || !discoveredNodes.has(id)) return;

    const targetBtn = buttonsMap[id];
    if (!targetBtn) return;

    const targetOrb = targetBtn.querySelector('.node-orb');
    const targetRect = targetOrb ? targetOrb.getBoundingClientRect() : targetBtn.getBoundingClientRect();
    const x2 = targetRect.left + targetRect.width / 2;
    const y2 = targetRect.top + targetRect.height / 2;

    // Create SVG line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    
    // Use the filter for visual neon glow
    line.setAttribute('filter', 'url(#glow-filter)');

    // Add CSS classes for animations
    line.classList.add('constellation-line');
    if (id === activeNodeId) {
      line.classList.add('active');
    }

    svgEl.appendChild(line);
  });
}

/* ==========================================================================
   Funciones de Control Internas
   ========================================================================== */

/**
 * Handle node click events
 * @param {string} id - Node identifier
 */
function handleNodeClick(id) {
  const node = nodes[id];
  if (!node) return;

  if (id === 'you') {
    // If only 'you' is currently visible, trigger the expansion reveal sequence
    if (discoveredNodes.size === 1) {
      revealSecondaryNodes();
    } else {
      // If already expanded, clicking central node presents YOU details
      showNodeDetails(id);
    }
  } else {
    // Display node info card and highlight it
    showNodeDetails(id);
  }
}

/**
 * Reveals the secondary nodes sequentially with a staggered delay
 */
function revealSecondaryNodes() {
  // Get all other nodes
  const targetIds = Object.keys(nodes).filter(id => id !== 'you');

  targetIds.forEach((id, index) => {
    setTimeout(() => {
      discoveredNodes.add(id);
      playReveal(index);
      
      // Re-render coordinate positioning and SVG connection lines
      renderConstellation();

      // Check if all items are fully uncovered
      checkCompletion();
    }, (index + 1) * 300); // 300ms staggered reveal delay
  });
}

/**
 * Updates the details card panel and fades it in
 * @param {string} id - Node identifier
 */
function showNodeDetails(id) {
  const node = nodes[id];
  if (!node) return;

  activeNodeId = id;

  // Query elements in info panel
  const titleEl = document.getElementById('info-title');
  const descEl = document.getElementById('info-desc');
  const linkEl = document.getElementById('info-link');

  titleEl.textContent = node.name;
  descEl.textContent = node.description;

  // Set card color accent variables dynamically
  infoPanelEl.style.setProperty('--node-accent-color', node.accentColor);
  infoPanelEl.style.setProperty('--node-accent-glow', node.accentGlow);

  // Configure action button link
  if (node.url) {
    linkEl.href = node.url;
    linkEl.style.display = 'inline-flex';
  } else {
    linkEl.style.display = 'none';
  }

  // Update layout and lines to highlight active connection
  renderConstellation();

  // Show panel
  infoPanelEl.classList.remove('hidden');
}

/**
 * Closes the active info card panel
 */
function closeInfoPanel() {
  activeNodeId = null;
  if (infoPanelEl) {
    infoPanelEl.classList.add('hidden');
  }
  renderConstellation();
}

/**
 * Checks if the entire constellation is revealed, displaying the final quote
 */
function checkCompletion() {
  if (discoveredNodes.size === Object.keys(nodes).length) {
    setTimeout(() => {
      if (finalMessageEl) {
        finalMessageEl.classList.remove('hidden');
      }
      
      // Play a small final arpeggio trigger after complete discovery
      setTimeout(() => {
        playReveal(7);
      }, 500);
    }, 600);
  }
}

/**
 * Sets up screen resize listener to re-align elements and connections
 */
function setupResizeHandler() {
  window.addEventListener('resize', () => {
    renderConstellation();
  });
}
