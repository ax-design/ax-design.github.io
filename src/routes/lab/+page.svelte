<script lang="ts">
  // Temporary: in which page context a pressed acrylic surface turns clear in Firefox. Not
  // linked, not shipped. One variant per page (?v=1 to ?v=9), so the cases cannot affect each
  // other.
  import { onMount } from 'svelte';
  import AppShell from '#lib/site/AppShell.svelte';
  import { registerAll } from '#lib/site/register';
  import { Flyout } from '#lib/ui/index.ts';

  let v = $state(0);
  let flyout = $state(false);
  let shown = $state(false);
  let dialog: HTMLDialogElement | undefined = $state();
  onMount(() => {
    v = Number(new URLSearchParams(location.search).get('v')) || 1;
    registerAll();
    if (v >= 10 && v <= 13) requestAnimationFrame(() => plain(v));
    if (v >= 14) requestAnimationFrame(() => copy(v));
  });

  // ?v=14 to 17: a plain copy of the DOM of a pressed acrylic surface (round 14), in a shadow
  // root, with the clip-path of its glass changing every frame like the real one.
  //   14: all of it        15: only the filter element's clip changes
  //   16: no tint, noise   17: no reveal canvas
  function copy(v: number) {
    const host = document.querySelector<HTMLElement>('.cbox')!;
    const root = host.attachShadow({ mode: 'open' });
    const layer = (cls: string, extra: string) =>
      `<div class="${cls}" style="position: absolute; left: var(--b-left, 0); top: var(--b-top, 0); width: var(--b-width, 100%); height: var(--b-height, 100%); pointer-events: none; ${extra}"></div>`;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const img = x.createImageData(64, 64);
    for (let i = 0; i < img.data.length; i += 4) img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.random() * 255, (img.data[i + 3] = 255);
    x.putImageData(img, 0, 0);
    root.innerHTML = `<div class="tilt" style="width: 100%; height: 100%">
  <div class="layers" style="display: block; position: absolute; left: 0; top: 0; width: 200px; height: 110px; pointer-events: none;">
    <div style="display: contents"><div class="aroot" style="display: contents; --b-left: -8px; --b-top: -8px; --b-width: 216px; --b-height: 126px;">
      ${layer('f', 'backdrop-filter: blur(28px) saturate(200%) brightness(95%);')}
      ${v === 16 ? '' : layer('t', 'background-color: #fff; opacity: 0.16;')}
      ${v === 16 ? '' : layer('n', `opacity: 0.03; background-image: url(${c.toDataURL()});`)}
    </div></div>
    ${v === 17 ? '' : '<div class="r" style="display: block; position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none;"><canvas width="200" height="110" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;"></canvas></div>'}
  </div>
  <div class="content" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px;">${v}</div>
</div>`;
    const glasses = Array.from(root.querySelectorAll<HTMLElement>('.f, .t, .n'));
    const reveal = root.querySelector<HTMLElement>('.r');
    const content = root.querySelector<HTMLElement>('.content')!;
    const ctx = reveal ? reveal.querySelector('canvas')!.getContext('2d') : null;
    let k = 0;
    let target = 0;
    const frame = (now: number) => {
      // The cut, in the box of the glass (8 px of margin), its bottom right corner moving.
      const r = 16 + 14 * (0.5 + 0.5 * Math.sin(now / 200));
      const d = `path("M24 8 H192 A16 16 0 0 1 208 24 V${118 - r} A${r} ${r} 0 0 1 ${208 - r} 118 H24 A16 16 0 0 1 8 102 V24 A16 16 0 0 1 24 8 Z")`;
      for (const g of glasses) if (v !== 15 || g.classList.contains('f')) g.style.clipPath = d;
      if (v === 15) for (const g of glasses) if (!g.classList.contains('f') && !g.style.clipPath) g.style.clipPath = d;
      k += (target - k) * 0.25;
      if (Math.abs(target - k) < 0.01) k = target;
      const t = k === 0 ? '' : `perspective(600px) rotateX(${1.1 * k}deg) rotateY(${0.7 * k}deg) translateZ(${-0.3 * k}px)`;
      content.style.transform = t;
      if (reveal) reveal.style.transform = t;
      if (ctx && target === 1) {
        ctx.clearRect(0, 0, 200, 110);
        const g = ctx.createRadialGradient(170, 15, 0, 170, 15, 90 + 10 * Math.sin(now / 60));
        g.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        g.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 200, 110);
      }
      requestAnimationFrame(frame);
    };
    host.addEventListener('pointerdown', () => (target = 1));
    window.addEventListener('pointerup', () => (target = 0));
    requestAnimationFrame(frame);
  }

  // ?v=10 to 13: plain HTML. The glass's clip-path changes every frame (its bottom right
  // corner grows and shrinks); pressing tilts the sibling.
  function plain(v: number) {
    const box = document.querySelector<HTMLElement>('.pbox')!;
    const glass = box.querySelector<HTMLElement>('.pglass')!;
    const moving = box.querySelector<HTMLElement>('.pmoving')!;
    let k = 0;
    let target = 0;
    const tiltAt = (k: number) => {
      if (k === 0 || v === 13) return '';
      if (v === 12) return `matrix(${1 - 0.01 * k}, ${-0.004 * k}, ${0.006 * k}, ${1 - 0.01 * k}, ${0.4 * k}, ${0.6 * k})`;
      return `perspective(600px) rotateX(${1.1 * k}deg) rotateY(${0.7 * k}deg) translateZ(${-0.3 * k}px)`;
    };
    const frame = (now: number) => {
      const r = 16 + 14 * (0.5 + 0.5 * Math.sin(now / 200));
      glass.style.clipPath = `path("M16 0 H184 A16 16 0 0 1 200 16 V${110 - r} A${r} ${r} 0 0 1 ${200 - r} 110 H16 A16 16 0 0 1 0 94 V16 A16 16 0 0 1 16 0 Z")`;
      k += (target - k) * 0.25;
      if (Math.abs(target - k) < 0.01) k = target;
      moving.style.transform = tiltAt(k);
      requestAnimationFrame(frame);
    };
    box.addEventListener('pointerdown', () => (target = 1));
    window.addEventListener('pointerup', () => (target = 0));
    requestAnimationFrame(frame);
  }

  const glass = `<ax-surface class="glass" layers="acrylic reveal"><span>press</span></ax-surface>`;
</script>

<!-- The start screen lab. Fixed, so the variants above keep their layout. -->
<a class="start-link" href="/lab/start/">Start screen</a>

{#if v === 1}
  <!-- As round 15, case 4 (fine there). -->
  <div class="bare">{@html glass}</div>
{:else if v === 2}
  <AppShell title="Lab 2" accent="#603cba">
    <div class="spot">{@html glass}</div>
  </AppShell>
{:else if v === 3}
  <AppShell title="Lab 3" accent="#00a300" wallpaper="/demo/images/acrylic-background.jpg">
    <div class="spot">{@html glass}</div>
  </AppShell>
{:else if v === 4}
  <AppShell title="Lab 4" accent="#00a300" wallpaper="/demo/images/acrylic-background.jpg">
    <ax-tile-group class="group" drag="cross-slide"><div {...{ columns: 4, rows: 2 }}>{@html glass}</div></ax-tile-group>
  </AppShell>
{:else if v === 5}
  <!-- A native modal dialog, opened and closed. -->
  <div class="bare">
    {@html glass}
    <p><button onclick={() => dialog!.showModal()}>Open a dialog</button></p>
    <dialog bind:this={dialog}><p>A dialog.</p><button onclick={() => dialog!.close()}>Close</button></dialog>
  </div>
{:else if v === 6}
  <!-- The flyout of the Ideas page, opened and closed. -->
  <div class="bare">
    {@html glass}
    <p><button onclick={() => (flyout = true)}>Open the flyout</button></p>
    <Flyout bind:open={flyout} title="Flyout"><p>The flyout of the Ideas page.</p></Flyout>
  </div>
{:else if v === 7}
  <!-- Content shown and hidden elsewhere on the page, like an expander. -->
  <div class="bare">
    {@html glass}
    <p><button onclick={() => (shown = !shown)}>Show or hide a block</button></p>
    {#if shown}<p class="block">A block of text that comes and goes.</p>{/if}
  </div>
{:else if v === 8}
  <!-- A scooped corner (clip-path in Firefox), no animation. -->
  <div class="bare"><ax-surface class="glass scoop" layers="acrylic reveal"><span>press</span></ax-surface></div>
{:else if v === 9}
  <!-- A scooped corner that grows on hover, like the weather tile. -->
  <div class="bare"><ax-surface class="glass scoop grows" layers="acrylic reveal"><span>press</span></ax-surface></div>
{:else if v >= 14}
  <div class="bare">
    <p class="note">The glass's corner keeps changing. Press and hold the glass: does it turn clear?</p>
    <div class="cbox"></div>
  </div>
{:else if v >= 10}
  <div class="bare">
    <p class="note">The glass's corner keeps changing. Press and hold the glass: does it turn clear?</p>
    <div class="pbox">
      <div class="pglass"></div>
      {#if v === 11}
        <div class="pwrap"><div class="pmoving">{v}</div></div>
      {:else}
        <div class="pmoving">{v}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .note {
    color: #fff;
  }
  .cbox {
    position: relative;
    isolation: isolate;
    width: 200px;
    height: 110px;
    user-select: none;
  }
  .pbox {
    position: relative;
    isolation: isolate;
    width: 200px;
    height: 110px;
    user-select: none;
  }
  .pglass {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(28px);
  }
  .pwrap {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 100%;
  }
  .pmoving {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    box-sizing: border-box;
  }
  .bare :global(.scoop) {
    --ax-radius: 20px;
    --ax-corner-bottom-right-shape: scoop;
    --ax-bottom-right-radius: 26px;
  }
  .bare :global(.grows) {
    transition: --ax-bottom-right-radius 0.4s;
  }
  .bare :global(.grows:hover) {
    --ax-bottom-right-radius: 44px;
  }
  .block {
    color: #fff;
    font-size: 18px;
  }
  .bare {
    min-height: 100vh;
    padding: 80px;
    background: url('/demo/images/acrylic-background.jpg') center / cover;
  }
  .spot {
    flex: none;
    width: 300px;
    height: 200px;
    padding: 40px;
    background: url('/demo/images/acrylic-background.jpg') center / cover;
  }
  .group {
    flex: none;
    height: var(--flow-height);
    margin-right: 40px;
    --tile-cell-width: 56px;
    --tile-cell-height: 56px;
    --tile-gap: 12px;
    --tile-rows: 8;
    --tile-drag-opacity: 1;
  }
  :global(.glass) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 260px;
    height: 124px;
    color: #fff;
    font-size: 24px;
    --ax-radius: 16px;
    --acrylic-tint-color: #ffffff;
    --acrylic-tint-opacity: 0.16;
    --acrylic-blur: 28px;
    --reveal-color: rgb(255, 255, 255);
    --reveal-opacity: 0.3;
    --ax-border-width: 1px;
    --ax-tilt-mode: absolute;
    --ax-tilt-depth: 3px;
    --ax-tilt-perspective: 600px;
  }
  .start-link {
    position: fixed;
    right: 16px;
    bottom: 16px;
    z-index: 1000;
    color: #fff;
    font-size: 14px;
  }
</style>
