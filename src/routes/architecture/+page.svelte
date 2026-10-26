<script lang="ts">
  import AppShell from '#lib/site/AppShell.svelte';
  import ArchitectureDiagram from '#lib/site/ArchitectureDiagram.svelte';
  import Flow from '#lib/site/Flow.svelte';
  import { PLANES, byId, onPlane } from '#lib/site/architecture';

  const ACCENT = '#647687';

  // The planes from the top, as the text alternative lists them.
  const layers = PLANES.map((plane, index) => ({ plane, index, packages: onPlane(index) })).reverse();
  const names = (ids: string[]) => ids.map((id) => byId.get(id)!.name).join(', ');
</script>

<svelte:head>
  <title>Architecture - Axiom Design System</title>
  <meta name="description" content="How the packages of the Axiom Design System build on each other: one Surface, layers by name, components that compose them." />
</svelte:head>

<AppShell title="Architecture" accent={ACCENT}>
  <Flow label="How it fits together">
    <p class="tagline">One Surface in the middle. Everything else is drawn on it, or built from it.</p>
    <div>
      <h2>One surface, one shape</h2>
      <p>
        <code>&lt;ax-surface&gt;</code> is the box every visual effect draws on. It owns the shape, the tilt and one
        frame scheduler for the whole page, and it draws its content with layers. Every layer of a surface paints on
        the same outline, in the same frame. The shape comes from <a href="/components/shape/">Shape</a>, and its
        properties are read through <a href="/components/typed-om/">Typed OM</a>.
      </p>
      <p>
        Surfaces only work while they are visible, read their styles only after something changed, and lower the
        frame rate of far and small surfaces when the page starts dropping frames.
      </p>
    </div>
    <div>
      <h2>Layers are registered by name</h2>
      <p>
        A layer is an object that draws one thing. It is registered under a name, and a surface picks its layers with
        the <code>layers</code> attribute:
      </p>
      <p><code>&lt;ax-surface layers="elevation fill reveal"&gt;</code></p>
      <p>
        Layers are drawn in the order you list them, and your content is always on top. <code>fill</code> and
        <code>focus</code> come with Surface; Elevation, Acrylic and Reveal Highlight add their own, and you can
        register one yourself. Pressure's tilt is the one Surface already owns.
      </p>
    </div>
    <div>
      <h2>Components compose them</h2>
      <p>
        Tile, Tile Group, Navigation and Scrollbar depend on Surface and are styled the way Surface is: with CSS
        custom properties (<code>--ax-radius</code>, <code>--ax-fill-color</code>, <code>--tile-rows</code>,
        <code>--ax-scrollbar-thickness</code>), and, for the pieces inside a component, with
        <code>::part()</code>. The Scrollbar names every piece of its bars as a part: <code>thumb</code>,
        <code>thumb-hover</code>, <code>scrollbar-vertical</code> and the others. Scroll stands alone: it depends on
        no other package.
      </p>
    </div>
    <div>
      <h2>Kits replace parts</h2>
      <p>
        The Scrollbar takes its parts by dependency injection. Each kind of part (thumb, button, track, track piece,
        corner, marker, card) has a contract class that draws nothing, and a default class with the Windows 8 look.
        <code>defineScrollbarKit()</code> registers your classes under a name, and <code>kit="name"</code> on an
        <code>&lt;ax-scroll-view&gt;</code> builds the bars with them. The Windows XP scrollbar ships as such a kit.
      </p>
    </div>
  </Flow>

  <Flow label="The packages, in bands">
    <ArchitectureDiagram />
  </Flow>

  <Flow label="Layers and dependencies as text">
    <h2 class="list-title">The bands, from the top</h2>
    <p>
      The same diagram as a list. A package depends on the ones named after it, and a package of a band can depend
      on the bands below it.
    </p>
    {#each layers as { plane, packages } (plane.name)}
      <div>
        <h3>{plane.name}</h3>
        <p class="about">{plane.about}</p>
        <ul>
          {#each packages as pkg (pkg.id)}
            <li>
              <a href={pkg.href}>{pkg.name}</a>: {pkg.about}
              <span class="needs">Depends on {pkg.needs.length ? names(pkg.needs) : 'nothing'}.</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
    <p>To start with a few of them, see <a href="/getting-started/">Getting Started</a>.</p>
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
  .list-title {
    font-size: 26px;
    font-weight: 300;
  }
  h3 {
    margin: 0 0 4px;
    font-size: 15px;
    font-weight: 600;
  }
  .about {
    color: #6b645a;
  }
  ul {
    margin: 0;
    padding: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  li {
    margin: 0 0 8px;
  }
  .needs {
    display: block;
    color: #6b645a;
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
</style>
