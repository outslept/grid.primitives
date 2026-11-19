export const BREAKPOINTS = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type ResponsiveProp<T> = T | Partial<Record<Breakpoint, T>>;

export const BP_ORDER_ASC: readonly Breakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];
export const BP_ORDER_DESC: readonly Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "base"];

export const BP_DESC_INDEX: Record<Breakpoint, number> = {
  "2xl": 0,
  xl: 1,
  lg: 2,
  md: 3,
  sm: 4,
  base: 5,
};

export function pickBp(w: number): Breakpoint {
  if (w >= 1536) return "2xl";
  if (w >= 1280) return "xl";
  if (w >= 1024) return "lg";
  if (w >= 768) return "md";
  if (w >= 640) return "sm";
  return "base";
}
