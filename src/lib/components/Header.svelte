<script lang="ts">
  interface Props {
    title?: string;
    slogan?: string;
    homeHref?: string;
    logoSrc?: string;
  }

  let {
    title = 'AXIOM DESIGN SYSTEM',
    slogan = 'FIGHT FOR THE DESIGN ESSENTIALS WE LOVE',
    homeHref = '/',
    logoSrc = '/assets/img/logo.svg'
  }: Props = $props();
</script>

<header class="h_section">
  <h1>
    <a class="logo" href={homeHref}>
      <div><img src={logoSrc} class="logo_img" alt="Logo of Axiom Design System" /></div>
      <p class="logo_text">{title}</p>
    </a>
  </h1>
  {#if slogan}
    <p class="slogan">{slogan}</p>
  {/if}
</header>
