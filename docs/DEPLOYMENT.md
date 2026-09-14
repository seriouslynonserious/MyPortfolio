# Deploy using the existing Netlify site

## 1. Cloud Run

Use an existing authorized Google Cloud project with billing and Cloud Run / Cloud Build enabled. Run from the repository root after configuring the Google Cloud CLI for that project:

```sh
gcloud run deploy shivam-portfolio-api \
  --source backend \
  --region REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 20 \
  --max-instances 1 \
  --timeout 60 \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash,CONTACT_ENABLED=false \
  --set-secrets GEMINI_API_KEY=portfolio-gemini-key:latest
```

Replace `REGION` with the chosen region. Create the named secret through Secret Manager and grant only the runtime service account access to it. Do not put raw keys in command history or the frontend. Set the model to an available Gemini model for your account. The service listens on Cloud Run's `PORT` and has `GET /api/health`.

The service is public for portfolio visitors. V1 rate limits are intentionally conservative and instance-local (12 POSTs/minute per socket peer, 60 globally). Forwarded headers are ignored because they are client-spoofable without a trusted gateway. A Netlify proxy may therefore share one peer limit across visitors. Keep max instances at one for V1; add trusted edge identity, Cloud Armor/gateway rate limits, and distributed limiting before scaling. This is a documented tradeoff, not a global Redis rate limiter.

## 2. Contact delivery

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `CONTACT_FROM`, `CONTACT_TO`, and `CONTACT_ENABLED=true`. Store `SMTP_PASSWORD` as a secret. Use a provider-verified sender and TLS-enabled SMTP. Contact messages are plain text, never rendered as HTML. The API returns success only after SMTP accepts delivery; it cannot guarantee eventual inbox placement. The honeypot, body limit, input validation, and rate limiter provide basic spam protection.

## 3. Netlify

Use the existing site for `seriosulynonserious.netlify.app`; do not create another site or change the domain. The repository includes:

- Build: `npm run build && node scripts/netlify-proxy.mjs`
- Publish: `dist/portfolio/browser`
- Node: 24
- Environment: `CLOUD_RUN_BACKEND=https://YOUR-SERVICE.run.app` (origin only)

The build writes these redirects, in order:

```text
/api/* https://YOUR-SERVICE.run.app/api/:splat 200
/* /index.html 200
```

API redirects must precede the SPA fallback. The frontend exclusively calls relative `/api/...` paths. CORS is unnecessary behind this same-origin proxy.

## 4. Release checks

1. Deploy backend and confirm its health endpoint.
2. Verify disabled/missing credentials return sanitized 503 responses.
3. Configure secrets, then verify AI streaming and email using a controlled recipient.
4. Build a Netlify deploy preview from the redesign branch. Check `/api/health` through the preview domain and confirm SSE chunks are not buffered by the proxy.
5. Review desktop/mobile, keyboard access, reduced motion, and project links.
6. Confirm the owner-supplied metrics and employment dates.
7. Merge only after reviewing the preview; production deployment then keeps the original domain. Retain the prior Netlify deployment for rollback.

No live AI provider or SMTP message was invoked during local verification. Cloud project, credentials, service region, and Netlify settings must be provided/configured before these external checks can pass.
