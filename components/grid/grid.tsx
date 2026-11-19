"use client";

import type { CSSProperties, ReactNode } from "react";
import React, { useContext, useMemo } from "react";
import type { Breakpoint, ResponsiveProp } from "./breakpoints";
import { cn } from "cn";
import {
  type GridAutoFlow,
  type GridColumns,
  type GridContentDistribution,
  type GridGap,
  type GridRows,
  type GridSelfAlignment,
  type SpaceToken,
  type SpacingPreset,
  type SpacingToken,
  containerStyle,
  resolve,
} from "./styles";
import s from "./grid.module.css";
import { GridArea, GridItem, GridStack } from "./primitives";
import {
  GridContext,
  type GridContextValue,
  type RenderProp,
  renderElement,
  useBreakpointObserver,
  useGrid,
} from "./render";

export interface GridRootState {
  breakpoint: Breakpoint;
  spacing: SpacingPreset;
}

export interface GridRootProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  ref?: React.Ref<HTMLElement>;
  render?: RenderProp<GridRootState>;
  spacing?: SpacingPreset;
  defaultBreakpoint?: Breakpoint;
  testId?: string;
  onBreakpointChange?: (bp: Breakpoint) => void;
  children?: ReactNode;
}

export function GridRoot({
  render,
  spacing = "space.200",
  defaultBreakpoint = "base",
  testId,
  onBreakpointChange,
  className,
  children,
  ref,
  ...domProps
}: GridRootProps) {
  const { bp, internalRef, handleRef } = useBreakpointObserver(
    true,
    ref,
    onBreakpointChange,
    defaultBreakpoint,
  );
  const ctx = useMemo<GridContextValue>(
    () => ({ bp, breakpoint: bp, space: spacing, spacing, rootRef: internalRef }),
    [spacing, bp, internalRef],
  );
  const state = useMemo<GridRootState>(() => ({ breakpoint: bp, spacing }), [bp, spacing]);

  return (
    <GridContext.Provider value={ctx}>
      {renderElement(render, state, {
        ...domProps,
        ref: handleRef,
        className: cn(s.root, "@container font-sans text-foreground bg-background", className),
        "data-slot": "grid-root",
        "data-grid-root": "",
        "data-breakpoint": bp,
        "data-testid": testId,
        children,
      })}
    </GridContext.Provider>
  );
}
GridRoot.displayName = "Grid.Root";

export type GridVariant = "grid" | "auto" | "masonry";

export interface GridContainerState {
  breakpoint: Breakpoint;
  spacing: SpacingPreset;
  variant: GridVariant;
}

export interface GridContainerProps extends Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children"
> {
  ref?: React.Ref<HTMLElement>;
  render?: RenderProp<GridContainerState>;
  variant?: GridVariant;
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
  aspectRatio?: string;
  minItemWidth?: ResponsiveProp<string>;
  maxItemWidth?: ResponsiveProp<string>;
  masonryColumns?: ResponsiveProp<number>;
  spacing?: SpacingPreset;
  defaultBreakpoint?: Breakpoint;
  testId?: string;
  onBreakpointChange?: (bp: Breakpoint) => void;
  children?: ReactNode;
}

export function GridContainer({
  ref,
  render,
  variant = "grid",
  templateColumns,
  columns,
  templateRows,
  rows,
  templateAreas,
  areas,
  gap,
  columnGap,
  rowGap,
  autoFlow,
  autoRows,
  autoColumns,
  justifyItems,
  alignItems,
  justifyContent,
  alignContent,
  aspectRatio,
  minItemWidth,
  maxItemWidth,
  masonryColumns,
  spacing,
  defaultBreakpoint = "base",
  testId,
  onBreakpointChange,
  className,
  style,
  children,
  ...domProps
}: GridContainerProps) {
  const parentCtx = useContext(GridContext);
  const isStandalone = parentCtx === null;
  const {
    bp: ownBp,
    internalRef,
    handleRef,
  } = useBreakpointObserver(isStandalone, ref, onBreakpointChange, defaultBreakpoint);
  const bp = isStandalone ? ownBp : parentCtx.bp;
  const space = spacing ?? (isStandalone ? "space.200" : parentCtx.space);

  const standaloneCtx = useMemo<GridContextValue>(
    () => ({ bp, breakpoint: bp, space, spacing: space, rootRef: internalRef }),
    [bp, space, internalRef],
  );

  const st = useMemo((): CSSProperties => {
    const base = containerStyle(
      {
        templateColumns: variant === "auto" ? "auto-fit" : (templateColumns ?? columns),
        templateRows: templateRows ?? rows,
        templateAreas: templateAreas ?? areas,
        gap,
        columnGap,
        rowGap,
        autoFlow,
        autoRows: variant === "masonry" ? "max-content" : autoRows,
        autoColumns,
        justifyItems,
        alignItems,
        justifyContent,
        alignContent,
        aspectRatio,
        minItemWidth,
        maxItemWidth,
        style,
      },
      bp,
      space,
    );
    if (variant === "masonry") {
      base.gridTemplateColumns = `repeat(${resolve(masonryColumns, bp) ?? 1}, 1fr)`;
    }
    return base;
  }, [
    variant,
    templateColumns,
    columns,
    templateRows,
    rows,
    templateAreas,
    areas,
    gap,
    columnGap,
    rowGap,
    autoFlow,
    autoRows,
    autoColumns,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    aspectRatio,
    minItemWidth,
    maxItemWidth,
    masonryColumns,
    bp,
    space,
    style,
  ]);

  const state = useMemo<GridContainerState>(
    () => ({ breakpoint: bp, spacing: space, variant }),
    [bp, space, variant],
  );

  const node = renderElement(render, state, {
    ...domProps,
    ref: isStandalone ? handleRef : ref,
    className: cn(s.root, "grid relative", className),
    style: st,
    "data-slot": "grid",
    "data-grid-container": "",
    "data-grid-variant": variant,
    "data-breakpoint": bp,
    "data-testid": testId,
    children,
  });

  return isStandalone ? (
    <GridContext.Provider value={standaloneCtx}>{node}</GridContext.Provider>
  ) : (
    node
  );
}
GridContainer.displayName = "Grid";

type AliasProps = Omit<GridContainerProps, "variant">;

export function GridAutoGrid(p: AliasProps) {
  return <GridContainer {...p} variant="auto" />;
}
GridAutoGrid.displayName = "Grid.AutoGrid";

export function GridMasonry(p: AliasProps) {
  return <GridContainer {...p} variant="masonry" />;
}
GridMasonry.displayName = "Grid.Masonry";

export const Grid = Object.assign(GridContainer, {
  Root: GridRoot,
  Container: GridContainer,
  AutoGrid: GridAutoGrid,
  Masonry: GridMasonry,
  Item: GridItem,
  Area: GridArea,
  Stack: GridStack,
});

export { GridItem, GridArea, GridStack, useGrid };
export type { Breakpoint, ResponsiveProp, SpaceToken, SpacingToken, SpacingPreset, RenderProp };
export type {
  GridItemProps,
  GridItemState,
  GridAreaProps,
  GridAreaState,
  GridStackProps,
  GridStackState,
} from "./primitives";
