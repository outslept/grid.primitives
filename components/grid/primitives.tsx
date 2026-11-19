"use client";

import type { CSSProperties, ReactNode } from "react";
import React, { Children, useMemo } from "react";
import type { Breakpoint, ResponsiveProp } from "./breakpoints";
import { cn } from "cn";
import { type GridPlacement, type GridSelfAlignment, itemStyle } from "./styles";
import s from "./grid.module.css";
import { type RenderProp, renderElement, useGrid } from "./render";

export interface GridItemState {
  breakpoint: Breakpoint;
  interactive: boolean;
}

export interface GridItemProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  ref?: React.Ref<HTMLElement>;
  render?: RenderProp<GridItemState>;
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
  interactive?: boolean;
  animate?: "fadeIn" | "slideUp" | "scaleIn";
  testId?: string;
  children?: ReactNode;
}

export function GridItem({
  ref,
  render,
  column,
  row,
  columnStart,
  columnEnd,
  rowStart,
  rowEnd,
  area,
  order,
  justifySelf,
  alignSelf,
  colSpan,
  span,
  rowSpan,
  aspectRatio,
  interactive = false,
  animate,
  testId,
  className,
  style,
  children,
  ...domProps
}: GridItemProps) {
  const { bp } = useGrid();
  const st = useMemo(
    () =>
      itemStyle(
        {
          column,
          row,
          columnStart,
          columnEnd,
          rowStart,
          rowEnd,
          area,
          order,
          justifySelf,
          alignSelf,
          colSpan,
          span,
          rowSpan,
          aspectRatio,
          style,
        },
        bp,
      ),
    [
      column,
      row,
      columnStart,
      columnEnd,
      rowStart,
      rowEnd,
      area,
      order,
      justifySelf,
      alignSelf,
      colSpan,
      span,
      rowSpan,
      aspectRatio,
      style,
      bp,
    ],
  );
  const state = useMemo<GridItemState>(() => ({ breakpoint: bp, interactive }), [bp, interactive]);

  return renderElement(render, state, {
    ...domProps,
    ref,
    className: cn("relative", interactive && s.interactive, animate && s[animate], className),
    style: st,
    "data-slot": "grid-item",
    "data-grid-item": "",
    "data-interactive": interactive ? "" : undefined,
    "data-testid": testId,
    children,
  });
}
GridItem.displayName = "Grid.Item";

export interface GridAreaState {
  breakpoint: Breakpoint;
  name: string;
}

export interface GridAreaProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  ref?: React.Ref<HTMLElement>;
  render?: RenderProp<GridAreaState>;
  name: string;
  testId?: string;
  children?: ReactNode;
}

export function GridArea({
  ref,
  render,
  name,
  testId,
  className,
  style,
  children,
  ...domProps
}: GridAreaProps) {
  const { bp } = useGrid();
  const st = useMemo((): CSSProperties => ({ gridArea: name, ...style }), [name, style]);
  const state = useMemo<GridAreaState>(() => ({ breakpoint: bp, name }), [bp, name]);

  return renderElement(render, state, {
    ...domProps,
    ref,
    className: cn("relative", className),
    style: st,
    "data-slot": "grid-area",
    "data-grid-area": name,
    "data-testid": testId,
    children,
  });
}
GridArea.displayName = "Grid.Area";

export interface GridStackState {
  breakpoint: Breakpoint;
}

export interface GridStackProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  ref?: React.Ref<HTMLElement>;
  render?: RenderProp<GridStackState>;
  testId?: string;
  children?: ReactNode;
}

const STACK_ITEM_STYLE: CSSProperties = { gridArea: "1 / 1" };

export function GridStack({
  ref,
  render,
  testId,
  className,
  style,
  children,
  ...domProps
}: GridStackProps) {
  const { bp } = useGrid();
  const st = useMemo((): CSSProperties => ({ display: "grid", ...style }), [style]);
  const state = useMemo<GridStackState>(() => ({ breakpoint: bp }), [bp]);
  const stackedChildren = Children.map(children, (n, i) => (
    <div
      key={i}
      className="relative"
      style={STACK_ITEM_STYLE}
      data-slot="grid-stack-item"
      data-grid-stack-item=""
    >
      {n}
    </div>
  ));

  return renderElement(render, state, {
    ...domProps,
    ref,
    className: cn("grid relative", className),
    style: st,
    "data-slot": "grid-stack",
    "data-grid-stack": "",
    "data-testid": testId,
    children: stackedChildren,
  });
}
GridStack.displayName = "Grid.Stack";
