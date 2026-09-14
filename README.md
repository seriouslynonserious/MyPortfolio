# SHIVAM.DEV SYSTEM

An Angular 21 portfolio and interactive engineering lab, rebuilt from the original MyPortfolio repository. Spring Boot 3 provides a portfolio-grounded Gemini assistant and email contact delivery. The existing Netlify domain is retained in canonical metadata and deployment configuration.

## Run locally

Requirements: Node 24, Java 17+, Maven 3.9+.

```sh
npm ci
npm start
mvn -f backend/pom.xml spring-boot:run
```

Open http://127.0.0.1:4200. The Angular development proxy forwards `/api/*` to port 8080. Portfolio content and simulations work with no backend or credentials. AI and contact explicitly report unavailable until configured.

```sh
npm run build
npm run preview # serves the production build on port 4300
npm test
mvn -f backend/pom.xml verify
```

The Angular CLI disk cache is disabled because its native LMDB binding crashed on this macOS environment; it is safe to enable on a compatible machine. Original Angular 8 sources, assets, and dependency manifests are retained in `legacy/` for reference; they are not built or served. The old Firebase admin editor is intentionally outside the new static V1 architecture.

## Organization

- `src/app/core`: source content and simulation state
- `src/app/scene`: deferred Three.js rendering and resource lifecycle
- `src/app/playground`: request, outage, latency, page performance, and order tracing simulations
- `src/app/assistant`: POST SSE consumer, cancellation, and unavailable state
- `backend`: stateless Spring Boot service with validated DTOs, bounded request bodies, rate limits, timeouts, grounded AI, and SMTP delivery
- `docs/content-snapshot.json`: read-only snapshot of the original public Firestore portfolio content
- `docs/DEPLOYMENT.md`: Cloud Run and existing Netlify site setup
- `docs/VERIFICATION.md`: checks and operational limits

## Content and claims

Existing Onelap and Tech Mahindra employment descriptions, GMC Charity Wings, Onelap projects, email, and Google Drive resume link were preserved. No private project repository or unverified project demo URL was invented. GMC links to the owner's GitHub profile because its source did not supply a specific repository URL.

Metrics of 21% conversion improvement and 32% page-load improvement appear in the original live content. The additional 100K+ users, 66% latency reduction, and 25% organic traffic growth come from the owner's redesign brief. The existing Onelap project describes a separate near-5s to near-1s API improvement; this must not be conflated with the brief's 66% figure. Confirm the intended measurement window before publishing. Employment dates preserve the source's “Jan 2025 – Present”; update if that status changes.

All engineering lab request volumes, timings, outages, database loads, and fixes are illustrative. They do not call or stress backend infrastructure. Project artwork depicts workflows and is labeled as an illustration, not a screenshot of a production dashboard. Redis and MySQL in the playground are conceptual nodes, not actual V1 dependencies.

## Controls

Drag the architecture to rotate; click a node or an HTML technology button to inspect. Double click focuses the camera. Shift-drag Redis to detach the cache. Play mode enables controlled zoom, WASD movement, Space request playback, R reset, and Escape exit. Normal page scrolling remains available outside play mode. The command palette supports Cmd/Ctrl+K, arrow keys, Tab, Enter, and Escape. `/terminal` opens the optional shell.

Recruiter mode prioritizes experience and hides the playground. Reduced motion uses the OS preference and a visible toggle. WebGL failure preserves an HTML architecture fallback and technology controls.

## Deployment status

This source is prepared for deployment, but no live replacement happens automatically. Set backend secrets in Google Secret Manager / Cloud Run, deploy the service, then set `CLOUD_RUN_BACKEND` in the existing Netlify site. The proxy build deliberately refuses missing or invalid origins. Never place an API key in Angular, a Netlify public asset, or this repository.
