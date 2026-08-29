const fs = require("fs");

let demoCode = fs.readFileSync("agent/demo-responses.ts", "utf8")
  .replace(/export type [^\n]+;/g, "")
  .replace(/export interface [\s\S]*?\n\}/g, "")
  .replace(/type [^\n]+;/g, "")
  .replace(/interface [\s\S]*?\n\}/g, "")
  .replace(/:\s*Record<string,\s*LynchResponse>/g, "")
  .replace(/:\s*LynchSignal/g, "")
  .replace(/:\s*LynchRisk/g, "")
  .replace(/:\s*LynchResponse/g, "")
  .replace(/:\s*string\[\]/g, "")
  .replace(/:\s*string/g, "")
  .replace(/:\s*number/g, "")
  .replace(/:\s*boolean/g, "")
  .replace(/export /g, "");

let aiCode = fs.readFileSync("agent/ai.ts", "utf8")
  .replace(/import [^\n]+;/g, "")
  .replace(/export interface [\s\S]*?\n\}/g, "")
  .replace(/interface [\s\S]*?\n\}/g, "")
  .replace(/:\s*Array<\{ intent: string; keywords: string\[\] \}>/g, "")
  .replace(/:\s*ConversationContext/g, "")
  .replace(/:\s*LynchAgentResult/g, "")
  .replace(/:\s*string\[\]/g, "")
  .replace(/:\s*string\s*\|\s*null/g, "")
  .replace(/:\s*string/g, "")
  .replace(/:\s*number/g, "")
  .replace(/:\s*boolean/g, "")
  .replace(/export /g, "");

let eventsCode = fs.readFileSync("agent/events.ts", "utf8")
  .replace(/import [^\n]+;/g, "")
  .replace(/export interface [\s\S]*?\n\}/g, "")
  .replace(/interface [\s\S]*?\n\}/g, "")
  .replace(/:\s*ActivityItem\[\]/g, "")
  .replace(/:\s*ActivityItem/g, "")
  .replace(/:\s*EmitEventParams/g, "")
  .replace(/:\s*string/g, "")
  .replace(/export /g, "");

eval("const DEMO_ACTIVITY = [];\n" + eventsCode + "\n" + demoCode + "\n" + aiCode + "\n" + `
const tests = [
  { id: 1, query: "Hello", expectedIntent: "greeting" },
  { id: 2, query: "What is LYNCH?", expectedIntent: "what_is_lynch" },
  { id: 3, query: "Show me my portfolio", expectedIntent: "portfolio_analysis" },
  { id: 4, query: "How is my portfolio doing?", expectedIntent: "portfolio_analysis" },
  { id: 5, query: "What stocks look interesting?", expectedIntent: "investment_ideas" },
  { id: 6, query: "Give me some investment ideas", expectedIntent: "investment_ideas" },
  { id: 7, query: "Tell me about TCS", expectedIntent: "tcs" },
  { id: 8, query: "What are the risks?", expectedIntent: "general_risks" },
  { id: 9, query: "What is the weather today?", expectedIntent: "out_of_scope" }
];

const ctx = {};

tests.forEach(t => {
  const res = getLynchResponse(t.query, ctx);
  Object.assign(ctx, { lastIntent: res.resolvedIntent, lastSubject: res.resolvedSubject });
  const isPass = res.resolvedIntent === t.expectedIntent;
  console.log(\`Test \${t.id}: "\${t.query}"\`);
  console.log(\`  Detected Intent: \${res.resolvedIntent} (Expected: \${t.expectedIntent})\`);
  console.log(\`  Response Type: \${res.response.ideasBlock ? "ideasBlock" : res.response.analysis ? "analysisCard" : "proseText"}\`);
  console.log(\`  Message Preview: \${res.response.message.replace(/\\n/g, ' ').slice(0, 100)}...\`);
  console.log(\`  Result: \${isPass ? "PASS" : "FAIL"}\n\`);
});
`);
