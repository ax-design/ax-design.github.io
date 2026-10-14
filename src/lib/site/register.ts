// Registers every package of the design system once, in the browser. Pages call registerAll()
// in onMount; the prerendered HTML upgrades when it runs.
let done: Promise<void> | null = null;

export function registerAll(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!done) done = load().finally(lift);
  return done;
}

// Lift the welcome curtain of app.html.
function lift() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;
  curtain.classList.add('lifted');
  setTimeout(() => curtain.remove(), 400);
}

async function load(): Promise<void> {
  const [reveal, acrylic, elevation, pressure, surface, tiles, scroll, navigation] = await Promise.all([
    import('@ax-design/reveal-highlight'),
    import('@ax-design/acrylic'),
    import('@ax-design/elevation'),
    import('@ax-design/pressure'),
    import('@ax-design/surface'),
    import('@ax-design/tile-group'),
    import('@ax-design/scroll'),
    import('@ax-design/navigation')
  ]);
  // Layers first, then the elements that use them.
  reveal.registerRevealLayer();
  acrylic.registerAcrylicLayer();
  elevation.registerElevationLayer();
  reveal.register({ borderDetectionMode: 'experimentalAutoFit' });
  acrylic.register();
  elevation.register();
  pressure.register();
  surface.register();
  tiles.register();
  scroll.register();
  (navigation as { register?: () => void }).register?.();
}
