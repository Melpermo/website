/**
 * Node configurations for the Melpermo Constellation.
 * Positions are normalized coordinates (-1 to 1) relative to the screen center (0,0).
 * This makes the system extremely responsive and easy to scale dynamically.
 */
export const nodes = {
  you: {
    id: 'you',
    name: 'YOU',
    description: 'This is you. Take a step, interact, and discover the path.',
    url: '',
    // Center of the screen
    x: 0,
    y: 0,
    accentColor: 'var(--color-you)',
    accentGlow: 'rgba(255, 255, 255, 0.4)',
    connectedTo: ['github', 'space', 'bikku', 'bitacora', 'pinterest', 'itch'],
    isStart: true
  },
  github: {
    id: 'github',
    name: 'GitHub',
    description: 'See how it is made. Browse repository codes, open-source libraries, and development pipelines.',
    url: 'https://github.com/melpermo',
    // Top Center
    x: 0,
    y: -0.7,
    accentColor: 'var(--color-github)',
    accentGlow: 'rgba(88, 166, 255, 0.3)',
    connectedTo: ['you']
  },
  space: {
    id: 'space',
    name: 'Melpermo Space',
    description: 'Experiments and ideas. Interactive web designs, creative scripts, and artificial intelligence tests.',
    url: 'https://melpermo.space/', // Placeholder/example URL
    // Top Right
    x: 0.65,
    y: -0.25,
    accentColor: 'var(--color-space)',
    accentGlow: 'rgba(163, 113, 247, 0.3)',
    connectedTo: ['you']
  },
  bikku: {
    id: 'bikku',
    name: 'BikkuGames',
    description: 'Play what I am building. Fast, fun, and experimental browser games designed for instant play.',
    url: 'https://bikkugames.com', // Placeholder/example URL
    // Top Left
    x: -0.65,
    y: -0.25,
    accentColor: 'var(--color-bikku)',
    accentGlow: 'rgba(255, 123, 114, 0.3)',
    connectedTo: ['you']
  },
  bitacora: {
    id: 'bitacora',
    name: 'Bitácora',
    description: 'Thoughts behind the work. Articles on development design, creative programming, and post-mortems.',
    url: 'https://melpermobitacora.substack.com/', // Placeholder/example URL
    // Bottom Left
    x: -0.5,
    y: 0.45,
    accentColor: 'var(--color-bitacora)',
    accentGlow: 'rgba(86, 211, 100, 0.3)',
    connectedTo: ['you']
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    description: 'Visual inspiration. A curated collection of art references, interface aesthetics, and styling ideas.',
    url: 'https://pin.it/7HncN74Qv', // Placeholder/example URL
    // Bottom Right
    x: 0.5,
    y: 0.45,
    accentColor: 'var(--color-pinterest)',
    accentGlow: 'rgba(248, 81, 73, 0.3)',
    connectedTo: ['you']
  },
  itch: {
    id: 'itch',
    name: 'Itch.io',
    description: 'Download and play. Indie game projects, downloadable editions, and prototypes for various platforms.',
    url: 'https://melpermo.itch.io',
    // Bottom Center
    x: 0,
    y: 0.7,
    accentColor: 'var(--color-itch)',
    accentGlow: 'rgba(250, 112, 154, 0.3)',
    connectedTo: ['you']
  }
};
