# Contributing

Thanks for considering a contribution. This project is small and deliberately boring in its technology choices, which is what makes it easy to help with.

## The short version

- **Fix a link or update a resource**: edit `resources.json`, update the `lastReviewed` date on the entry you touched, open a PR. This is the most valuable routine contribution.
- **Report an accuracy problem**: open an issue, link the primary source (EUR-Lex, the Commission, the standard body itself), and quote the sentence you believe is wrong.
- **Improve the tool**: open an issue first for anything beyond a small fix, so we can agree it fits the constraints below.

## Constraints (non-negotiable)

These keep the tool trustworthy, maintainable, and free to host:

1. **Static only.** Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no bundlers.
2. **No external calls at runtime.** No analytics, no trackers, no remote fonts, no CDNs. The tool must work offline.
3. **Privacy by architecture.** State lives in `localStorage` only. No cookies, no accounts, nothing leaves the browser.
4. **Signpost, never determine.** The tool may say a gap has a regulatory dimension and point to explainers. It must never tell a user whether a specific legal obligation applies to them. Any contribution that crosses that line will be declined regardless of accuracy.
5. **Accessibility.** WCAG 2.1 AA. Keyboard navigable, visible focus, sufficient contrast, `prefers-reduced-motion` and `prefers-color-scheme` respected.
6. **UK English** in all visible copy, EUR for any currency, and no em dashes.

## Editing the data files

**`data.js`** contains the seven capability areas and five maturity level descriptors. These are the assessed instrument from the underlying dissertation (Appendix A, v2.2) and are intentionally stable. Wording changes here need an issue and a good argument, not just a PR.

**`resources.json`** is the community-maintained remediation map. Each area entry has:

| Field | What it is |
| --- | --- |
| `areaId`, `area` | Which capability area the entry belongs to |
| `lastReviewed` | ISO date of the last human review of the entry; update it whenever you verify or change the entry |
| `understand.plain` | One or two plain sentences on why the gap matters |
| `understand.regulatoryHook` | Optional. `instrument`, `appliesToRoles` (array: `user`, `contributor`, `steward`, `distributor`), `plain` text, and a mandatory `boundary` statement |
| `act` | Level-keyed prompts: the concrete artefact to produce from that level |
| `learn` | Array of `{ title, type, cost, url }`; `cost` must be honest, and commercial resources are flagged |

Rules for `learn` entries: prefer free and open resources; verify the URL is live when you touch an entry; primary sources over commentary; no affiliate or promotional links.

Regulatory dates in `understand` text must trace to the legal text (for the CRA, Regulation (EU) 2024/2847, Article 71: reporting obligations from 11 September 2026, main obligations including SBOM from 11 December 2027).

## Workflow

1. Fork, branch from `main`, make the change.
2. Test by opening `index.html` locally; there is nothing to build. Check the browser console is clean.
3. For visible copy changes, check keyboard navigation still works and print layout is not broken.
4. Open a PR with a one-paragraph description of what changed and why. For `resources.json` changes, note which URLs you verified.

Small PRs are reviewed quickly. Large unsolicited rewrites generally are not.

## Licence

By contributing you agree your contribution is licensed under the repository's [MIT licence](LICENSE).
