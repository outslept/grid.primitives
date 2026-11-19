"use client";

import React from "react";
import { cn } from "cn";

export const EASE = "ease-[cubic-bezier(0.23,1,0.32,1)]";

export const INTERACTIVE = cn(
  "select-none outline-none transition-[transform,opacity,background-color,border-color,color] duration-150",
  EASE,
  "active:scale-[0.97] motion-reduce:transition-opacity motion-reduce:active:scale-100",
  "focus-visible:ring-1 focus-visible:ring-ring",
);

export function Crosshair({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-20 font-mono text-[11px] leading-none text-muted-foreground/60 select-none",
        className,
      )}
    >
      +
    </span>
  );
}

export function BlueprintFrame({
  children,
  className,
  crosshairs = true,
}: {
  children: React.ReactNode;
  className?: string;
  crosshairs?: boolean;
}) {
  return (
    <div className={cn("relative border border-border bg-background", className)}>
      {crosshairs && (
        <>
          <Crosshair className="-top-[6px] -left-[4px]" />
          <Crosshair className="-top-[6px] -right-[4px]" />
          <Crosshair className="-bottom-[6px] -left-[4px]" />
          <Crosshair className="-bottom-[6px] -right-[4px]" />
        </>
      )}
      {children}
    </div>
  );
}

export function BlueprintCell({
  children,
  className,
  guides,
  tone = "card",
}: {
  children: React.ReactNode;
  className?: string;
  guides?: boolean;
  tone?: "card" | "nested";
}) {
  return (
    <div
      className={cn(
        "relative box-border flex flex-col justify-between rounded-sm border text-card-foreground",
        tone === "card"
          ? "border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          : "border-border bg-muted/50",
        guides && "outline-1 outline-dashed outline-ring/40",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BlueprintButton({
  active,
  children,
  className,
  variant = "pill",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: React.Ref<HTMLButtonElement>;
  active?: boolean;
  variant?: "tab" | "pill" | "cell";
}) {
  return (
    <button
      type="button"
      className={cn(
        INTERACTIVE,
        variant === "tab" && [
          "relative flex items-center justify-between border-r border-border px-3.5 py-2.5 text-left text-[12px] last:border-r-0",
          active
            ? "bg-card font-medium text-foreground"
            : "bg-surface text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:bg-accent/60 [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
        ],
        variant === "pill" && [
          "rounded-sm border px-2 py-0.5 font-mono text-[11px]",
          active
            ? "border-foreground bg-foreground text-background font-medium"
            : "border-border bg-card text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:border-ring [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground",
        ],
        variant === "cell" && [
          "box-border flex flex-col justify-between rounded-sm border p-3.5 text-left",
          active
            ? "border-foreground bg-accent text-foreground"
            : "border-border bg-card text-card-foreground [@media(hover:hover)_and_(pointer:fine)]:hover:border-ring",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TelemetryCell({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-1.5 font-mono text-[11px]",
        active ? "bg-card text-foreground" : "bg-surface text-muted-foreground",
      )}
    >
      <span>{label}</span>
      <span className={cn(active ? "font-medium text-foreground" : "text-muted-foreground/70")}>
        {value}px
      </span>
    </div>
  );
}
