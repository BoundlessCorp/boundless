import { readFile } from "node:fs/promises";

const configName = process.env.BOUNDLESS_WRANGLER_CONFIG || "wrangler.staging.jsonc";
const configUrl = new URL(`../${configName}`, import.meta.url);
const raw = await readFile(configUrl, "utf8");

const errors = [];

if (raw.includes("REPLACE_WITH_")) {
  errors.push(`${configName} still contains REPLACE_WITH_* placeholders`);
}

if (configName.includes("staging") && !/"name"\s*:\s*"[^"]*staging[^"]*"/.test(raw)) {
  errors.push("Staging preflight requires a Worker name containing 'staging'");
}

if (configName.includes("staging") && /"FINALIZE_RELEASE_STATE"\s*:\s*"true"/.test(raw)) {
  errors.push("Staging configuration must begin with FINALIZE_RELEASE_STATE=false");
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

console.log(`Boundless sync worker preflight passed for ${configName}.`);
console.log(
  `Release finalization: ${finalizationEnabled ? "ENABLED with explicit acknowledgement" : "disabled"}`,
);
