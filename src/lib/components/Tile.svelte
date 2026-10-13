<script lang="ts">
  interface Props {
    title: string;
    icon: string;
    alt?: string;
    href?: string;
  }

  let { title, icon, alt = `Icon of ${title}`, href }: Props = $props();
</script>

<ax-reveal>
  <ax-pressure>
    {#if href}
      <a {href} class="tile tile-link">
        <img class="tile-icon" src={icon} {alt} />
        <p class="tile-title">{title}</p>
      </a>
    {:else}
      <div class="tile">
        <img class="tile-icon" src={icon} {alt} />
        <p class="tile-title">{title}</p>
      </div>
    {/if}
  </ax-pressure>
</ax-reveal>

<style>
  ax-reveal {
    --reveal-color: white;
    --reveal-border-width: 2px;
    margin: 4px;
    width: 150px;
    height: 150px;
    display: inline-block;
  }

  ax-pressure {
    display: block;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .tile {
    width: 150px;
    height: 150px;
    font-family: 'IBM Plex Sans', sans-serif;
    background: #005caf;
    color: white;
    position: relative;
    user-select: none;
    display: block;
    box-sizing: border-box;
  }

  .tile-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .tile-icon {
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    margin: -25px 0 0 -25px;
    position: absolute;
  }

  .tile-title {
    left: 10px;
    bottom: 8px;
    margin: 0;
    padding: 0;
    font-size: 13px;
    position: absolute;
  }
</style>
