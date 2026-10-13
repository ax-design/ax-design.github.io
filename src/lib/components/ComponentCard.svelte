<script lang="ts">
  interface Props {
    href: string;
    icon: string;
    name: string;
    alt?: string;
  }

  let { href, icon, name, alt = `Icon of ${name} component` }: Props = $props();
</script>

<li>
  <a {href}>
    <img src={icon} class="component_icon" {alt} />
    <span>{name}</span>
  </a>
</li>
