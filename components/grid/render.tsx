"use client";

import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode } from "react";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { type Breakpoint, pickBp } from "./breakpoints";
import { cn } from "cn";
import type { SpacingPreset } from "./styles";

export type RenderMergedProps = HTMLAttributes<HTMLElement> & {
  ref?: React.RefCallback<HTMLElement>;
};

export type RenderProp<State> =
  | ReactElement<Record<string, unknown>>
  | ((props: RenderMergedProps, state: State) => ReactNode);

export function setRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && typeof ref === "object" && "current" in ref) {
    (ref as React.MutableRefObject<T | null>).current = value;
  }
}

function toRefCallback<T>(ref: React.Ref<T> | undefined): React.RefCallback<T> | undefined {
  if (!ref) return undefined;
  return (node: T | null) => setRef(ref, node);
}

function mergeRefs<T>(
  a: React.Ref<T> | undefined,
  b: React.Ref<T> | undefined,
): React.RefCallback<T> | undefined {
  if (!a) return toRefCallback(b);
  if (!b) return toRefCallback(a);
  return (node: T | null) => {
    setRef(a, node);
    setRef(b, node);
  };
}

export function renderElement<State>(
  render: RenderProp<State> | undefined,
  state: State,
  ownProps: Record<string, unknown> & {
    className?: string;
    style?: CSSProperties;
    ref?: React.Ref<HTMLElement>;
    children?: ReactNode;
  },
): ReactElement {
  const { ref, ...restOwn } = ownProps;
  const callbackRef = toRefCallback(ref);

  if (typeof render === "function") {
    return render(
      { ...(restOwn as HTMLAttributes<HTMLElement>), ref: callbackRef },
      state,
    ) as ReactElement;
  }
  if (render && React.isValidElement<Record<string, unknown>>(render)) {
    const elProps = render.props;
    const childRef = (render as unknown as { ref?: React.Ref<HTMLElement> }).ref;
    const mergedStyle =
      ownProps.style || elProps.style
        ? { ...(ownProps.style as CSSProperties), ...(elProps.style as CSSProperties) }
        : undefined;
    return React.cloneElement(render, {
      ...restOwn,
      ...elProps,
      className: cn(ownProps.className, elProps.className as string | undefined),
      style: mergedStyle,
      ref: mergeRefs(ref, childRef),
      children: (elProps.children ?? ownProps.children) as ReactNode,
    });
  }
  return <div {...(restOwn as HTMLAttributes<HTMLDivElement>)} ref={callbackRef} />;
}

export function useBreakpointObserver(
  enabled: boolean,
  externalRef: React.Ref<HTMLElement> | undefined,
  onBreakpointChange?: (bp: Breakpoint) => void,
  defaultBreakpoint: Breakpoint = "base",
) {
  const internalRef = useRef<HTMLElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [bp, setBp] = useState<Breakpoint>(defaultBreakpoint);

  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      setRef(externalRef, node);
      internalRef.current = node;
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (enabled && node && typeof ResizeObserver !== "undefined") {
        const update = (w: number) => {
          if (w <= 0) return;
          const next = pickBp(w);
          setBp((prev) => (prev !== next ? next : prev));
        };
        update(node.getBoundingClientRect().width);
        const ro = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry) update(entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width);
        });
        ro.observe(node);
        roRef.current = ro;
      }
    },
    [enabled, externalRef],
  );

  useEffect(() => () => roRef.current?.disconnect(), []);
  useEffect(() => {
    if (enabled) onBreakpointChange?.(bp);
  }, [enabled, bp, onBreakpointChange]);

  return { bp, internalRef, handleRef };
}

export interface GridContextValue {
  bp: Breakpoint;
  breakpoint: Breakpoint;
  space: SpacingPreset;
  spacing: SpacingPreset;
  rootRef: React.MutableRefObject<HTMLElement | null>;
}

export const GridContext = createContext<GridContextValue | null>(null);

const DEFAULT_CTX: GridContextValue = {
  bp: "base",
  breakpoint: "base",
  space: "space.200",
  spacing: "space.200",
  rootRef: { current: null },
};

export function useGrid(): GridContextValue {
  return useContext(GridContext) ?? DEFAULT_CTX;
}
