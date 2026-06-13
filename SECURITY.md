# Security Posture — anmolbakshi.com

A static portfolio. No backend, no databases, no user input persisted, no cookies, no third-party JS.

## Threat surface (and how it's closed)

| Vector | Mitigation |
|---|---|
| **XSS** | `default-src 'none'` CSP; only same-origin scripts and inline `<script>` allowed. No third-party JS loaded. |
| **Clickjacking** | `frame-ancestors 'none'` — site cannot be embedded anywhere. |
| **MIME sniffing** | `X-Content-Type-Options: nosniff` |
| **Referrer leakage** | `strict-origin-when-cross-origin` — only origin sent on cross-site, full URL within same site. |
| **Sensor / API abuse** | Permissions Policy denies camera, mic, geolocation, payments, USB, sensors, FLoC. |
| **Mixed content** | `upgrade-insecure-requests` rewrites any stray HTTP request to HTTPS. |
| **Tab-nabbing** | All `target="_blank"` links carry `rel="noopener noreferrer"`. |
| **Form action hijack** | `form-action 'self'` — no POST can be redirected off-domain. |
| **Base URL injection** | `base-uri 'self'` — relative paths can't be rewritten. |
| **Object/applet exec** | `object-src 'none'` — Flash, Java, plugins blocked. |
| **Email scraping** | `mailto:` populated client-side from base64; no plaintext address in static HTML. |
| **AI training scrape** | `robots.txt` opt-out for GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot, anthropic-ai. |

## Allowed externals

- `fonts.googleapis.com` (style)
- `fonts.gstatic.com` (woff2)
- `youtube-nocookie.com` (one embed, frame-src locked to this host)

Everything else is blocked at the CSP layer.

## What this site does NOT do

- Set or read cookies.
- Send analytics or telemetry.
- Make XHR/fetch calls.
- Store anything in localStorage, sessionStorage, or IndexedDB.
- Load any tracker, pixel, or A/B-testing script.

## Verifying

```bash
curl -s https://anmolbakshi.com/ | grep -i 'content-security-policy'
```

Expected output: the CSP `<meta>` from `<head>`.

## Reporting

Found something? Reach out via LinkedIn (https://www.linkedin.com/in/anmolbakshi24/) — also documented in `/.well-known/security.txt`.
