# Verification and limits

## Verified locally

- Angular 21 strict TypeScript/template compilation and optimized production build.
- Initial production JS/CSS bundle transfer estimate ~66 KB (fonts are additional); Three.js is a separate deferred payload (~150 KB compressed plus controls).
- npm dependency audit: zero vulnerabilities at install time.
- Four Node tests, including preview recovery across rebuilds: unset backend refusal, HTTPS origin validation, API-before-SPA rewrite ordering.
- Eight Java tests: health, validation, unconfigured AI/contact errors, honeypot rejection, body bound, rate limiting, and spoofed forwarding-header behavior.
- Browser: live Three.js rendering, HTML node inspection, play mode, Redis offline/overload, three-stage repair back to 28%, and database optimization from 4.2s to 180ms.
- Production browser console: no runtime errors observed.
- Mobile viewport 390 × 844: no horizontal overflow; hero and project/experience layout visually inspected.

## Deliberate V1 limits

- No actual Redis, database, CMS, analytics, or public admin route. Original source and content snapshot are preserved in the repo.
- The graph illustrates application concepts; it is not live infrastructure monitoring. API flows, performance optimization, and incident response are deterministic frontend exercises.
- Core portfolio content is semantic HTML after Angular bootstrap. A no-JavaScript profile summary and structured metadata are included; full server-side rendering/prerendering and route-level case-study pages are not implemented.
- The hero has the primary 3D system, with a separate accessible 2D request-path inspector. ScrollTrigger reveals page sections; the optional freeform architecture builder is not implemented.
- No live Gemini, SMTP, Netlify proxy, or Cloud Run verification without external credentials. POST SSE parsing, cancellation, and error states are implemented, but actual provider/proxy streaming needs a deployment test.
- No Lighthouse score is claimed. Measure the deployed site, including real font/network latency, before treating it as a production performance baseline.
- Rate limiting is bounded in memory on each instance, with limitations documented in DEPLOYMENT.md.
