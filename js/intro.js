/**
 * Intro phase controller for Melpermo Constellation.
 * Animates the introduction text with a sleek typewriter effect
 * and handles transitions.
 */

import { playTypeTick } from './audio.js';

const introLines = [
  "Hi, I'm <strong>Melpermo</strong>.",
  "I build browser games, creative tools and AI-assisted experiments.",
  "Rather than showing you a list of links...",
  "<strong>let's explore together.</strong>"
];

let typingTimer = null;
let currentLineIdx = 0;
let currentCharIdx = 0;
let isTyping = false;
let skipRequested = false;

/**
 * Starts the typewriter animation sequence
 * @param {HTMLElement} textContainer - Element to type text into
 * @param {HTMLElement} startBtn - Button to reveal when finished
 * @param {Function} onComplete - Callback triggered when intro finishes
 */
export function startIntro(textContainer, startBtn, onComplete) {
  if (isTyping) return;
  
  textContainer.innerHTML = '';
  startBtn.classList.add('hidden');
  currentLineIdx = 0;
  currentCharIdx = 0;
  isTyping = true;
  skipRequested = false;

  // Add click listener to the text wrapper to speed up typing on click (excellent UX)
  const wrapper = textContainer.closest('.intro-content');
  const speedUpHandler = () => {
    if (isTyping) {
      skipRequested = true;
    }
  };
  wrapper.addEventListener('click', speedUpHandler);

  typeNextLine(textContainer, () => {
    isTyping = false;
    wrapper.removeEventListener('click', speedUpHandler);
    
    // Smoothly reveal button
    setTimeout(() => {
      startBtn.classList.remove('hidden');
      onComplete();
    }, 400);
  });
}

/**
 * Types a single line/paragraph of text
 */
function typeNextLine(container, onFinished) {
  if (currentLineIdx >= introLines.length) {
    onFinished();
    return;
  }

  // Create paragraph element for the current line
  const p = document.createElement('p');
  p.className = 'typewriter-line';
  container.appendChild(p);

  // Set the caret/cursor class on the active paragraph
  p.classList.add('typewriter-cursor');

  const fullText = introLines[currentLineIdx];
  currentCharIdx = 0;

  // Since text contains HTML tags (<strong>, etc.), we need to parse them properly.
  // A simple way is to build an array of visible chunks or handle tags cleanly.
  // Alternatively, we can type by setting innerHTML to a slice of the string, 
  // but slice of HTML can break tags mid-way (e.g. "<st").
  // Let's use a safe parser that parses the text into characters/tags.
  const characters = parseHtmlText(fullText);

  function typeChar() {
    // If user clicked, instantly dump the rest of the text for this scene
    if (skipRequested) {
      dumpAllText(container);
      onFinished();
      return;
    }

    if (currentCharIdx < characters.length) {
      const nextChar = characters[currentCharIdx];
      p.innerHTML += nextChar;
      currentCharIdx++;
      
      // Play tick sound if it's a renderable character (not an HTML tag like <strong> or <br>)
      if (nextChar && !nextChar.startsWith('<')) {
        playTypeTick();
      }
      
      // Variable speed: standard chars take 35ms, punctuation takes 250ms for natural speech rhythm
      const lastChar = characters[currentCharIdx - 1];
      const delay = (['.', ',', ':', ';'].includes(lastChar) && !lastChar.includes('<')) ? 250 : 35;
      
      typingTimer = setTimeout(typeChar, delay);
    } else {
      // Finished typing current line
      p.classList.remove('typewriter-cursor');
      currentLineIdx++;
      // Wait slightly before starting next line
      typingTimer = setTimeout(() => {
        typeNextLine(container, onFinished);
      }, 500);
    }
  }

  typeChar();
}

/**
 * Helper to split HTML string into an array of either plain text characters or full HTML tags.
 * Prevents typing out "< s t r o n g >" character by character.
 */
function parseHtmlText(htmlStr) {
  const result = [];
  let idx = 0;
  
  while (idx < htmlStr.length) {
    if (htmlStr[idx] === '<') {
      const closingIdx = htmlStr.indexOf('>', idx);
      if (closingIdx !== -1) {
        // Capture the entire HTML tag (e.g. "<strong>" or "</strong>")
        result.push(htmlStr.substring(idx, closingIdx + 1));
        idx = closingIdx + 1;
        continue;
      }
    }
    result.push(htmlStr[idx]);
    idx++;
  }
  return result;
}

/**
 * Instantly dumps all intro text into the container (used when user wants to skip)
 */
function dumpAllText(container) {
  clearTimeout(typingTimer);
  container.innerHTML = '';
  introLines.forEach(line => {
    const p = document.createElement('p');
    p.className = 'typewriter-line';
    p.innerHTML = line;
    container.appendChild(p);
  });
}
