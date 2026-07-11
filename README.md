# 🌌 Melpermo Interactive Landing Page

> **Ideas become projects. Projects become experiences. Experiences become knowledge.**[1]

This is the first interactive experience visitors encounter when discovering the Melpermo ecosystem. Instead of presenting traditional buttons and portfolio links immediately, visitors are invited to explore a tiny, minimalist constellation that rewards curiosity[cite: 1].

🌐 **Live Experience:** [https://melpermo.github.io/website/](https://melpermo.github.io/website/).

---

## 🧭 Core Concept & Flow

The landing page functions closer to an indie game's title screen than to a corporate homepage. 

1. **The Introduction:** A clean, dark-space introduction using an elegant typewriter effect that sets the philosophy of the space.
2. **The Constellation:** The screen transitions to a single central node: `YOU (◎)`[1]. Interacting with it expands a dynamic constellation representing different portals of the ecosystem.
3. **The Portals:** Each discovered node becomes an interactive gateway to its destination with custom tooltips[cite: 1]:
   - **Melpermo Space:** Experiments and ideas.
   - **BikkuGames:** Playable browser games.
   - **GitHub:** Source code and pipelines.
   - **Bitácora:** Thoughts behind the work.
   - **Pinterest:** Visual inspiration.
   - **Itch.io:** Downloadable editions and prototypes.

---

## 🛠️ Technical Stack & Architecture

This project is built from scratch adhering to a strict minimalist, vanilla development philosophy[cite: 1]. **No frameworks, no build tools, and zero external dependencies.

* **HTML5 & CSS3 Variables:** Clean document structure optimized for accessibility and SEO, combined with a modular custom theme system.
* **Native ES6 Modules:** JavaScript separation (`main.js`, `constellation.js`, `intro.js`, etc.) using browser-native module loading (`type="module"`).
* **Hybrid DOM + SVG Rendering:** Individual nodes are rendered using standard HTML elements to guarantee crisp typography, responsive scaling, and accessibility. The elastic connecting lines are drawn dynamically via an SVG background overlay using `.getBoundingClientRect()` coordinates[cite: 1].
* **Procedural Web Audio API:** All game-feel sound effects (typewriter clicks, hover ticks, and reveal chords) are synthesized mathematically in real-time. This ensures instant asset loading and a completely lightweight 0-byte audio system[cite: 1].

---

## 🎨 Visual Style: *Ink Noir*

The art direction follows an **Ink Noir** minimalist philosophy:
* Deep onyx absolute blacks (`#030305`) paired with soft, desaturated off-white tones.
* Cinematic vignette lighting using raw CSS radial gradients.
* Subtle glowing shadows mimicking fluid ink diffusion rather than artificial neon palettes.
---

