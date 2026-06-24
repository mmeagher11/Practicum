/* OSS Governance Diagnostic - capability area definitions.
   Edit this file to update area names, descriptors, or risk levels. */

const MATURITY_LEVELS = {
  1: 'Unaware',
  2: 'Aware but unstructured',
  3: 'Basic ownership established',
  4: 'Repeatable practices',
  5: 'Integrated governance capability'
};

const AREAS = [
  {
    id: 1,
    name: 'Internal Ownership',
    risk: 'foundational',
    levels: {
      1: 'No one is responsible; OSS decisions happen implicitly in code.',
      2: 'It is acknowledged that someone should own this, but no one does.',
      3: 'A named person or role holds the mandate, even informally.',
      4: 'The owner has a defined remit and is consulted on OSS decisions as routine.',
      5: 'Ownership is embedded in role definitions and survives staff turnover.'
    }
  },
  {
    id: 2,
    name: 'Software Visibility',
    risk: 'high',
    levels: {
      1: 'No inventory of OSS components exists.',
      2: 'Developers know roughly what is used; nothing is recorded.',
      3: 'An initial inventory or SBOM exists and is owned.',
      4: 'The inventory is generated from tooling and updated on a defined cadence.',
      5: 'SBOM generation is automated in the build pipeline and reconciled regularly.'
    }
  },
  {
    id: 3,
    name: 'Policy and Decision-Making',
    risk: 'medium',
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
    levels: {
      1: 'No monitoring of dependency vulnerabilities.',
      2: 'Alerts may be enabled but no one owns triage or response.',
      3: 'A named owner triages advisories; a target response time exists.',
      4: 'Vulnerability handling is a defined, followed process, including transitive dependencies.',
      5: 'Continuous monitoring, SLAs for critical advisories, periodic review.'
    }
  },
  {
    id: 5,
    name: 'Legal and Licensing Awareness',
    risk: 'high',
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
    levels: {
      1: 'The organisation does not know which EU instruments apply to its OSS use.',
      2: 'Awareness that CRA / NIS2 may be relevant, but no mapping.',
      3: "The organisation's regulatory role (user, distributor, steward) is identified.",
      4: 'Applicable obligations are mapped and tracked against the regulatory timeline.',
      5: 'Compliance posture is maintained and reviewed as regulation evolves.'
    }
  },
  {
    id: 7,
    name: 'External Collaboration and Contribution',
    risk: 'lower',
    levels: {
      1: 'No view of upstream project health; outbound contributions ungoverned.',
      2: 'Employees contribute upstream informally, without policy.',
      3: 'A basic contribution policy exists; key upstreams are identified.',
      4: 'Contribution and community engagement follow a defined approach.',
      5: 'Deliberate, policy-governed upstream engagement and stewardship.'
    }
  }
];
