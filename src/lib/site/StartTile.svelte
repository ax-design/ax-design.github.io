<script lang="ts">
  import type { Snippet } from 'svelte';
  import { goto } from '$app/navigation';
  import { pressed } from './press';

  // A tile of the start screen: an <ax-tile> with a link over all of it. With `image`, the
  // picture fills the tile, cut to its shape; otherwise `icon` (a monochrome SVG) is drawn
  // white in the middle.
  interface Props {
    href: string;
    title: string;
    columns?: number;
    rows?: number;
    color?: string;
    icon?: string;
    image?: string;
    // Shown at the bottom right, e.g. "Legacy".
    badge?: string;
    external?: boolean;
    children?: Snippet;
  }

  let { href, title, columns = 2, rows = 2, color = '#2b5797', icon, image, badge, external = false, children }: Props = $props();

  // A plain click on a link to this site goes on once the ripple has played. The link stays a
  // link: a click with a modifier or the middle button, and a link that opens a new tab, keep
  // what the browser does with them (see ./press).
  const onclick = $derived(pressed(() => goto(href), { link: true, external }));
</script>

{#snippet link(content: Snippet)}
  <a class="link" {href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} {onclick}>
    {@render content()}
    <span class="title">{title}</span>
    {#if badge}<span class="badge">{badge}</span>{/if}
  </a>
{/snippet}

{#snippet nothing()}{/snippet}

{#if image}
  <!-- The picture covers the layers of the tile, so the light is a surface of its own on top
       of it, with the link in it. It takes the press too; the tile around it tilts. -->
  <ax-tile data-id={href} {columns} {rows} layers="fill" style:--ax-fill-color={color}>
    <img class="image" src={image} alt="" loading="lazy" />
    <span class="shade"></span>
    <ax-surface class="light" layers="reveal">
      {@render link(nothing)}
    </ax-surface>
  </ax-tile>
{:else}
  <ax-tile data-id={href} {columns} {rows} layers="fill reveal" style:--ax-fill-color={color}>
    {#snippet body()}
      {#if children}
        {@render children()}
      {:else if icon}
        <span class="icon" style:--icon="url({icon})"></span>
      {/if}
    {/snippet}
    {@render link(body)}
  </ax-tile>
{/if}

<style>
  ax-tile {
    color: #fff;
    --reveal-color: rgb(255, 255, 255);
    --reveal-opacity: 0.3;
  }
  .light {
    position: absolute;
    inset: 0;
    display: block;
    --ax-border-width: 2px;
    --ax-tilt-mode: off;
  }
  .link {
    position: absolute;
    inset: 0;
    display: block;
    color: inherit;
    text-decoration: none;
    -webkit-user-drag: none;
  }
  .link:focus-visible {
    outline: 2px solid #fff;
    outline-offset: -4px;
  }
  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 56px;
    height: 56px;
    transform: translate(-50%, -50%);
    background: currentColor;
    -webkit-mask: var(--icon) center / contain no-repeat;
    mask: var(--icon) center / contain no-repeat;
  }
  ax-tile[rows='1'] .icon {
    width: 32px;
    height: 32px;
  }
  ax-tile[rows='4'] .icon {
    width: 96px;
    height: 96px;
  }
  .image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    -webkit-user-drag: none;
  }
  .shade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 48px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.55));
  }
  .title {
    position: absolute;
    left: 10px;
    bottom: 8px;
    font-size: 14px;
    line-height: 1.2;
  }
  ax-tile[rows='1'] .title {
    display: none;
  }
  .badge {
    position: absolute;
    right: 10px;
    bottom: 8px;
    font-size: 11px;
    opacity: 0.75;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
</style>
