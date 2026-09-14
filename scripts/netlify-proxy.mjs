import { writeFileSync } from "node:fs";
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
