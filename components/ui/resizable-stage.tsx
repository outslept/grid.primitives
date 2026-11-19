"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "cn";
import { EASE } from "./blueprint";

export function clampWidth(w: number, min: number, max: number): number {
  return w < min ? min : w > max ? max : w;
}

export function ResizableStage({
  children,
  guides,
  onWidthChange,
}: {
  children: React.ReactNode;
  guides?: boolean;
  onWidthChange: (w: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWRef = useRef(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        const w = Math.round(entries[i].contentRect.width);
        if (w > 0) onWidthChange(w);
      }
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, [onWidthChange]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startWRef.current = stage.getBoundingClientRect().width;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      const next = clampWidth(
        startWRef.current + (e.clientX - startXRef.current),
        280,
        track.clientWidth,
      );
      stage.style.width = `${next}px`;
      onWidthChange(Math.round(next));
    },
    [onWidthChange],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const onDoubleClick = useCallback(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    stage.style.width = "100%";
    onWidthChange(Math.round(track.clientWidth));
  }, [onWidthChange]);

  return (
    <div
      ref={trackRef}
      className="relative h-[310px] w-full overflow-hidden bg-surface/60"
      style={{
        backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div
        ref={stageRef}
        style={{ width: "100%" }}
        className={cn(
          "relative h-[310px] max-w-full overflow-hidden border-r border-border bg-background p-5 pr-7",
          guides &&
            "bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px)] bg-[size:64px_100%]",
        )}
      >
        {children}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize container stage (double-click to reset)"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          className="group absolute top-0 right-0 bottom-0 z-10 flex w-4 cursor-ew-resize touch-none items-center justify-center border-l border-border bg-surface/80 select-none"
        >
          <span
            className={cn(
              "h-8 w-[2px] rounded-full bg-muted-foreground/50 transition-[transform,opacity,background-color] duration-150",
              EASE,
              "[@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-y-125 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-foreground",
              "group-active:scale-x-150 group-active:bg-foreground motion-reduce:transition-opacity",
            )}
          />
        </div>
      </div>
    </div>
  );
}
