# grid.primitives

Container-isolated CSS Grid primitives for React 19

## Inspiration

`grid.primitives` started as an open-source exploration inspired by the [Vercel Geist UI Grid](https://vercel.com/geist/grid) for internal tools, and evolved to combine three core ideas:

- **Container-Query Isolation**: Breakpoints resolve against the nearest `<Grid.Root>` (or standalone `<Grid>`) via `ResizeObserver` instead of `window.matchMedia`, so the exact same component adapts to any sidebar, modal, or split pane.
- **Atlaskit Grid Ergonomics**: Direct CSS Grid mapping (`templateColumns`, `templateRows`, `templateAreas`, `autoFlow`) paired with harmonious spacing tokens (`space.0` – `space.800`).
- **Base UI `render` Polymorphism**: Replace `asChild` / `Slot` with `render={<ul />}` or `render={(props, state) => <li {...props} />}` with contravariant `RefCallback` type safety and live state injection.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the interactive blueprint workbench.

## Usage

### 1. Standalone & Responsive Columns

`<Grid>` works standalone or inside `<Grid.Root>`:

```tsx
import { Grid } from "@/components/grid";

export function MetricsGrid() {
  return (
    <Grid templateColumns={12} gap="space.200">
      <Grid.Item colSpan={{ base: 12, md: 8 }}>Primary (8/12)</Grid.Item>
      <Grid.Item colSpan={{ base: 12, md: 4 }}>Inspector (4/12)</Grid.Item>
    </Grid>
  );
}
```

### 2. Nested Container Isolation

Nest `<Grid.Root>` to create an isolated breakpoint scope unaffected by the viewport or outer stage:

```tsx
<Grid.Root onBreakpointChange={setBp}>
  <Grid templateColumns={{ base: 1, md: 3 }} gap="space.200">
    <Grid.Item>Outer Scope</Grid.Item>
    <Grid.Item>Sibling Scope</Grid.Item>
    <Grid.Root className="w-[320px]">
      {/* Resolves to `base` (320px) even when the outer stage is `xl` */}
      <Grid templateColumns={{ base: 1, sm: 2, lg: 4 }} gap="space.100">
        <Grid.Item>Scoped Child</Grid.Item>
      </Grid>
    </Grid.Root>
  </Grid>
</Grid.Root>
```

### 3. Template Areas

```tsx
<Grid
  templateColumns={{ base: "1fr", md: "180px 1fr" }}
  templateAreas={{
    base: ["nav", "main", "foot"],
    md: ["nav main", "nav foot"],
  }}
  gap="space.200"
>
  <Grid.Area name="nav">Navigation</Grid.Area>
  <Grid.Area name="main">Canvas</Grid.Area>
  <Grid.Area name="foot">Status</Grid.Area>
</Grid>
```

### 4. AutoGrid & Dense Packing

```tsx
<Grid.AutoGrid minItemWidth="170px" gap="space.200" autoFlow="row dense">
  <Grid.Item colSpan={{ base: 1, sm: 2 }}>Wide Unit</Grid.Item>
  <Grid.Item>Standard Unit</Grid.Item>
</Grid.AutoGrid>
```

### 5. Base UI `render` Prop & `Grid.Stack`

Render semantic HTML elements without wrapper `<div>`s while reading live internal state:

```tsx
<Grid.Stack>
  <BackgroundGrid />
  <Grid
    templateColumns={{ base: 1, sm: 3 }}
    gap="space.200"
    render={<ul className="m-0 list-none p-0" />}
  >
    <Grid.Item
      render={(props, state) => (
        <li {...props} data-bp={state.breakpoint}>
          Active breakpoint: {state.breakpoint}
        </li>
      )}
    />
  </Grid>
</Grid.Stack>
```

## Primitives & API

| Primitive                 | Description                                            | Key Props                                                                                              |
| :------------------------ | :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `Grid` / `Grid.Container` | Primary CSS Grid container (standalone or contextual)  | `templateColumns`, `templateRows`, `templateAreas`, `gap`, `columnGap`, `rowGap`, `autoFlow`, `render` |
| `Grid.Root`               | Shared breakpoint observer scope                       | `spacing`, `defaultBreakpoint`, `onBreakpointChange`, `render`                                         |
| `Grid.Item`               | Track placement & span item                            | `colSpan` (`span`), `rowSpan`, `column`, `row`, `area`, `interactive`, `animate`, `render`             |
| `Grid.Area`               | Named `grid-area` region                               | `name`, `render`                                                                                       |
| `Grid.AutoGrid`           | Responsive `auto-fit` track generator                  | `minItemWidth`, `maxItemWidth`, `autoFlow`, `gap`                                                      |
| `Grid.Masonry`            | `max-content` row track layout                         | `masonryColumns`, `gap`                                                                                |
| `Grid.Stack`              | `1 / 1` single-cell layer stack (zero height collapse) | `render`, `className`                                                                                  |
| `useGrid()`               | Hook returning current container state                 | `{ breakpoint, bp, spacing, space, rootRef }`                                                          |

### Breakpoints & Space Tokens

- **Container Breakpoints**: `base` (`0px`), `sm` (`640px`), `md` (`768px`), `lg` (`1024px`), `xl` (`1280px`), `2xl` (`1536px`)
- **Spacing Tokens**: `space.0` (`0px`), `space.050` (`4px`), `space.100` (`8px`), `space.150` (`12px`), `space.200` (`16px`), `space.300` (`24px`), `space.400` (`32px`), `space.600` (`48px`), `space.800` (`64px`)

## Status & Contributing

`grid.primitives` is in active development and primarily maintained for personal and internal use, but open-sourced for anyone building design systems or container-driven layouts. Issues and pull requests are welcome.
