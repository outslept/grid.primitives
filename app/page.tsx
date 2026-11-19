import { codeToHtml } from "shiki";
import {
  GridWorkbench,
  type ShikiMap,
  type SnippetMap,
  type TabId,
} from "../components/grid-workbench";

const TAB_IDS: readonly TabId[] = ["isolation", "columns", "areas", "autogrid", "polymorphic"];

function buildSnippet(tab: TabId, gap: string): string {
  switch (tab) {
    case "isolation":
      return `<Grid.Root onBreakpointChange={setBp}>
  <Grid templateColumns={{ base: 1, md: 3 }} gap="${gap}">
    <Grid.Item>Cell 01</Grid.Item>
    <Grid.Item>Cell 02</Grid.Item>
    <Grid.Root className="w-[320px]">
      <Grid templateColumns={{ base: 1, sm: 2, lg: 4 }} gap="space.100" />
    </Grid.Root>
  </Grid>
</Grid.Root>`;
    case "columns":
      return `<Grid templateColumns={12} gap="${gap}">
  <Grid.Item colSpan={{ base: 12, md: 8 }}>Primary (8)</Grid.Item>
  <Grid.Item colSpan={{ base: 12, md: 4 }}>Aside (4)</Grid.Item>
  <Grid.Item colSpan={{ base: 6, md: 4 }}>Metric A</Grid.Item>
  <Grid.Item colSpan={{ base: 6, md: 4 }}>Metric B</Grid.Item>
  <Grid.Item colSpan={{ base: 12, md: 4 }}>Metric C</Grid.Item>
</Grid>`;
    case "areas":
      return `<Grid
  templateColumns={{ base: '1fr', md: '180px 1fr' }}
  templateAreas={{
    base: ['nav', 'main', 'foot'],
    md: ['nav main', 'nav foot'],
  }}
  gap="${gap}"
>
  <Grid.Area name="nav">nav</Grid.Area>
  <Grid.Area name="main">main</Grid.Area>
  <Grid.Area name="foot">foot</Grid.Area>
</Grid>`;
    case "autogrid":
      return `<Grid.AutoGrid minItemWidth="170px" gap="${gap}" autoFlow="row dense">
  <Grid.Item colSpan={{ base: 1, sm: 2 }}>Wide</Grid.Item>
  <Grid.Item>Unit</Grid.Item>
</Grid.AutoGrid>`;
    case "polymorphic":
      return `<Grid.Stack>
  <Grid
    templateColumns={{ base: 1, sm: 3 }}
    gap="${gap}"
    render={<ul className="list-none p-0 m-0" />}
  >
    <Grid.Item render={(props, s) => <li {...props}>{s.breakpoint}</li>} />
  </Grid>
</Grid.Stack>`;
  }
}

let cachedPayload: { shikiMap: ShikiMap; snippets: SnippetMap } | null = null;

async function getHighlightedPayloads() {
  if (cachedPayload) return cachedPayload;

  const dark = {} as Record<TabId, string>;
  const light = {} as Record<TabId, string>;
  const snippets = {} as SnippetMap;

  await Promise.all(
    TAB_IDS.map(async (id) => {
      const raw = buildSnippet(id, "__GAP__");
      const [darkHtml, lightHtml] = await Promise.all([
        codeToHtml(raw, { lang: "tsx", theme: "github-dark-default" }),
        codeToHtml(raw, { lang: "tsx", theme: "github-light-default" }),
      ]);
      snippets[id] = raw;
      dark[id] = darkHtml;
      light[id] = lightHtml;
    }),
  );

  cachedPayload = { shikiMap: { dark, light }, snippets };
  return cachedPayload;
}

export default async function Page() {
  const { shikiMap, snippets } = await getHighlightedPayloads();
  return <GridWorkbench shikiMap={shikiMap} snippets={snippets} />;
}
