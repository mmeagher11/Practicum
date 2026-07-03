# User Guide: Lightweight Open Source Governance Diagnostic

This guide walks a non-specialist through completing the Diagnostic and acting on the result. You do not need legal training, an open source programme office, or any prior governance work. Plan for about an hour the first time.

## Who this is for

You are a founder, CTO, operations lead, or the person in your organisation who has quietly become "the one who deals with software questions". Your organisation uses open source software, almost certainly more than anyone has written down, and nobody currently owns that fact. That is the normal starting condition; the tool is calibrated for it.

## Before you start

You do not need to prepare anything, but the assessment is faster and more honest if you can answer roughly: what your main products or services are, whether you sell or distribute software (including software embedded in a product or delivered as a service), and who currently touches open source decisions in practice, even informally.

One framing to hold onto: the goal is a realistic picture of where you are, not where you would like to be. Most organisations score Level 1 or 2 in most areas on a first pass. That is the expected finding, and it is useful, because it shows where the ownership gaps are.

## Step 1: Answer the role question

The tool first asks which best describes your organisation's relationship with open source: user, contributor, steward, or commercial distributor. This matters because EU regulatory obligations differ sharply by role. If you package and sell products that include open source components, you are likely a commercial distributor for Cyber Resilience Act purposes regardless of your size. The tool uses your answer only to decide which regulatory notes to show you; it does not, and cannot, determine your legal position.

## Step 2: Work through the seven areas

For each capability area, read the five level descriptors and select the one that honestly matches today. Then fill in two short fields:

**Owner.** Name the person or role responsible for this area. If nobody is, name the most plausible candidate. This is the most important field in the tool. If you complete nothing else, complete the owner field for Area 1.

**Next action.** The single most immediate concrete step from your current level. Small and real beats grand and notional: "turn on dependency alerts in GitHub" is a good next action; "implement a governance framework" is not.

The seven areas, in order:

1. **Internal Ownership.** Is anyone responsible for open source decisions? This area is foundational: every other area depends on someone owning it.
2. **Software Visibility.** Do you know what open source components you use, under what licences? This is the SBOM question. If you distribute software in the EU, an SBOM becomes a legal requirement under the CRA from 11 December 2027.
3. **Policy and Decision-Making.** Is there any documented approach to adopting new components, even a one-page checklist?
4. **Security and Maintenance.** Does anyone monitor vulnerability advisories for your dependencies and own the decision to patch? Flagged high risk: CRA obligations to report actively exploited vulnerabilities apply from 11 September 2026.
5. **Legal and Licensing Awareness.** Does anyone understand the licence conditions of what you ship, particularly copyleft obligations?
6. **Regulatory Readiness.** Do you know which EU instruments apply to you and what role you occupy? Deliberately placed late: compliance cannot precede capability.
7. **External Collaboration and Contribution.** Do your people contribute upstream, and is there any policy governing that? Usually the right area to deprioritise on a first pass.

Areas 2, 4, and 5 are flagged as high risk: sitting at Level 1 or 2 there carries the most immediate regulatory and operational exposure.

## Step 3: Read the summary

As you fill in the matrix, the summary panel shows your overall progress, lowest-scoring areas, and a prioritised list of high-risk areas at Level 1 or 2. It also asks the headline question directly: have you named an owner for open source governance overall?

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
- **Export CSV or JSON** for records or to share internally. **Import JSON** restores a saved assessment on any machine.
- **Clear and start again** if you want a fresh pass.

Treat the Diagnostic as a living document. Revisit it quarterly, or when something material changes: a new product, a new customer in a regulated sector, a regulatory date approaching. As your levels rise the next-action prompts change with you.

## What good looks like

You do not need Level 5 anywhere. For most SMEs the meaningful target is Level 3, basic ownership established, in every area, reached first in the high-risk areas (Security and Licensing especially) before the relevant CRA and NIS2 obligations activate. Level 3 means: a named person is responsible, and a basic documented practice exists. That is a material governance improvement and a workable foundation for whatever compliance work your role turns out to require.

## When to stop self-assessing and get help

Go to a specialist if the assessment surfaces any of the following: you distribute a product containing copyleft-licensed components and have not been meeting source disclosure requirements; you believe you fall within CRA scope as a commercial distributor and have no vulnerability handling process; or a customer contract passes NIS2 supply chain requirements down to you and you cannot evidence your practices. The Diagnostic will have done its job by making the gap visible; closing gaps of that kind needs qualified advice.

## Privacy

No accounts, no cookies, no analytics, no external calls. Assessment data lives in your browser's local storage and in whatever exports you choose to download. Clearing your browser data clears the assessment.

## Feedback

Found a dead link, a stale regulatory date, or a descriptor that does not fit your reality? Open an issue or a pull request; see [CONTRIBUTING.md](../CONTRIBUTING.md). Practitioner feedback is exactly what the next iteration of this tool needs.
