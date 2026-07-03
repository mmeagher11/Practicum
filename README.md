# Lightweight Open Source Governance Diagnostic

A free, browser-based self-assessment tool that helps European SMEs work out where their open source governance stands, who should own it, and what to do next. Built as the digital artefact accompanying the MSc dissertation *Open Source Governance Capabilities for European SMEs: Developing a Lightweight Diagnostic Tool* (Meagher, 2026, National College of Ireland).

**Live tool:** https://mmeagher11.github.io/Practicum/

No accounts, no server, no tracking. Everything runs in your browser and your answers never leave your machine.

## Why this exists

Most European SMEs run on open source software but govern it informally or not at all: no named owner, no component inventory, no decision process. EU regulation is turning that gap into a time-bounded exposure. The Cyber Resilience Act (Regulation (EU) 2024/2847) applies in stages: obligations to report actively exploited vulnerabilities and severe incidents from 11 September 2026, and the main obligations, including the software bill of materials (SBOM) requirement, from 11 December 2027. NIS2 supply chain requirements are already flowing down to SMEs that supply regulated entities.

Existing maturity frameworks (the Linux Foundation five-stage OSPO model, FINOS OSMM, OpenSSF guidance, OpenChain ISO/IEC 5230) are excellent for organisations with dedicated governance functions. This tool is for everyone else: the founder, CTO, or operations lead in an organisation with no OSPO, no in-house counsel, and no compliance team, who needs a realistic starting point rather than an enterprise benchmark.

## What it does

The Diagnostic is a seven-by-five maturity matrix. For each of seven capability areas you select your current level (1 Unaware to 5 Integrated capability), name an owner, and record the single most immediate next action:

1. Internal Ownership (foundational)
2. Software Visibility (high risk)
3. Policy and Decision-Making
4. Security and Maintenance (high risk)
5. Legal and Licensing Awareness (high risk)
6. Regulatory Readiness
7. External Collaboration and Contribution

The tool shows a live summary of your lowest-scoring and highest-risk areas, saves progress locally in your browser, and exports to print/PDF, CSV, and JSON. A remediation layer signposts what to do from your current level, with curated free resources per area.

See the [User Guide](docs/USER-GUIDE.md) for a full walkthrough.

## Scope: what this tool is, and is not

**It is** a governance self-assessment. It surfaces gaps, prompts you to name an owner, and points you at concrete first actions and open resources. Its single most important output is an answer to one question: who is responsible for open source in your organisation?

**It is not** a compliance checklist, a legal determination, or legal advice. The rule throughout is signpost, never determine. Where the tool notes that a gap has a regulatory dimension (CRA, NIS2), it does not decide whether a specific obligation applies to you. If the assessment surfaces specific legal exposure, such as a copyleft compliance question or a CRA obligation you may not be meeting, take that to a specialist.

The tool targets a realistic threshold, not perfection. For most SMEs, reaching Level 3 (basic ownership established) across the board, and in the high-risk areas before the relevant CRA and NIS2 obligations activate, is a material improvement and the intended goal.

## Running locally

There is no build step. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/mmeagher11/Practicum.git
cd Practicum
# then open index.html, or serve it:
python -m http.server 8000
```

The site works offline once loaded (a small service worker caches the assets).

## Deploying

Two supported routes:

**Deploy from branch (simplest).** Settings > Pages > Build and deployment > Source: "Deploy from a branch"; Branch: `main`, folder `/ (root)`. All asset paths are relative, so the site works at the repo subpath without changes.

**GitHub Actions.** The workflow at `.github/workflows/pages.yml` deploys on every push to `main`. For it to succeed: the repository must be public (GitHub Pages is not available for private repositories on the Free plan), and Settings > Pages > Source should be "GitHub Actions".

If the Actions run fails with "Get Pages site failed" or "Resource not accessible by integration", check those two settings first; they account for nearly all failures with a static site like this one.

## Editing the content

All assessment content lives in data files, separate from the UI logic:

- `data.js` holds the seven capability areas and the five level descriptors. These mirror Appendix A of the dissertation (v2.2, July 2026) and should not be paraphrased casually; they are the assessed instrument.
- `resources.json` holds the remediation content: the plain-language "understand" notes, the level-specific "act" prompts, the regulatory hooks with their role gating, and the curated "learn" links. Every entry carries a `lastReviewed` date, which the UI displays so staleness is visible.

## Contributing

Contributions are welcome, and the remediation content in particular is designed to be community-maintained. The most useful contributions, roughly in order:

1. **Resource updates** (PRs against `resources.json`): fix dead links, add better free resources, update `lastReviewed` dates. Regulatory dates and links rot; reviewing them periodically is the single most valuable maintenance act.
2. **Accuracy issues**: if a regulatory statement is wrong or has been overtaken by events, open an issue with a link to the primary source (EUR-Lex or the Commission page, not secondary commentary).
3. **Accessibility and usability**: the tool targets WCAG 2.1 AA. Issues and PRs for keyboard navigation, contrast, or screen reader behaviour are always in scope.
4. **Translations**: the descriptors are structured for language packs. Open an issue first so we can agree the approach.

Ground rules: keep the tool static, dependency-free, and tracker-free; no external network calls at runtime; UK English in visible copy; and respect the signpost-never-determine boundary, no contribution should make the tool tell a user whether a legal obligation applies to them. See [CONTRIBUTING.md](CONTRIBUTING.md) for the practical details.

## Provenance and citation

The capability areas, maturity levels, and design rationale are developed and evidenced in the dissertation; the tool is its Appendix A rendered interactive. If you use this in research or practice, cite:

> Meagher, M. (2026). *Open Source Governance Capabilities for European SMEs: Developing a Lightweight Diagnostic Tool.* MSc Digital4Business Final Practicum, National College of Ireland.

The framework draws on, and positions itself against, the Linux Foundation / TODO Group five-stage OSPO model, the OSPO Alliance Good Governance Initiative Handbook, the FINOS Open Source Maturity Model, OpenChain ISO/IEC 5230, and the maturity-index indicator work of Linåker and Muto (2025). It is an SME-calibrated, ownership-first entry point, not a replacement for those frameworks.

## Licence

[MIT](LICENSE). The assessment content and remediation map are provided in the same spirit: use them, adapt them, and improve them, with attribution.
