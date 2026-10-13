<script lang="ts">
  import Header from '#lib/components/Header.svelte';
  import Section from '#lib/components/Section.svelte';
  import TeamMember from '#lib/components/TeamMember.svelte';

  const team = [
    {
      name: 'Jack Works',
      role: 'Developer',
      avatar: 'https://avatars3.githubusercontent.com/u/5390719?s=460&v=4',
      url: 'https://github.com/Jack-Works'
    },
    {
      name: 'Losses Don',
      role: 'Developer',
      avatar: 'https://avatars2.githubusercontent.com/u/1384036?s=460&v=4',
      url: 'https://github.com/losses'
    },
    {
      name: 'UTL_1138',
      role: 'Designer',
      avatar: 'https://avatars1.githubusercontent.com/u/8299251?s=460&v=4',
      url: 'https://github.com/967018'
    }
  ];

  const links = [
    { name: 'Github', url: 'https://github.com/ax-design' },
    { name: 'Telegram', url: 'https://t.me/axiom_ds' },
    { name: 'Twitter', url: 'https://twitter.com/axiom_ds' }
  ];
</script>

<svelte:head>
  <title>AXIOM DESIGN SYSTEM</title>
</svelte:head>

<div class="h_container">
  <Header />

  <Section id="developers" title="For Developers">
    <ul class="nav-links">
      <li><a href="#developers">Getting Started</a></li>
      <li><a href="/components">Components</a></li>
      <li><a href="#developers">Styling</a></li>
      <li><a href="#developers">Templates</a></li>
    </ul>
  </Section>

  <Section id="designers" title="For Designers">
    <ul class="nav-links">
      <li><a href="#designers">Introduction</a></li>
      <li><a href="#designers">Concepts</a></li>
      <li><a href="#designers">Guidelines</a></li>
      <li><a href="#designers">Axiom Icons</a></li>
    </ul>
  </Section>

  <Section id="about" title="About Us">
    <h2 class="sub-title">Team</h2>
    <ul class="team_member">
      {#each team as member (member.name)}
        <TeamMember
          name={member.name}
          role={member.role}
          avatar={member.avatar}
          url={member.url}
        />
      {/each}
    </ul>

    <h2 class="sub-title">Links</h2>
    <ul class="social-links">
      {#each links as link (link.name)}
        <li>
          <a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
        </li>
      {/each}
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

  .sub-title {
    margin: 1.5em 0 0.8em 0;
    font-size: 1.5em;
    font-weight: 500;
  }

  .nav-links,
  .social-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .nav-links li,
  .social-links li {
    margin: 0.8em 0;
  }

  .nav-links a,
  .social-links a {
    font-size: 1.4em;
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .nav-links a:hover,
  .social-links a:hover {
    color: #0284c7;
    text-decoration: underline;
  }

  .team_member {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5em;
  }
</style>
