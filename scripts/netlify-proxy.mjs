import { writeFileSync } from "node:fs";
if (process.argv.includes("--static")) {
  writeFileSync("dist/portfolio/browser/api-unavailable.json", JSON.stringify({error: "The portfolio API is not configured. Please use the direct email link."}));
  writeFileSync("dist/portfolio/browser/_redirects", "/api/* /api-unavailable.json 404\n/* /index.html 200\n");
  writeFileSync("dist/portfolio/browser/_headers", "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n");
  process.exit(0);
}
const backend = process.env.CLOUD_RUN_BACKEND;
if (!backend)
  throw new Error(
    "Set CLOUD_RUN_BACKEND to the deployed HTTPS Cloud Run origin before publishing.",
  );
const url = new URL(backend);
if (
  url.protocol !== "https:" ||
  url.pathname !== "/" ||
  url.search ||
  url.hash ||
  url.username ||
  url.password
)
  throw new Error("CLOUD_RUN_BACKEND must be a bare HTTPS origin.");
writeFileSync(
  "dist/portfolio/browser/_redirects",
  `/api/* ${url.origin}/api/:splat 200\n/* /index.html 200\n`,
);
