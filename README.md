# anmolbakshi.com — deployment

Static portfolio. No build step. No backend. Drop-in to GitHub Pages.

## Files

```
.
├── index.html                  # site (entry point)
├── 404.html                    # branded 404
├── CNAME                       # custom domain → anmolbakshi.com
├── robots.txt                  # SEO + AI-scraper opt-out
├── sitemap.xml
├── SECURITY.md                 # security posture documentation
├── .well-known/
│   └── security.txt            # responsible disclosure pointer
└── images/                     # all referenced media
    ├── hero-illustrated.jpg
    ├── tcs-hackquest-cert.jpg
    ├── pentathon-cert.jpg
    ├── sampda-award.jpg
    ├── secex-group-building.jpg
    ├── secex-group-stage.jpg
    └── secex-team.jpg
```

## Deployment to GitHub Pages

### One-time setup

1. Create / use a public repo: e.g. `Ella-Bakshi/anmolbakshi.com` (or any name).
2. Push every file in this folder to the repo's `main` branch.
3. **Settings → Pages**:
   - Source: `Deploy from a branch`
   - Branch: `main`, folder: `/ (root)`
   - Save
4. **Settings → Pages → Custom domain**: enter `anmolbakshi.com` → Save.
5. Wait for the DNS check, then tick **Enforce HTTPS**.

### DNS setup (at your registrar)

Apex domain → GitHub Pages IPs (A records):
```
A   @   185.199.108.153
A   @   185.199.109.153
A   @   185.199.110.153
A   @   185.199.111.153
AAAA @  2606:50c0:8000::153
AAAA @  2606:50c0:8001::153
AAAA @  2606:50c0:8002::153
AAAA @  2606:50c0:8003::153
```

`www` subdomain (CNAME):
```
CNAME  www  ella-bakshi.github.io.
```

GitHub will auto-provision a Let's Encrypt cert within ~10–60 minutes once DNS resolves.

## Updating

Just edit files locally and push. GitHub Pages redeploys on every push to `main`.

## Security posture

See `SECURITY.md` for the full breakdown. TL;DR: locked-down CSP, no third-party JS, no cookies, no analytics, email obfuscated, AI-crawler opt-out via robots.txt.
