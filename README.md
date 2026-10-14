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
