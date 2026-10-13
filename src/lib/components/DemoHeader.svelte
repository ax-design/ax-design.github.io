<script lang="ts">
  interface Props {
    title: string;
    description: string;
    componentName: string;
  }

  let { title, description, componentName }: Props = $props();
</script>

<div class="demo-header">
  <nav class="breadcrumb">
    <a href="/">Home</a>
    <span class="sep">/</span>
    <a href="/components">Components</a>
    <span class="sep">/</span>
    <span class="current">{componentName}</span>
  </nav>

  <h1 class="demo-title">{title}</h1>
  <p class="demo-description">
    Project Axiom is a web component set which aims to combine good parts of Fluent Design System and Material Design into a single design language.
  </p>
  <p class="demo-note">{description}</p>
</div>

<style>
  .demo-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }

  .breadcrumb {
    font-size: 13px;
    color: #666;
    margin-bottom: 12px;
  }

  .breadcrumb a {
    color: #0284c7;
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .sep {
    margin: 0 6px;
    color: #999;
  }

  .current {
    color: #333;
    font-weight: 500;
  }

  .demo-title {
    margin: 0 0 10px 0;
    font-size: 2em;
    font-weight: 700;
  }

  .demo-description {
    margin: 4px 0;
    color: #555;
    font-size: 15px;
  }

  .demo-note {
    margin: 4px 0;
    color: #333;
    font-weight: 500;
    font-size: 15px;
  }
</style>
