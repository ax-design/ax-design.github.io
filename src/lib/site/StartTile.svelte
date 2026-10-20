<script lang="ts">
  import type { Snippet } from 'svelte';

  // A tile of the start screen: an <ax-tile> whose action is a link over all of it, named by its
  // title. With `image`, the picture fills the tile, cut to its shape; otherwise `icon` (a
  // monochrome SVG) is drawn white in the middle. The tile holds the press: the link is followed
  // once its ripple has played, and the router of the site takes the click as it takes any other.
  // A link into the site launches with the flip of Windows 8, onto a splash of the tile's color
  // with its picture; the root layout holds the splash until the page has arrived. A link out of
  // the site opens a new tab, and has nothing to launch into.
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
</script>

<ax-tile
  data-id={href}
  {columns}
  {rows}
  layers={image ? 'fill' : 'fill reveal'}
  label={rows === 1 ? 'hidden' : undefined}
  style:--ax-fill-color={color}
  style:--ax-tile-splash-color={external ? undefined : color}
  style:--ax-tile-launch={external ? undefined : 'flip'}
>
  {#if image}
    <img class="image" src={image} alt="" loading="lazy" />
    <span class="shade"></span>
    <!-- The picture covers the layers of the tile, so the light is a surface of its own on top of it. -->
    <ax-surface class="light" layers="reveal"></ax-surface>
  {:else if children}
    {@render children()}
  {:else if icon}
    <span class="icon" style:--icon="url({icon})"></span>
  {/if}
  {#if badge}<span class="badge">{badge}</span>{/if}
  {#if !external}
    <template slot="splash">
      {#if image}
        <img class="splash-image" src={image} alt="" />
      {:else if icon}
        <span class="splash-icon" style:--icon="url({icon})"></span>
      {/if}
    </template>
  {/if}
  <a
    slot="action"
    class="title"
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >{title}</a>
</ax-tile>

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
  .title {
    padding: 0 10px 8px;
    color: inherit;
    font-size: 14px;
    line-height: 1.2;
    -webkit-user-drag: none;
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
  /* The splash is drawn in the light DOM of the page, so its own classes are global. */
  :global(.splash-icon) {
    display: block;
    width: 160px;
    height: 160px;
    background: #fff;
    -webkit-mask: var(--icon) center / contain no-repeat;
    mask: var(--icon) center / contain no-repeat;
  }
  :global(.splash-image) {
    display: block;
    width: 200px;
    height: 200px;
    object-fit: cover;
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
