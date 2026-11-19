"use client";

import React, { useState } from "react";
import { cn } from "cn";
import { Grid, useGrid, type SpaceToken } from "./grid";
import type { TabId } from "./grid-workbench";
import { BlueprintButton, BlueprintCell } from "./ui/blueprint";

function ActiveRootReadout() {
  const { breakpoint } = useGrid();
  return <span className="font-mono text-[11px] font-medium text-foreground">{breakpoint}</span>;
}

export function GridDemoContent({
  tab,
  gap,
  guides,
  dense,
}: {
  tab: TabId;
  gap: SpaceToken;
  guides: boolean;
  dense: boolean;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  if (tab === "isolation") {
    return (
      <Grid templateColumns={{ base: 1, md: 3 }} gap={gap}>
        <Grid.Item>
          <BlueprintCell guides={guides} className="h-48 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">01 / Outer</span>
              <ActiveRootReadout />
            </div>
            <div>
              <div className="text-[13px] font-medium text-foreground">Stage Scope</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Resolves against the resizable outer container width.
              </p>
            </div>
          </BlueprintCell>
        </Grid.Item>
        <Grid.Item>
          <BlueprintCell guides={guides} className="h-48 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-muted-foreground">02 / Sibling</span>
              <ActiveRootReadout />
            </div>
            <div>
              <div className="text-[13px] font-medium text-foreground">Zero Window Media</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Identical component tree adapts purely to parent container bounds.
              </p>
            </div>
          </BlueprintCell>
        </Grid.Item>
        <Grid.Item>
          <BlueprintCell guides={guides} tone="nested" className="h-48 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] font-medium text-foreground">Nested Root</span>
              <span className="font-mono text-[10px] text-muted-foreground">locked 320px</span>
            </div>
            <div className="w-full max-w-[320px]">
              <Grid.Root defaultBreakpoint="base" className="bg-transparent">
                <Grid templateColumns={{ base: 1, sm: 2, lg: 4 }} gap="space.100">
                  <Grid.Item>
                    <BlueprintCell className="flex-row items-center justify-between px-2.5 py-2">
                      <span className="text-[11px] font-medium text-foreground">
                        Stacked locally
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        cols=&#123;base:1, sm:2, lg:4&#125;
                      </span>
                    </BlueprintCell>
                  </Grid.Item>
                  <Grid.Item>
                    <BlueprintCell className="flex-row items-center justify-between px-2.5 py-2">
                      <span className="text-[11px] text-muted-foreground">Scope</span>
                      <ActiveRootReadout />
                    </BlueprintCell>
                  </Grid.Item>
                </Grid>
              </Grid.Root>
            </div>
          </BlueprintCell>
        </Grid.Item>
      </Grid>
    );
  }

  if (tab === "columns") {
    return (
      <Grid templateColumns={12} gap={gap}>
        <Grid.Item colSpan={{ base: 12, md: 8 }}>
          <BlueprintCell guides={guides} className="h-28 p-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>colSpan=&#123;base: 12, md: 8&#125;</span>
              <span>8 / 12</span>
            </div>
            <div className="text-[13px] font-medium text-foreground">Primary Track</div>
          </BlueprintCell>
        </Grid.Item>
        <Grid.Item colSpan={{ base: 12, md: 4 }}>
          <BlueprintCell guides={guides} tone="nested" className="h-28 p-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>colSpan=&#123;base: 12, md: 4&#125;</span>
              <span>4 / 12</span>
            </div>
            <div className="text-[13px] font-medium text-foreground">Inspector Track</div>
          </BlueprintCell>
        </Grid.Item>
        {[0, 1, 2].map((i) => (
          <Grid.Item key={i} colSpan={{ base: i === 2 ? 12 : 6, md: 4 }}>
            <BlueprintCell guides={guides} className="h-20 p-3.5">
              <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
              <span className="font-mono text-[12px] font-medium text-foreground">
                colSpan=&#123;4&#125;
              </span>
            </BlueprintCell>
          </Grid.Item>
        ))}
      </Grid>
    );
  }

  if (tab === "areas") {
    return (
      <Grid
        templateColumns={{ base: "1fr", md: "180px 1fr" }}
        templateRows={{ base: "auto", md: "148px 56px" }}
        templateAreas={{
          base: ["nav", "main", "foot"],
          md: ["nav main", "nav foot"],
        }}
        gap={gap}
      >
        <Grid.Area name="nav">
          <BlueprintCell guides={guides} tone="nested" className="h-full p-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              area=&quot;nav&quot;
            </span>
            <span className="text-[12px] font-medium text-foreground">180px rail</span>
          </BlueprintCell>
        </Grid.Area>
        <Grid.Area name="main">
          <BlueprintCell guides={guides} className="h-full p-4">
            <span className="font-mono text-[11px] text-muted-foreground">
              area=&quot;main&quot;
            </span>
            <span className="text-[13px] font-medium text-foreground">Canvas Region (1fr)</span>
          </BlueprintCell>
        </Grid.Area>
        <Grid.Area name="foot">
          <BlueprintCell
            guides={guides}
            className="h-full flex-row items-center justify-between px-4 py-2"
          >
            <span className="font-mono text-[11px] text-muted-foreground">
              area=&quot;foot&quot;
            </span>
            <span className="font-mono text-[11px] text-foreground">status: nominal</span>
          </BlueprintCell>
        </Grid.Area>
      </Grid>
    );
  }

  if (tab === "autogrid") {
    return (
      <Grid.AutoGrid minItemWidth="170px" gap={gap} autoFlow={dense ? "row dense" : "row"}>
        {[0, 1, 2, 3, 4].map((id) => {
          const isWide = expanded === id;
          return (
            <Grid.Item
              key={id}
              colSpan={isWide ? { base: 1, sm: 2 } : 1}
              render={(props) => (
                <BlueprintButton
                  {...props}
                  variant="cell"
                  active={isWide}
                  onClick={() => setExpanded(isWide ? null : id)}
                  className={cn(
                    "h-24",
                    guides && "outline-1 outline-dashed outline-ring/40",
                    props.className,
                  )}
                >
                  <div className="flex w-full items-center justify-between font-mono text-[10px] text-muted-foreground">
                    <span>CELL_0{id + 1}</span>
                    <span>{isWide ? "span 2" : "span 1"}</span>
                  </div>
                  <div className="text-[12px] font-medium text-foreground">
                    {isWide ? "Expanded — click to shrink" : "Click to span 2 tracks"}
                  </div>
                </BlueprintButton>
              )}
            />
          );
        })}
      </Grid.AutoGrid>
    );
  }

  return (
    <Grid.Stack className="rounded-sm border border-border">
      <div
        className="h-52 w-full bg-surface/50"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="flex h-52 items-center p-4">
        <Grid
          templateColumns={{ base: 1, sm: 3 }}
          gap={gap}
          render={(props, state) => (
            <ul
              {...props}
              data-bp={state.breakpoint}
              className={cn("m-0 list-none p-0", props.className)}
            />
          )}
        >
          {["Semantic <li>", "Zero Wrapper", "State Injection"].map((title, idx) => (
            <Grid.Item
              key={title}
              render={(props, state) => (
                <li {...props} className={cn("list-none", props.className)}>
                  <BlueprintCell guides={guides} className="h-32 p-3.5">
                    <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                      <span>0{idx + 1} / &lt;li&gt;</span>
                      <span className="text-foreground">bp={state.breakpoint}</span>
                    </div>
                    <div className="text-[12px] font-medium text-foreground">{title}</div>
                  </BlueprintCell>
                </li>
              )}
            />
          ))}
        </Grid>
      </div>
    </Grid.Stack>
  );
}
