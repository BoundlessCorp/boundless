import { readFile } from "node:fs/promises";

const configUrl = new URL("../wrangler.jsonc", import.meta.url);
const raw = await readFile(configUrl, "utf8");

const errors = [];

if (raw.includes("REPLACE_WITH_")) {
  errors.push("wrangler.jsonc still contains REPLACE_WITH_* staging placeholders");
}

const finalizationEnabled =
  /"FINALIZE_RELEASE_STATE"\s*:\s*"true"/.test(raw);

if (
  finalizationEnabled &&
  process.env.BOUNDLESS_RELEASE_FINALIZATION_ACK !== "EXACT_APPROVED_DRAFT_TESTS_PASSED"
) {
  errors.push(
    "FINALIZE_RELEASE_STATE=true requires BOUNDLESS_RELEASE_FINALIZATION_ACK=EXACT_APPROVED_DRAFT_TESTS_PASSED",
  );
}

if (errors.length) {
  console.error("Boundless sync worker preflight FAILED:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Boundless sync worker preflight passed.");
console.log(
  `Release finalization: ${finalizationEnabled ? "ENABLED with explicit acknowledgement" : "disabled"}`,
);
