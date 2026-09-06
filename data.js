/* Lightweight Open Source Governance Diagnostic - capability area definitions.
   Mirrors Appendix A of Meagher (2026) v2.5 (cloud-native framing).
   Edit this file to update area names, descriptors, or risk levels. */

const MATURITY_LEVELS = {
  1: 'Unaware',
  2: 'Aware but unstructured',
  3: 'Basic ownership established',
  4: 'Repeatable practices',
  5: 'Integrated governance capability'
};

/* Who operates the components an area covers. Section 4.3 of the paper:
   the answer to each area depends on whether a component is run by the
   organisation or provided as a managed service, and from Level 3 onwards
   that split decides who patches what. */
const DELIVERY_MODELS = [
  { id: 'self',     label: 'We run them',        desc: 'Self-managed on rented or owned infrastructure' },
  { id: 'managed',  label: 'A provider runs them', desc: 'Consumed as a managed service' },
  { id: 'mixed',    label: 'Mixed',              desc: 'Some self-managed, some provider-managed' }
];

const AREAS = [
  {
    id: 1,
    name: 'Internal Ownership',
    risk: 'foundational',
    prompt: 'Does a named person or role hold explicit responsibility for open source decisions, across application code, base images, pipelines and managed services?',
    levels: {
      1: 'No one is responsible; OSS decisions happen implicitly in code.',
      2: 'It is acknowledged that someone should own this, but no one does.',
      3: 'A named person or role holds the mandate, even informally.',
      4: 'The owner has a defined remit covering application, image, and pipeline layers, and is consulted on OSS decisions as routine.',
      5: 'Ownership is embedded in role definitions and survives staff turnover.'
    }
  },
  {
    id: 2,
    name: 'Software Visibility',
    risk: 'high',
    prompt: 'Is there an accurate inventory of the OSS components in use, including base images, sidecars, pipeline actions and infrastructure-as-code modules, not just application dependencies?',
    levels: {
      1: 'No inventory of OSS components exists, in the application or in the images and pipelines beneath it.',
      2: 'Developers know roughly what is used; nothing is recorded.',
      3: 'An initial inventory or SBOM exists and is owned.',
      4: 'The inventory is generated from tooling, includes base image contents, and is updated on a defined cadence.',
      5: 'SBOM generation is automated in the build pipeline and reconciled regularly.'
    }
  },
  {
    id: 3,
    name: 'Policy and Decision-Making',
    risk: 'medium',
    prompt: 'Do documented policies or decision processes exist for adopting OSS, including components that arrive through pipeline configuration and infrastructure-as-code modules?',
    levels: {
      1: 'Adoption decisions are made ad hoc by individual developers.',
      2: 'Some informal norms exist but nothing is written down.',
      3: 'A short, documented adoption checklist or policy exists.',
      4: 'The policy is consistently applied and reviewed by the owner.',
      5: 'Decision criteria are embedded in procurement and onboarding.'
    }
  },
  {
    id: 4,
    name: 'Security and Maintenance',
    risk: 'high',
    prompt: 'Is there a process for monitoring dependency vulnerabilities and deciding on patches, and is it clear which components you patch and which your provider patches?',
    levels: {
      1: 'No monitoring of dependency vulnerabilities.',
      2: 'Alerts may be enabled but no one owns triage or response, and it is not recorded which components you patch and which a provider patches.',
      3: 'A named owner triages advisories; a target response time exists; the managed and self-managed split is written down.',
      4: 'Vulnerability handling is a defined, followed process, including transitive dependencies and base image rebuilds.',
      5: 'Continuous monitoring, SLAs for critical advisories, periodic review.'
    }
  },
  {
    id: 5,
    name: 'Legal and Licensing Awareness',
    risk: 'high',
    prompt: 'Does the organisation understand the licence conditions of the OSS it uses, including the software bundled in base images it distributes?',
    levels: {
      1: 'Licence conditions of OSS in use are unknown.',
      2: 'General awareness, but no audit and no pre-adoption checks.',
      3: 'A first-pass licence scan is done; someone owns licence questions.',
      4: 'New components are licence-checked before adoption as routine.',
      5: 'Licence compliance (e.g. ISO/IEC 5230-aligned) is systematic and auditable.'
    }
  },
  {
    id: 6,
    name: 'Regulatory Readiness',
    risk: 'medium',
    prompt: 'Does the organisation know which EU instruments apply to its OSS use, including whether a hosted product falls within the scope of the Cyber Resilience Act?',
    levels: {
      1: 'The organisation does not know which EU instruments apply to its OSS use.',
      2: 'Awareness that CRA / NIS2 may be relevant, but no mapping.',
      3: "The organisation's regulatory role (user, distributor, steward) is identified, including whether a hosted product falls within CRA scope.",
      4: 'Applicable obligations are mapped and tracked against the regulatory timeline.',
      5: 'Compliance posture is maintained and reviewed as regulation evolves.'
    }
  },
  {
    id: 7,
    name: 'External Collaboration and Contribution',
    risk: 'lower',
    prompt: 'Does the organisation manage its relationship with upstream projects, including the forked modules, patched images and modified pipeline actions it maintains locally?',
    levels: {
      1: 'No view of upstream project health; outbound contributions ungoverned.',
      2: 'Employees contribute upstream informally, without policy.',
      3: 'A basic contribution policy exists; key upstreams are identified, including forked modules and patched images.',
      4: 'Contribution and community engagement follow a defined approach.',
      5: 'Deliberate, policy-governed upstream engagement and stewardship.'
    }
  }
];

/* The design target stated in Appendix A and Section 4: Level 3 in the
   high-risk areas before the relevant CRA / NIS2 obligations activate. */
const TARGET_AREAS = [4, 5];
const TARGET_LEVEL = 3;
