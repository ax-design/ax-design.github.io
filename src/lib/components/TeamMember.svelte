<script lang="ts">
  interface Props {
    name: string;
    role: string;
    avatar: string;
    url?: string;
  }

  let { name, role, avatar, url }: Props = $props();
</script>

<li class="team-member-item">
  <img src={avatar} alt="{name}'s avatar" class="avatar" loading="lazy" />
  <p class="name">
    {#if url}
      <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
    {:else}
      {name}
    {/if}
  </p>
  <p class="info">{role}</p>
</li>

<style>
  .team-member-item {
    display: inline-block;
    margin-right: 2em;
    margin-bottom: 2em;
    vertical-align: top;
    text-align: left;
  }

  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    display: block;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .name {
    margin-top: 0.8em;
    font-size: 1.2em;
    font-weight: 600;
  }

  .name a {
    color: inherit;
    text-decoration: none;
  }

  .name a:hover {
    text-decoration: underline;
  }

  .info {
    margin-top: 0.2em;
    color: #666;
    font-size: 0.95em;
  }
</style>
