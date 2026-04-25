import fs from "node:fs";

const structure = fs.readFileSync(new URL("../structure.ts", import.meta.url), "utf8");

for (const needle of [
  "const isGeneratorDeskEnabled",
  '(context?.dataset ?? process.env.SANITY_STUDIO_DATASET ?? "production") === "development"',
  '.title("Generator")',
  'type: "generatorProgram"',
  'type: "generatorTemplate"',
  'type: "generatorDataset"',
]) {
  if (!structure.includes(needle)) {
    console.error(`Missing structure contract: ${needle}`);
    process.exit(1);
  }
}

console.log("Generator structure contract present");
