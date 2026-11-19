"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "cn";
import { Grid, type Breakpoint, type SpaceToken } from "./grid";
import { GridDemoContent } from "./grid-demos";
import { BlueprintButton, BlueprintFrame, EASE, TelemetryCell } from "./ui/blueprint";
import { CodeBlock } from "./ui/code-block";
import { ResizableStage } from "./ui/resizable-stage";

export type TabId = "isolation" | "columns" | "areas" | "autogrid" | "polymorphic";
export type SnippetMap = Record<TabId, string>;
export type ShikiMap = Record<"dark" | "light", SnippetMap>;

const SPACE_TOKENS: SpaceToken[] = [
  "space.0",
  "space.100",
  "space.150",
  "space.200",
  "space.300",
  "space.400",
  "space.600",
];

const BP_THRESHOLDS: { bp: Breakpoint; px: number }[] = [
  { bp: "base", px: 0 },
  { bp: "sm", px: 640 },
  { bp: "md", px: 768 },
  { bp: "lg", px: 1024 },
  { bp: "xl", px: 1280 },
];

const TABS: { id: TabId; index: string; label: string; meta: string }[] = [
  { id: "isolation", index: "01", label: "Nested Isolation", meta: "@container" },
  { id: "columns", index: "02", label: "12-Col Span", meta: "templateColumns" },
  { id: "areas", index: "03", label: "Template Areas", meta: "templateAreas" },
  { id: "autogrid", index: "04", label: "AutoGrid + Dense", meta: "auto-fit" },
  { id: "polymorphic", index: "05", label: "Stack & Render", meta: "render={(p,s)}" },
];

export function GridWorkbench({
  shikiMap,
  snippets,
}: {
  shikiMap: ShikiMap;
  snippets: SnippetMap;
}) {
  const [tab, setTab] = useState<TabId>("isolation");
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const [gap, setGap] = useState<SpaceToken>("space.200");
  const [bp, setBp] = useState<Breakpoint>("lg");
  const [widthPx, setWidthPx] = useState(1032);
  const [guides, setGuides] = useState(false);
  const [dense, setDense] = useState(true);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const selectTab = useCallback((next: TabId, kb: boolean) => {
    setViaKeyboard(kb);
    setTab(next);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const idx = TABS.findIndex((t) => t.id === tab);
      if (e.key === "ArrowRight") selectTab(TABS[(idx + 1) % TABS.length].id, true);
      else if (e.key === "ArrowLeft")
        selectTab(TABS[(idx - 1 + TABS.length) % TABS.length].id, true);
      else if (e.key >= "1" && e.key <= "5") selectTab(TABS[Number(e.key) - 1].id, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tab, selectTab]);

  const code = snippets[tab].replace("__GAP__", gap);
  const html = shikiMap[dark ? "dark" : "light"][tab].replace("__GAP__", gap);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-[1120px] px-4 py-8 md:px-8">
        <BlueprintFrame>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2.5">
            <div className="flex items-center gap-2.5 font-mono text-[12px]">
              <span className="inline-block h-2 w-2 rounded-full bg-foreground" />
              <span className="font-semibold tracking-tight text-foreground">grid.primitives</span>
              <span className="text-muted-foreground">v2.4</span>
            </div>
            <div className="flex items-center gap-1.5">
              {tab === "autogrid" && (
                <BlueprintButton active={dense} onClick={() => setDense((d) => !d)}>
                  dense:{dense ? "on" : "off"}
                </BlueprintButton>
              )}
              <BlueprintButton active={guides} onClick={() => setGuides((g) => !g)}>
                guides:{guides ? "on" : "off"}
              </BlueprintButton>
              <BlueprintButton active={dark} onClick={() => setDark((d) => !d)}>
                {dark ? "dark" : "light"}
              </BlueprintButton>
              <span className="ml-1 rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-foreground">
                {bp} · {widthPx}px
              </span>
            </div>
          </header>

          <nav
            className="grid grid-cols-2 border-b border-border sm:grid-cols-5"
            aria-label="Demos"
          >
            {TABS.map((t) => (
              <BlueprintButton
                key={t.id}
                variant="tab"
                active={tab === t.id}
                onClick={() => selectTab(t.id, false)}
              >
                <span className="truncate">
                  <span className="mr-1.5 font-mono text-[10px] text-muted-foreground">
                    {t.index}
                  </span>
                  {t.label}
                </span>
                <span className="hidden font-mono text-[10px] text-muted-foreground lg:inline">
                  {t.meta}
                </span>
              </BlueprintButton>
            ))}
          </nav>

          <div className="grid grid-cols-5 divide-x divide-border border-b border-border">
            {BP_THRESHOLDS.map((item) => (
              <TelemetryCell
                key={item.bp}
                label={`@${item.bp}`}
                value={String(item.px)}
                active={bp === item.bp}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2">
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-2 font-mono text-[11px] text-muted-foreground">gap</span>
              {SPACE_TOKENS.map((t) => (
                <BlueprintButton key={t} active={gap === t} onClick={() => setGap(t)}>
                  {t}
                </BlueprintButton>
              ))}
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              drag right edge · double-click reset
            </span>
          </div>

          <ResizableStage guides={guides} onWidthChange={setWidthPx}>
            <Grid.Root defaultBreakpoint="lg" onBreakpointChange={setBp} className="bg-transparent">
              <div
                key={tab}
                className={cn(
                  !viaKeyboard &&
                    `animate-in fade-in zoom-in-95 duration-150 ${EASE} motion-reduce:zoom-in-100`,
                )}
              >
                <GridDemoContent tab={tab} gap={gap} guides={guides} dense={dense} />
              </div>
            </Grid.Root>
          </ResizableStage>

          <CodeBlock code={code} html={html} bp={bp} />
        </BlueprintFrame>
      </div>
    </div>
  );
}
