# User Guide: Lightweight Open Source Governance Diagnostic

This guide walks a non-specialist through completing the Diagnostic and acting on the result. You do not need legal training, an open source programme office, or any prior governance work. Plan for about an hour the first time.

## Who this is for

You are a founder, CTO, operations lead, or the person in your organisation who has quietly become "the one who deals with software questions". Your organisation uses open source software, almost certainly more than anyone has written down, and most of it probably arrives through the cloud: base container images, managed database and messaging services, CI/CD pipelines built from third-party actions, and infrastructure-as-code modules pulled from public registries. Renting the infrastructure did not move that open source off your books; it just moved it out of sight. Nobody currently owns that fact. That is the normal starting condition; the tool is calibrated for it.

## Before you start

You do not need to prepare anything, but the assessment is faster and more honest if you can answer roughly: what your main products or services are, whether you sell or distribute software (including software embedded in a product or delivered as a service), and who currently touches open source decisions in practice, even informally.

One framing to hold onto: the goal is a realistic picture of where you are, not where you would like to be. Most organisations score Level 1 or 2 in most areas on a first pass. That is the expected finding, and it is useful, because it shows where the ownership gaps are.

## Step 1: Answer the role question

The tool first asks which best describes your organisation's relationship with open source: user, contributor, steward, or commercial distributor. This matters because EU regulatory obligations differ sharply by role. If you package and sell products that include open source components, you are likely a commercial distributor for Cyber Resilience Act purposes regardless of your size, and a hosted or SaaS product can be in scope too where the remote service is an essential part of the product. The tool uses your answer only to decide which regulatory notes to show you; it does not, and cannot, determine your legal position.

## Step 2: Work through the seven areas

Each capability area asks for ownership before it asks about maturity. Work through the fields in the order they appear:

**Who is responsible?** Name the person or role responsible for this area. If nobody is, name the most plausible candidate. This is the most important field in the tool. If you complete nothing else, complete it for Area 1.

**Who is responsible for running these components?** Pick one of: we are (self-managed, even on rented infrastructure), our provider is (a managed service), or both. If you run a component yourself you are responsible for patching, licence compliance and vulnerability handling; if a provider runs it, they carry more of the operational load but you still answer to your own customers. This split matters little at Level 1 and a great deal from Level 3 onwards, because it decides who acts when an advisory lands. Assuming the provider covers something it does not is the most common way a self-assessment overstates maturity. Six of the seven areas ask this. Regulatory Readiness does not, because which rules apply is a question about your organisation and its products rather than about who operates a component.

**Maturity level.** Read the five level descriptors and select the one that honestly matches today.

**What should you do next?** One practical action from your current level. Small and real beats grand and notional: "turn on dependency alerts in GitHub and image scanning on the base image" is a good next action; "implement a governance framework" is not.

The seven areas, in order:

1. **Internal Ownership.** Is someone clearly responsible for how your organisation uses and manages open source software, including application code, container images, pipelines and managed services? Ownership that stops at the application layer leaves most of a cloud stack unowned. This area is foundational: every other area depends on someone owning it.
2. **Software Visibility.** Do you have an up-to-date record of the open source software you use, including dependencies, base images, pipeline actions and infrastructure-as-code modules? This is the SBOM question. If you distribute software in the EU, an SBOM becomes a legal requirement under the CRA from 11 December 2027. Generate it in the build rather than auditing a running environment the next deployment will replace.
3. **Open Source Policy and Decisions.** Do you have a clear process for deciding which open source software can be used, even a one-page checklist, and does it cover components introduced through pipelines and infrastructure as code, which is where they actually enter?
4. **Security and Maintenance.** Do you monitor your open source software for vulnerabilities, know when it needs to be patched, and know which updates are your responsibility and which are your provider's? Flagged high risk: CRA obligations to report actively exploited vulnerabilities apply from 11 September 2026.
5. **Open Source Licensing.** Do you know the licence requirements of the open source software you use or distribute, particularly copyleft obligations, including software contained in base images?
6. **Regulatory Readiness.** Do you know which EU rules may apply to your organisation or products, including the Cyber Resilience Act and NIS2, and whether a hosted product falls within CRA scope? Deliberately placed late: compliance cannot precede capability. This is the one area that does not ask who runs the components.
7. **Working with Open Source Projects.** Does your organisation manage how employees contribute to and work with the open source projects you depend on, including any forks, patched images and changes you maintain locally? Usually the right area to deprioritise on a first pass.

Areas 2, 4, and 5 are flagged as high risk: sitting at Level 1 or 2 there carries the most immediate regulatory and operational exposure.

Areas 3, 5 and 7 are shown under plainer names than the capability names used in the dissertation. The tool displays the dissertation's name alongside the plainer one, so Appendix A and the screen can be read together.

## Step 3: Read the summary

As you fill in the matrix, the summary panel shows your overall progress, your lowest-scoring areas, and the high-risk areas needing attention. It opens with the headline: whether an overall owner has been named. Two further blocks track the priority target (Level 3 in Security and Licensing, a recommended target for this Diagnostic rather than a legal requirement or a level the CRA or NIS2 demands) and how many of the six applicable areas have recorded who runs the components.

The scores themselves are not the point. The point is that an hour of structured self-assessment converts an invisible, unowned problem into a named owner, a short ordered list of first actions, and a clear view of which gaps carry regulatory urgency.

## Step 4: Act on the remediation prompts

Once you select a level in an area, a remediation panel opens with three parts:

- **Understand**: one or two plain sentences on why the gap matters, with a regulatory note if one is relevant to your declared role.
- **Act**: a concrete artefact to produce from your current level. The prompt changes as your level changes.
- **Learn**: curated, mostly free resources (standards, tools, courses) to build the capability. Each shows when it was last reviewed.

These prompts signpost; they never determine. Where a regulatory note appears, it is accompanied by a boundary statement reminding you that whether an obligation applies to you is a question for a specialist.

## Step 5: Save, export, revisit

Your answers save automatically in your browser (nothing is sent anywhere). You can:

- **Print or save to PDF** using the print button; the layout is designed for A3 landscape.
- **Export CSV or JSON** for records or to share internally; both include the owner, who runs the components (written as Self-managed, Provider-managed or Both), level and next action for every area. **Import JSON** restores a saved assessment on any machine.
- **Clear and start again** if you want a fresh pass.

Treat the Diagnostic as a living document. Revisit it quarterly, or when something material changes: a new product, a new customer in a regulated sector, a regulatory date approaching. As your levels rise the next-action prompts change with you.

## What good looks like

You do not need Level 5 anywhere. For most SMEs the meaningful target is Level 3, basic ownership established, in every area, reached first in the high-risk areas (Security and Licensing especially) before the relevant CRA and NIS2 obligations activate. Level 3 means: a named person is responsible, and a basic documented practice exists. That is a material governance improvement and a workable foundation for whatever compliance work your role turns out to require.

## When to stop self-assessing and get help

Go to a specialist if the assessment surfaces any of the following: you distribute a product containing copyleft-licensed components and have not been meeting source disclosure requirements; you believe you fall within CRA scope as a commercial distributor and have no vulnerability handling process; or a customer contract passes NIS2 supply chain requirements down to you and you cannot evidence your practices. The Diagnostic will have done its job by making the gap visible; closing gaps of that kind needs qualified advice.

## Privacy

No accounts, no cookies, no analytics, no external calls. Fonts and the logo are served from the same place as the tool itself, so nothing is fetched from third parties. Assessment data lives in your browser's local storage and in whatever exports you choose to download. Clearing your browser data clears the assessment.

## Feedback

Found a dead link, a stale regulatory date, or a descriptor that does not fit your reality? Open an issue or a pull request; see [CONTRIBUTING.md](../CONTRIBUTING.md). Practitioner feedback is exactly what the next iteration of this tool needs.
