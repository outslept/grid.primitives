import type { CSSProperties } from "react";
import { BP_DESC_INDEX, BP_ORDER_DESC, type Breakpoint, type ResponsiveProp } from "./breakpoints";

export type SpacingToken =
  | "space.0"
  | "space.050"
  | "space.100"
  | "space.150"
  | "space.200"
  | "space.300"
  | "space.400"
  | "space.600"
  | "space.800";

export type SpaceToken = SpacingToken;
export type SpacingPreset = "none" | "tight" | "standard" | "relaxed" | "wide" | SpacingToken;
export type GridColumns = number | "auto-fit" | "auto-fill" | string | (string | number)[];
export type GridRows = number | "auto" | string | (string | number)[];
export type GridGap = SpacingPreset | number | (string & {});
export type GridSelfAlignment = "start" | "end" | "center" | "stretch" | "baseline";
export type GridContentDistribution =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type GridAutoFlow = "row" | "column" | "dense" | "row dense" | "column dense";
export type GridPlacement =
  | number
  | "auto"
  | `span ${number}`
  | `${number} / ${number}`
  | `${number} / span ${number}`;

export interface ContainerIn {
  templateColumns?: ResponsiveProp<GridColumns>;
  columns?: ResponsiveProp<GridColumns>;
  templateRows?: ResponsiveProp<GridRows>;
  rows?: ResponsiveProp<GridRows>;
  templateAreas?: ResponsiveProp<string | string[]>;
  areas?: ResponsiveProp<string | string[]>;
  gap?: ResponsiveProp<GridGap>;
  columnGap?: ResponsiveProp<GridGap>;
  rowGap?: ResponsiveProp<GridGap>;
  autoFlow?: ResponsiveProp<GridAutoFlow>;
  autoRows?: ResponsiveProp<string>;
  autoColumns?: ResponsiveProp<string>;
  justifyItems?: ResponsiveProp<GridSelfAlignment>;
  alignItems?: ResponsiveProp<GridSelfAlignment>;
  justifyContent?: ResponsiveProp<GridContentDistribution>;
  alignContent?: ResponsiveProp<GridContentDistribution>;
  minItemWidth?: ResponsiveProp<string>;
  maxItemWidth?: ResponsiveProp<string>;
  aspectRatio?: string;
  style?: CSSProperties;
}

export interface ItemIn {
  column?: ResponsiveProp<GridPlacement>;
  row?: ResponsiveProp<GridPlacement>;
  columnStart?: ResponsiveProp<GridPlacement>;
  columnEnd?: ResponsiveProp<GridPlacement>;
  rowStart?: ResponsiveProp<GridPlacement>;
  rowEnd?: ResponsiveProp<GridPlacement>;
  area?: ResponsiveProp<string>;
  order?: ResponsiveProp<number>;
  justifySelf?: ResponsiveProp<GridSelfAlignment>;
  alignSelf?: ResponsiveProp<GridSelfAlignment>;
  colSpan?: ResponsiveProp<number>;
  span?: ResponsiveProp<number>;
  rowSpan?: ResponsiveProp<number>;
  aspectRatio?: string;
  style?: CSSProperties;
}

export const SPACE_MAP: Record<SpacingPreset, string> = {
  none: "0px",
  tight: "8px",
  standard: "16px",
  relaxed: "24px",
  wide: "32px",
  "space.0": "0px",
  "space.050": "4px",
  "space.100": "8px",
  "space.150": "12px",
  "space.200": "16px",
  "space.300": "24px",
  "space.400": "32px",
  "space.600": "48px",
  "space.800": "64px",
};

function isResponsiveObject<T>(v: ResponsiveProp<T>): v is Partial<Record<Breakpoint, T>> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function resolve<T>(v: ResponsiveProp<T> | undefined, bp: Breakpoint): T | undefined {
  if (v === undefined) return undefined;
  if (isResponsiveObject<T>(v)) {
    for (let i = BP_DESC_INDEX[bp]; i < 6; i++) {
      const val = v[BP_ORDER_DESC[i]];
      if (val !== undefined) return val;
    }
    return undefined;
  }
  return v;
}

function joinTracks(arr: (string | number)[]): string {
  let out = "";
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    out += (i > 0 ? " " : "") + (typeof x === "number" ? `${x}fr` : x);
  }
  return out;
}

function formatAreas(a: string | string[]): string {
  if (typeof a === "string") return a;
  let out = "";
  for (let i = 0; i < a.length; i++) {
    const clean = a[i].replace(/^["']|["']$/g, "");
    out += (i > 0 ? " " : "") + `"${clean}"`;
  }
  return out;
}

export function cols(v: GridColumns): string {
  if (typeof v === "number") return `repeat(${v}, 1fr)`;
  if (v === "auto-fit") return "repeat(auto-fit, minmax(250px, 1fr))";
  if (v === "auto-fill") return "repeat(auto-fill, minmax(250px, 1fr))";
  if (Array.isArray(v)) return joinTracks(v);
  return v;
}

export function rows(v: GridRows): string {
  if (typeof v === "number") return `repeat(${v}, 1fr)`;
  if (v === "auto") return "auto";
  if (Array.isArray(v)) return joinTracks(v);
  return v;
}

export function gap(v: GridGap): string {
  if (typeof v === "number") return `${v}px`;
  return SPACE_MAP[v as SpacingPreset] ?? v;
}

export function gapVal(
  g: ResponsiveProp<GridGap> | undefined,
  bp: Breakpoint,
  sp: SpacingPreset,
): string {
  if (typeof g === "string" && g in SPACE_MAP) return SPACE_MAP[g as SpacingPreset];
  const v = resolve(g, bp);
  return v !== undefined ? gap(v) : SPACE_MAP[sp];
}

export function containerStyle(p: ContainerIn, bp: Breakpoint, sp: SpacingPreset): CSSProperties {
  const c = resolve(p.templateColumns ?? p.columns, bp);
  const r = resolve(p.templateRows ?? p.rows, bp);
  const a = resolve(p.templateAreas ?? p.areas, bp);
  const st: CSSProperties = { display: "grid", gap: gapVal(p.gap, bp, sp) };
  if (c === "auto-fit" || c === "auto-fill") {
    const min = resolve(p.minItemWidth, bp) ?? "250px";
    const max = resolve(p.maxItemWidth, bp) ?? "1fr";
    st.gridTemplateColumns = `repeat(${c}, minmax(${min}, ${max}))`;
  } else if (c !== undefined) {
    st.gridTemplateColumns = cols(c);
  }
  if (r !== undefined) st.gridTemplateRows = rows(r);
  if (a !== undefined) st.gridTemplateAreas = formatAreas(a);
  const cg = resolve(p.columnGap, bp);
  if (cg !== undefined) st.columnGap = gap(cg);
  const rg = resolve(p.rowGap, bp);
  if (rg !== undefined) st.rowGap = gap(rg);
  const af = resolve(p.autoFlow, bp);
  if (af !== undefined) st.gridAutoFlow = af;
  const ar = resolve(p.autoRows, bp);
  if (ar !== undefined) st.gridAutoRows = ar;
  const ac = resolve(p.autoColumns, bp);
  if (ac !== undefined) st.gridAutoColumns = ac;
  const ji = resolve(p.justifyItems, bp);
  if (ji !== undefined) st.justifyItems = ji;
  const ai = resolve(p.alignItems, bp);
  if (ai !== undefined) st.alignItems = ai;
  const jc = resolve(p.justifyContent, bp);
  if (jc !== undefined) st.justifyContent = jc;
  const al = resolve(p.alignContent, bp);
  if (al !== undefined) st.alignContent = al;
  if (p.aspectRatio !== undefined) st.aspectRatio = p.aspectRatio;
  return p.style ? { ...st, ...p.style } : st;
}

export function itemStyle(p: ItemIn, bp: Breakpoint): CSSProperties {
  const st: CSSProperties = {};
  const spanCols = resolve(p.colSpan ?? p.span, bp);
  if (spanCols !== undefined) st.gridColumn = `span ${spanCols}`;
  const spanRows = resolve(p.rowSpan, bp);
  if (spanRows !== undefined) st.gridRow = `span ${spanRows}`;
  const c = resolve(p.column, bp);
  if (c !== undefined) st.gridColumn = String(c);
  const r = resolve(p.row, bp);
  if (r !== undefined) st.gridRow = String(r);
  const cs = resolve(p.columnStart, bp);
  if (cs !== undefined) st.gridColumnStart = String(cs);
  const ce = resolve(p.columnEnd, bp);
  if (ce !== undefined) st.gridColumnEnd = String(ce);
  const rs = resolve(p.rowStart, bp);
  if (rs !== undefined) st.gridRowStart = String(rs);
  const re = resolve(p.rowEnd, bp);
  if (re !== undefined) st.gridRowEnd = String(re);
  const a = resolve(p.area, bp);
  if (a !== undefined) st.gridArea = a;
  const o = resolve(p.order, bp);
  if (o !== undefined) st.order = o;
  const js = resolve(p.justifySelf, bp);
  if (js !== undefined) st.justifySelf = js;
  const al = resolve(p.alignSelf, bp);
  if (al !== undefined) st.alignSelf = al;
  if (p.aspectRatio !== undefined) st.aspectRatio = p.aspectRatio;
  return p.style ? { ...st, ...p.style } : st;
}
