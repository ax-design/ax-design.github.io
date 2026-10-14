# AXIOM DESIGN SYSTEM

Official website and interactive component gallery for the Axiom Design System.

Built with **SvelteKit (SSG)** and powered by **Bun**.

## The site

* `/`: a Windows 8 Start screen. The title image, then groups of tiles for the components, the developers and the links.
* `/components/<slug>`: a page per component, laid out like a Windows 8 app: one column per example, with a preview on top, then its text, its controls and the code they produce, read left to right.
* `/playground`: every property of Surface, with the shapes of the Material 3 shape set to start from.

Every page scrolls sideways; a mouse wheel, a touchpad and the keys scroll it through `bindScroll` of [`@ax-design/scroll`](https://github.com/ax-design/scroll).

The content of the component pages is data, in `src/lib/docs/` (one file per component, described by `src/lib/docs/types.ts`). To add a page, add a file there and list it in `src/lib/docs/index.ts`. The form controls of the pages are in `src/lib/ui/`.

## Development & Build

This project uses [Bun](https://bun.sh) as the package manager and runtime.

### Install Dependencies

```bash
bun install
```

### Start Development Server

```bash
bun run dev
```

When the packages of the design system are checked out next to this repository (`../surface`, `../tile-group` and so on), the site uses their sources, so you see your changes before they are published. Without them it uses the published packages.

### Static Site Generation (SSG Build)

```bash
bun run build
```

Prerendered static files are generated in the `build/` directory ready for deployment to GitHub Pages or static hosts.

### Preview Static Build Locally

```bash
bun run preview
```

### Type Checking

```bash
bun run check
```
