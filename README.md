# AXIOM DESIGN SYSTEM

Official website and component gallery for the Axiom Design System.

Built with **SvelteKit (SSG)** and powered by **Bun**.

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

To run against the **built** packages instead — what a release ships — build the checkouts you want and start the server with the switch:

```bash
(cd ../tile-group && bun run build)
AX_DEBUG_PACKAGES=1 bun run dev
```

A package that has no build output falls back to the published copy, and the server warns about it on start. The switch also applies to `bun run build`, so a preview build can be measured the same way.

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
