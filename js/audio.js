/**
 * Web Audio API Synthesizer for Melpermo Constellation.
 * This synthesizes game-like sound effects dynamically, ensuring zero assets to load,
 * instant playback, and precise control over audio envelopes.
 */

let audioCtx = null;
let isMuted = false;

// Tone frequencies for node discovery progression
const REVEAL_NOTES = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

/**
 * Initializes the Audio Context (must be triggered by a user interaction)
 */
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

/**
 * Play a soft, organic click sound
 */
export function playClick() {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  // Soft triangular wave for an organic feel
  osc.type = 'triangle';
  
  // Quick pitch decay (800Hz down to 80Hz)
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);

  // Sound envelope (fast attack, fast decay)
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.08);
}

/**
 * Play a subtle tick on node hover
 */
export function playHover() {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.03);
}

/**
 * Play a very quick, soft, high-pitched click for typewriter typing
 */
export function playTypeTick() {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000Hz tone

  gain.gain.setValueAtTime(0.01, audioCtx.currentTime); // Very quiet
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.01); // 0.01s decay

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.01);
}

/**
 * Play a resonant chime when a node is revealed
 * @param {number} step - The index of the revealed node (0 to 6) to determine pitch
 */
export function playReveal(step) {
  if (isMuted) return;
  initAudio();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const frequency = REVEAL_NOTES[step % REVEAL_NOTES.length];

  // Primary tone (Chime)
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(frequency, now);
  
  // Volume envelope for primary tone
  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  // Harmonious overtone (for a more magical feel)
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(frequency * 2, now); // Octave above
  
  // Volume envelope for overtone (quieter, decays faster)
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.05, now + 0.03);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  // Start both oscillators
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.8);
  osc2.stop(now + 0.8);
}

/**
 * Toggles the mute state and returns the new state
 * @returns {boolean} - The new muted state
 */
export function toggleMute() {
  isMuted = !isMuted;
  
  if (!isMuted) {
    initAudio();
    // Play a welcoming sound upon unmuting
    setTimeout(() => {
      if (!isMuted) playReveal(4);
    }, 100);
  }
  
  return isMuted;
}

/**
 * Returns current mute state
 * @returns {boolean}
 */
export function getMuteState() {
  return isMuted;
}
