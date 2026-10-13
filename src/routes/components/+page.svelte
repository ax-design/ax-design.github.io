<script lang="ts">
  import Header from '#lib/components/Header.svelte';
  import Section from '#lib/components/Section.svelte';
  import ComponentCard from '#lib/components/ComponentCard.svelte';

  const effects = [
    {
      name: 'Acrylic',
      href: '/demo/acrylic',
      icon: '/assets/img/icons/ax-acrylic.svg'
    },
    {
      name: 'Reveal Highlight',
      href: '/demo/reveal-highlight',
      icon: '/assets/img/icons/ax-reveal-highlight.svg'
    },
    {
      name: 'Pressure',
      href: '/demo/pressure',
      icon: '/assets/img/icons/ax-pressure.svg'
    },
    {
      name: 'Elevation',
      href: '/demo/elevation',
      icon: '/assets/img/icons/ax-elevation.svg'
    }
  ];

  const layouts = [
    {
      name: 'Navigation',
      href: '/demo/navigation',
      icon: '/assets/img/icons/ax-navigation.svg'
    }
  ];
</script>

<svelte:head>
  <title>Components | AXIOM DESIGN SYSTEM</title>
</svelte:head>

<div class="h_container">
  <Header />

  <Section id="effects" title="Texture & Effects">
    <ul class="component_list">
      {#each effects as item (item.name)}
        <ComponentCard
          name={item.name}
          href={item.href}
          icon={item.icon}
        />
      {/each}
    </ul>
  </Section>

  <Section id="layout" title="Layout">
    <ul class="component_list">
      {#each layouts as item (item.name)}
        <ComponentCard
          name={item.name}
          href={item.href}
          icon={item.icon}
        />
      {/each}
    </ul>
  </Section>

  <Section id="Form" title="Form">
    <ul class="form-list">
      <li class="wip-item">WIP (Work in progress)</li>
    </ul>
  </Section>
</div>

<style>
  .h_container {
    height: 100vh;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .component_list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .form-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .wip-item {
    font-size: 1.3em;
    color: #888;
    padding: 12px 16px;
  }
</style>
