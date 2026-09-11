/* Lightweight Open Source Governance Diagnostic - capability area definitions.
   Maturity model follows Appendix A of Meagher (2026) v2.6 (cloud-native framing).
   Level names are unchanged; area questions and level descriptors are worded in
   plain language for practitioner use. Edit this file to update area names,
   descriptors, or risk levels. */

const MATURITY_LEVELS = {
  1: 'Unaware',
  2: 'Aware but unstructured',
  3: 'Basic ownership established',
  4: 'Repeatable practices',
  5: 'Integrated governance capability'
};

/* Who runs the components an area covers. Section 4.3 of the paper: the answer
   to each area depends on whether a component is run by the organisation or
   provided as a managed service, and from Level 3 onwards that split decides
   who patches what. `label` is what the form shows; `exportLabel` is the
   self-standing wording used in CSV and JSON exports. */
const DELIVERY_MODELS = [
  { id: 'self',    label: 'We are',           exportLabel: 'Self-managed',     desc: 'Your organisation runs them, on your own or on rented infrastructure' },
  { id: 'managed', label: 'Our provider is',  exportLabel: 'Provider-managed', desc: 'You consume them as a managed service' },
  { id: 'mixed',   label: 'Both',             exportLabel: 'Both',             desc: 'Some are run by your organisation, some by your provider' }
];

const AREAS = [
  {
    id: 1,
    name: 'Internal Ownership',
    risk: 'foundational',
    prompt: 'Is someone clearly responsible for open source decisions across your software, including application code, base images, pipelines and managed services?',
    levels: {
      1: 'No one is responsible. Open source choices are made in the code, by default.',
      2: 'People accept that someone should own this, but no one does yet.',
      3: 'A named person or role is responsible, even if informally.',
      4: 'The owner has a defined remit covering application code, images and pipelines, and is consulted on open source decisions as a matter of routine.',
      5: 'Ownership is written into role definitions and survives staff changes.'
    }
  },
  {
    id: 2,
    name: 'Software Visibility',
    risk: 'high',
    prompt: 'Do you have an up-to-date record of the open source software you use, including application dependencies, base images, sidecars, pipeline actions and infrastructure-as-code modules?',
    levels: {
      1: 'There is no record of the open source software in use, in the application or in the images and pipelines beneath it.',
      2: 'Developers roughly know what is being used, but there is no reliable record.',
      3: 'A basic inventory or SBOM exists and someone is responsible for keeping it up to date.',
      4: 'The inventory is produced by tooling, covers base image contents, and is updated on a set schedule.',
      5: 'SBOM generation runs automatically in the build pipeline and is checked regularly.'
    }
  },
  {
    id: 3,
    name: 'Policy and Decision-Making',
    risk: 'medium',
    prompt: 'Do you have a clear process for deciding which open source software can be used, including components introduced through pipelines and infrastructure as code?',
    levels: {
      1: 'Developers make adoption decisions individually, with no common process.',
      2: 'Some informal rules exist, but they are not written down.',
      3: 'A short checklist or policy is used when adopting new open source software.',
      4: 'The checklist or policy is applied consistently and reviewed by the owner.',
      5: 'The same decision criteria are built into procurement and into onboarding for new staff.'
    }
  },
  {
    id: 4,
    name: 'Security and Maintenance',
    risk: 'high',
    prompt: 'Do you monitor open source dependencies for vulnerabilities, decide when they need to be patched, and know which components you maintain and which your provider maintains?',
    levels: {
      1: 'No one monitors open source dependencies for vulnerabilities.',
      2: 'Alerts may be enabled, but nobody clearly owns the response and it is not clear what you patch versus what the provider patches.',
      3: "A named owner reviews alerts, a target response time is set, and the split between your responsibilities and the provider's is documented.",
      4: 'Vulnerability handling follows a defined process, including transitive dependencies and base image rebuilds.',
      5: 'Monitoring is continuous, critical advisories have agreed response times, and the process is reviewed regularly.'
    }
  },
  {
    id: 5,
    name: 'Legal and Licensing Awareness',
    risk: 'high',
    prompt: 'Do you know the licence conditions of the open source software you use and distribute, including software inside base images?',
    levels: {
      1: 'The licence conditions of the open source software in use are unknown.',
      2: 'There is some awareness of open source licences, but no regular checks before software is adopted.',
      3: 'A basic licence check is carried out when new open source software is introduced.',
      4: 'Licence checks happen as a matter of routine before adoption, and a named person owns licence questions.',
      5: 'Licence compliance is managed systematically and can be demonstrated when needed, for example through ISO/IEC 5230-aligned processes.'
    }
  },
  {
    id: 6,
    name: 'Regulatory Readiness',
    risk: 'medium',
    prompt: 'Do you know which EU rules may apply to your use of open source software, including whether your product could fall within the Cyber Resilience Act (CRA)?',
    levels: {
      1: 'The organisation does not know which EU rules may apply.',
      2: 'There is some awareness of the CRA or NIS2, but no assessment has been carried out.',
      3: 'The organisation has identified its likely regulatory role and checked whether its products may fall within CRA scope.',
      4: 'Relevant obligations are documented and tracked against regulatory deadlines.',
      5: 'Regulatory responsibilities are reviewed regularly as requirements change.'
    }
  },
  {
    id: 7,
    name: 'External Collaboration and Contribution',
    risk: 'lower',
    prompt: 'Do you manage how your organisation contributes to and works with the open source projects it depends on, including any forks, patched images or modified pipeline actions you maintain?',
    levels: {
      1: 'There is no clear view of the health of key upstream projects, and external contributions are not managed.',
      2: 'Employees may contribute to open source projects, but there is no clear policy.',
      3: 'A basic contribution policy exists and the key upstream projects the organisation depends on are known.',
      4: 'Contribution and engagement with open source communities follow a defined process.',
      5: 'The organisation actively manages its upstream relationships and contributes under clear policies.'
    }
  }
];

/* The design target stated in Appendix A and Section 4: Level 3 in the
   high-risk areas before the relevant CRA / NIS2 obligations activate. */
const TARGET_AREAS = [4, 5];
const TARGET_LEVEL = 3;
