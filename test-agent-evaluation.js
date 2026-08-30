const fs = require("fs");

function stripImportsAndTypes(content) {
  return content
    .replace(/^import\s+[^;]+;\r?\n/gm, "")
    .replace(/import\s*\{[^}]*\}\s*from\s*['"][^'"]+['"];?/g, "")
    .replace(/export\s+type\s+[^;]+;/g, "")
    .replace(/export\s+interface\s+[\s\S]*?\n\}/g, "")
    .replace(/interface\s+[\s\S]*?\n\}/g, "")
    .replace(/as\s+[A-Za-z0-9_]+/g, "")
    .replace(/let\s+([a-zA-Z0-9_]+)\s*:\s*[^=;]+=/g, "let $1 =")
    .replace(/const\s+([a-zA-Z0-9_]+)\s*:\s*Array<[^>]+>\s*=/g, "const $1 =")
    .replace(/const\s+([a-zA-Z0-9_]+)\s*:\s*[^=;]+=/g, "const $1 =")
    .replace(/:\s*Record<[^>]+>/g, "")
    .replace(/:\s*StockResearchProfile\s*\|\s*null/g, "")
    .replace(/:\s*StockComparisonResult\s*\|\s*null/g, "")
    .replace(/:\s*PortfolioContextAnalysis\s*\|\s*null/g, "")
    .replace(/:\s*SectorResearchSummary\[\]/g, "")
    .replace(/:\s*LynchResponse/g, "")
    .replace(/:\s*LynchSignal/g, "")
    .replace(/:\s*LynchRisk/g, "")
    .replace(/:\s*ConversationContext/g, "")
    .replace(/:\s*LynchAgentResult/g, "")
    .replace(/:\s*string\[\]/g, "")
    .replace(/:\s*string\s*\|\s*null/g, "")
    .replace(/:\s*string/g, "")
    .replace(/:\s*number/g, "")
    .replace(/:\s*boolean/g, "")
    .replace(/export /g, "");
}

let researchCode = stripImportsAndTypes(fs.readFileSync("agent/research-data.ts", "utf8"));
let engineCode = stripImportsAndTypes(fs.readFileSync("agent/analysis-engine.ts", "utf8"));
let demoCode = stripImportsAndTypes(fs.readFileSync("agent/demo-responses.ts", "utf8"));
let aiCode = stripImportsAndTypes(fs.readFileSync("agent/ai.ts", "utf8"));

eval("const DEMO_ACTIVITY = []; const emitAgentEvent = () => {}; const getStoredActivities = () => []; const saveStoredActivities = () => {};\n" + researchCode + "\n" + engineCode + "\n" + demoCode + "\n" + aiCode + "\n" + `
const tests = [
  { id: 1, query: "Hello", expectedIntent: "greeting" },
  { id: 2, query: "What is LYNCH?", expectedIntent: "what_is_lynch" },
  { id: 3, query: "Show me my portfolio", expectedIntent: "portfolio_analysis" },
  { id: 4, query: "How is my portfolio doing?", expectedIntent: "portfolio_analysis" },
  { id: 5, query: "What stocks look interesting?", expectedIntent: "investment_ideas" },
  { id: 6, query: "Give me some investment ideas", expectedIntent: "investment_ideas" },
  { id: 7, query: "Tell me about TCS", expectedIntent: "tcs" },
  { id: 8, query: "What are the risks?", expectedIntent: "general_risks" },
  { id: 9, query: "What is the weather today?", expectedIntent: "out_of_scope" },
  { id: 10, query: "Compare TCS and INFY", expectedIntent: "compare_tcs_vs_infy" },
  { id: 11, query: "Which sectors look interesting?", expectedIntent: "sector_research" },
  { id: 12, query: "How does TCS affect my portfolio?", expectedIntent: "portfolio_context_tcs" }
];

const ctx = {};

tests.forEach(t => {
  const res = getLynchResponse(t.query, ctx);
  Object.assign(ctx, { lastIntent: res.resolvedIntent, lastSubject: res.resolvedSubject });
  const isPass = res.resolvedIntent === t.expectedIntent;
  console.log(\`Test \${t.id}: "\${t.query}"\`);
  console.log(\`  Detected Intent: \${res.resolvedIntent} (Expected: \${t.expectedIntent})\`);
  console.log(\`  Response Message: \${res.response.message.slice(0, 80)}...\`);
  console.log(\`  Result: \${isPass ? "PASS" : "FAIL"}\n\`);
});
`);
