# OSS Governance Diagnostic

A self-assessment tool for open source software governance in European SMEs. Based on MSc Practicum research at the National College of Ireland.

**Live tool:** https://mickmeagher.github.io/oss-governance-diagnostic/
_(Update this URL once you have deployed the site.)_

---

## What it does

The tool presents a seven-area maturity matrix covering:

1. Internal Ownership
2. Software Visibility
3. Policy and Decision-Making
4. Security and Maintenance
5. Legal and Licensing Awareness
6. Regulatory Readiness
7. External Collaboration and Contribution

For each area the user selects their current maturity level (1-5), records an owner, and notes the single most immediate next action. Guidance panels open automatically, surfacing plain-language explanations, a concrete next step, and curated free resources. Regulatory context (CRA, NIS2) is shown only to roles it applies to.

Results are auto-saved to the browser and can be exported as JSON, CSV, or printed to PDF (A3 landscape).

---

## Run locally

No build step is needed. Open `index.html` in any modern browser:

```
# macOS / Linux
open index.html

# Windows
start index.html
```

Because `resources.json` is fetched via `fetch()`, you need a local server if your browser blocks file:// fetch requests:

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080
```

---

## Deploy to GitHub Pages

1. Create a new **public** GitHub repository, for example `oss-governance-diagnostic`.
2. Commit all files to the default branch (`main`).
3. In the repository, go to **Settings > Pages > Build and deployment**.
4. Set **Source** to "Deploy from a branch"; **Branch** to `main`; **Folder** to `/ (root)`. Click **Save**.
5. Wait for the Pages build to finish (usually under 60 seconds). The site is published at:
   `https://<your-username>.github.io/oss-governance-diagnostic/`
6. All asset paths are relative (no leading `/`), so the site works under the repo subpath without any changes.

Optionally, add a `CNAME` file and configure a custom domain later.

A GitHub Actions workflow is also provided at `.github/workflows/pages.yml` as an alternative deploy path using `actions/deploy-pages`. The branch-source method above is the recommended default as it requires no configuration.

---

## Edit the content

### Capability areas and level descriptors

Edit **`data.js`**. Each area is an object with `id`, `name`, `risk`, and `levels` (1 through 5). The UI renders directly from this array, so changes here update all views automatically.

### Remediation guidance

Edit **`resources.json`**. Each entry maps to an area by `areaId` and contains:

| Field | Description |
|---|---|
| `understand.plain` | Plain-language explanation of why the gap matters. |
| `understand.regulatoryHook` | Optional regulatory context block (set to `null` to hide). |
| `regulatoryHook.appliesToRoles` | Array of role IDs that see this block (`"user"`, `"contributor"`, `"steward"`, `"distributor"`). |
| `regulatoryHook.boundary` | Mandatory signpost-only disclaimer line shown alongside regulatory content. |
| `act` | Object keyed `"1"` through `"5"`: the concrete artefact to produce from that level. Missing keys fall back to the nearest lower level. |
| `learn` | Array of resource objects with `title`, `type`, `cost` (`"free"` or `"paid"`), and `url`. |
| `lastReviewed` | ISO date string (`YYYY-MM-DD`) shown in the UI so staleness is visible. |

To propose an update to `resources.json` (correcting a link, updating a legislative date, adding a resource), open a pull request against that file. The schema above is the maintenance contract.

---

## Licence

[MIT](LICENSE) - Copyright (c) 2026 Mick Meagher.

---

## Attribution

Meagher, M. (2026), _Open Source Governance Capabilities for European SMEs_, MSc Practicum, National College of Ireland.
