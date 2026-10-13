const isBrowser = typeof window !== 'undefined';

let acrylicRegistered = false;
let elevationRegistered = false;
let navigationRegistered = false;
let pressureRegistered = false;
let revealRegistered = false;

export async function registerAcrylic() {
  if (!isBrowser || acrylicRegistered) return;
  try {
    const mod = await import('@ax-design/acrylic');
    if (typeof mod.register === 'function') {
      mod.register();
      acrylicRegistered = true;
    }
  } catch (err) {
    console.error('Failed to register AxAcrylic:', err);
  }
}

export async function registerElevation() {
  if (!isBrowser || elevationRegistered) return;
  try {
    const mod = await import('@ax-design/elevation');
    if (typeof mod.register === 'function') {
      mod.register();
      elevationRegistered = true;
    }
  } catch (err) {
    console.error('Failed to register AxElevation:', err);
  }
}

export async function registerNavigation() {
  if (!isBrowser || navigationRegistered) return;
  try {
    const mod = await import('@ax-design/navigation');
    if (typeof mod.register === 'function') {
      mod.register();
      navigationRegistered = true;
    }
  } catch (err) {
    console.error('Failed to register AxNavigation:', err);
  }
}

export async function registerPressure() {
  if (!isBrowser || pressureRegistered) return;
  try {
    const mod = await import('@ax-design/pressure');
    if (typeof mod.register === 'function') {
      mod.register();
      pressureRegistered = true;
    }
  } catch (err) {
    console.error('Failed to register AxPressure:', err);
  }
}

export async function registerRevealHighlight(options?: Record<string, unknown>) {
  if (!isBrowser) return;
  try {
    const mod = await import('@ax-design/reveal-highlight');
    if (typeof mod.register === 'function') {
      mod.register(options);
      revealRegistered = true;
    }
  } catch (err) {
    console.error('Failed to register AxRevealHighlight:', err);
  }
}
