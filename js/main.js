/**
 * Main Orchestrator for Melpermo Constellation Landing Page.
 * Manages the transitions between the introductory typewriter phase
 * and the interactive constellation scene.
 */
import { startIntro } from './intro.js';
import { initConstellation, showConstellation } from './constellation.js';
import { toggleMute, playClick, playHover } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // Query Core DOM Elements
  const introContainer = document.getElementById('intro-container');
  const constellationContainer = document.getElementById('constellation-container');
  const introText = document.getElementById('intro-text');
  const startBtn = document.getElementById('start-btn');
  const muteBtn = document.getElementById('mute-btn');

  // 1. Initialize Audio Button Controls
  setupAudioToggle(muteBtn);

  // 2. Setup Phase Transitions
  startBtn.addEventListener('click', () => {
    playClick();
    transitionToConstellation(introContainer, constellationContainer);
  });

  startBtn.addEventListener('mouseenter', () => {
    playHover();
  });

  // 3. Initialize Constellation System
  initConstellation();

  // 4. Start Intro Typewriter Phase
  startIntro(introText, startBtn, () => {
    console.log('Introduction typewriter finished.');
  });

  // 5. Initialize Mouse Particle Suspended Dust Effect
  initMouseParticles();
});

/**
 * Hook up the mute/unmute button interaction
 */
function setupAudioToggle(muteBtn) {
  muteBtn.addEventListener('click', () => {
    const isMuted = toggleMute();
    
    // Update mute button appearance and accessibility
    if (isMuted) {
      muteBtn.classList.remove('unmuted');
      muteBtn.setAttribute('aria-label', 'Unmute audio');
      // Set volume icon to show muted state (strike-through line)
      muteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"></path>
        </svg>
      `;
    } else {
      muteBtn.classList.add('unmuted');
      muteBtn.setAttribute('aria-label', 'Mute audio');
      // Set volume icon to show unmuted state
      muteBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  });
}

/**
 * Handle transition from Intro screen to Interactive Constellation
 */
function transitionToConstellation(intro, constellation) {
  // Fade out intro
  intro.classList.remove('active');
  
  setTimeout(() => {
    intro.classList.add('hidden');
    
    // Reveal constellation container
    constellation.classList.remove('hidden');
    // Force browser reflow
    void constellation.offsetWidth; 
    
    constellation.classList.add('active');
    constellation.removeAttribute('aria-hidden');
    
    // Trigger constellation animations
    showConstellation();
  }, 800); // Must match style.css slow transition timing
}

/**
 * Initializes the mouse movement particle trail to emulate atmospheric dust
 */
function initMouseParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  let lastTime = 0;
  const throttleMs = 60; // Spawn particle every 60ms for fluid but lightweight trail

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime < throttleMs) return;
    lastTime = now;

    createParticle(container, e.clientX, e.clientY);
  });
}

/**
 * Creates a single floating dust particle at the coordinates
 */
function createParticle(container, x, y) {
  const particle = document.createElement('div');
  particle.className = 'mouse-particle';

  // Randomize sizing between 1px and 3px (finer, more delicate dust)
  const size = Math.random() * 2 + 1;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  // Position at cursor
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  // Randomize drift offset (simulating suspended dust under gentle multi-directional air currents)
  const dx = (Math.random() - 0.5) * 60; // sway left/right up to 30px
  const dy = (Math.random() - 0.5) * 60; // sway up/down up to 30px
  
  particle.style.setProperty('--dx', `${dx}px`);
  particle.style.setProperty('--dy', `${dy}px`);

  container.appendChild(particle);

  // Clean up element after animation completes to avoid memory leaks (matches 3.2s CSS transition)
  setTimeout(() => {
    particle.remove();
  }, 3200);
}
