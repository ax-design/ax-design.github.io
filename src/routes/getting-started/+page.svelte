<script lang="ts">
  import AppShell from '#lib/site/AppShell.svelte';
  import Code from '#lib/site/Code.svelte';
  import Flow from '#lib/site/Flow.svelte';
  import * as text from '#lib/site/getting-started';

  const ACCENT = '#6d8764';
</script>

<svelte:head>
  <title>Getting Started - Axiom Design System</title>
  <meta name="description" content="Which packages of the Axiom Design System to install for an app, and when you need the foundations." />
</svelte:head>

<AppShell title="Getting Started" accent={ACCENT}>
  <Flow label="Welcome">
    <p class="tagline">Welcome to the Axiom Design System.</p>
    <p>
      Axiom is a set of web components that keeps what we loved in the first Material Design and the first Fluent
      Design: the light that follows the pointer, real shadows, acrylic glass, a press that tilts what you touch, live
      tiles you can drag, an indicator that stretches as it moves. They were fun, rich and still easy to read, and
      later systems traded much of that away.
    </p>
    <p>
      A good design system raises the floor of what a page looks like without lowering the ceiling. The effects share
      one infrastructure. <a href="/components/surface/">Surface</a> draws
      every effect on one shape with one frame scheduler, <a href="/components/shape/">Shape</a> gives every effect the
      same outline, and <a href="/components/typed-om/">Typed OM</a> reads the design tokens you set as CSS custom
      properties. The <a href="/architecture/">Architecture</a> page shows how it fits together.
    </p>
    <p>
      The effects stay accessible: the reveal light shows borders only where the pointer is, shadows are only ever
      black and set by one depth, and reduced motion and forced colours are respected. The story of the project is in
      <a href="https://roriri.one/2026/10/15/ax-design">this post</a>.
    </p>
  </Flow>

  <Flow label="Build an app">
    <p class="tagline">Install the components your app uses.</p>
    <p>
      An app uses the components: install the ones you use. Each of them brings
      <a href="/components/surface/">Surface</a>, <a href="/components/shape/">Shape</a> and
      <a href="/components/typed-om/">Typed OM</a> along as its own dependencies, so you do not install those.
    </p>
    <div>
      <h2>Install</h2>
      <Code code={text.INSTALL_APP} language="shell" />
    </div>
    <div>
      <h2>Register</h2>
      <p>Every package has a <code>register()</code> that defines its elements. Call it once, before the markup is used:</p>
      <Code code={text.REGISTER_APP} language="js" />
      <p><code>&lt;ax-tile&gt;</code> is not in the tile group package. It comes from <code>@ax-design/tile</code>, so register both.</p>
    </div>
    <div>
      <h2>Markup</h2>
      <p>
        A tile has one action, the link or button with <code>slot="action"</code>. A tile group lays its children out
        in cells, like the Start screen, and <code>ax-scroll</code> turns the wheel sideways:
      </p>
      <Code code={text.MARKUP_APP} language="html" />
    </div>
    <div>
      <p>
        The reveal light on a tile is its own package, <a href="/components/reveal-highlight/">Reveal Highlight</a>.
        The tiles above use <code>layers="fill"</code> only. To add the light, install it and register its layer:
      </p>
      <Code code={text.REVEAL_NOTE} language="js" />
    </div>
  </Flow>

  <Flow label="Custom components">
    <h2 class="title">Foundations</h2>
    <p>
      Install the foundations when you build a component of your own, or when you want an effect on a Surface:
      <a href="/components/elevation/">elevation</a>, <a href="/components/acrylic/">acrylic</a>,
      <a href="/components/reveal-highlight/">reveal</a> or the tilt of <a href="/components/pressure/">pressure</a>.
      A Surface is the box every effect draws on. It owns the shape, the tilt and one frame scheduler for the page.
    </p>
    <div>
      <h2>Install</h2>
      <Code code={text.INSTALL_FOUNDATIONS} language="shell" />
    </div>
    <div>
      <h2>Register</h2>
      <p>The effects register their layers by name, and the Surface then uses them:</p>
      <Code code={text.REGISTER_FOUNDATIONS} language="js" />
    </div>
    <div>
      <h2>Example</h2>
      <p>
        The layers are drawn in the order you list them, and your content is always on top.
        <code>fill</code> comes with Surface; put <code>elevation</code> first, so the other layers paint over it:
      </p>
      <Code code={text.MARKUP_FOUNDATIONS} language="html" />
      <Code code={text.STYLE_FOUNDATIONS} language="css" />
    </div>
    <p>
      Pressure's own element is <code>&lt;ax-pressure&gt;</code> (<code>register()</code> from
      <code>@ax-design/pressure</code>); on a Surface you get the same tilt with <code>--ax-tilt-mode</code>.
      To write a layer of your own, see <a href="/components/surface/">Surface</a>.
    </p>
  </Flow>

  <Flow label="CDN">
    <h2 class="title">Using a CDN</h2>
    <p>
      The components, the effects and Pressure ship a script, <code>build/main.js</code>, that exposes a global with
      a <code>register()</code>. Each script carries its own copy of Surface, so load packages of the same version
      together. Surface, Shape and Typed OM have no script of their own: use them as modules.
    </p>
    <Code code={text.CDN} language="html" />
    <div>
      <h2>Packages</h2>
      <ul class="links">
        {#each text.LINKS as link (link.href)}
          <li><a href={link.href}>{link.name}</a>{#if link.global} <span class="global">{link.global}</span>{/if}</li>
        {/each}
      </ul>
    </div>
    <p>
      How the packages depend on each other, layer by layer, is on the
      <a href="/architecture/">Architecture</a> page.
    </p>
  </Flow>
</AppShell>

<style>
  .tagline {
    margin-top: 0;
    font-size: 22px;
    font-weight: 300;
    line-height: 1.35;
    color: #1b1b1b;
  }
  p {
    margin-top: 0;
    font-size: 15px;
    line-height: 1.55;
    color: #2b2925;
  }
  div > p {
    margin: 0 0 8px;
  }
  h2 {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 400;
    line-height: 1.3;
  }
  .title {
    font-size: 26px;
    font-weight: 300;
  }
  div > :global(.code) {
    margin: 0 0 12px;
  }
  a {
    color: #1b1b1b;
    text-decoration-color: var(--page-accent);
    text-decoration-thickness: 2px;
    text-underline-offset: 2px;
  }
  a:hover {
    background: color-mix(in srgb, var(--page-accent) 25%, transparent);
  }
  code {
    font-family: ui-monospace, 'Cascadia Code', Consolas, Menlo, monospace;
    font-size: 0.92em;
  }
  .links {
    margin: 0;
    padding: 0;
    columns: 2;
    font-size: 15px;
    line-height: 1.9;
  }
  .links li {
    break-inside: avoid;
  }
  .global {
    margin-left: 6px;
    font-family: ui-monospace, 'Cascadia Code', Consolas, Menlo, monospace;
    font-size: 11px;
    color: #6b645a;
  }
</style>
