/* Lightweight Open Source Governance Diagnostic - capability area definitions.
   Maturity model follows Appendix A of Meagher (2026) v2.6 (cloud-native framing).
   Level names and the five-level structure are unchanged; area names, questions and
   level descriptors are worded in plain language for practitioner use. Where an area
   is shown under a plainer name, `formalName` carries the capability name used in the
   paper so the two can be reconciled. `help` is optional secondary text under the
   question. `delivery: false` suppresses the "who runs these components" question for
   areas where it does not apply. Edit this file to update area names, descriptors,
   or risk levels. */

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
    prompt: 'Is someone clearly responsible for how your organisation uses and manages open source software?',
    help: 'This can include application code, container images, pipelines and managed services.',
    levels: {
      1: 'No one is responsible. Developers make open source decisions as they arise.',
      2: 'People know someone should be responsible, but no owner has been named.',
      3: 'A named person or role is responsible, even if informally.',
      4: 'The owner has clear responsibilities covering application code, images and pipelines, and is routinely involved in open source decisions.',
      5: 'Ownership is written into role definitions and survives staff changes.'
    }
  },
  {
    id: 2,
    name: 'Software Visibility',
    risk: 'high',
    prompt: 'Do you have an up-to-date record of the open source software you use, including dependencies, base images, pipeline actions and infrastructure-as-code modules?',
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
    name: 'Open Source Policy and Decisions',
    formalName: 'Policy and Decision-Making',
    risk: 'medium',
    prompt: 'Do you have a clear process for deciding which open source software can be used, including components introduced through pipelines and infrastructure as code?',
    levels: {
      1: 'Developers make adoption decisions individually, with no common process.',
      2: 'Some informal rules exist, but they are not written down.',
      3: 'A short checklist or policy is used when adopting new open source software.',
      4: 'The checklist or policy is applied consistently and reviewed by the owner.',
      5: 'The same rules are used in procurement and included in staff onboarding.'
    }
  },
  {
    id: 4,
    name: 'Security and Maintenance',
    risk: 'high',
    prompt: "Do you monitor your open source software for vulnerabilities, know when it needs to be patched, and know which updates are your responsibility and which are your provider's?",
    levels: {
      1: 'No one monitors open source dependencies for vulnerabilities.',
      2: 'Alerts may be enabled, but nobody clearly owns the response and it is not clear what you patch versus what the provider patches.',
      3: "A named owner reviews alerts, a target response time is set, and the split between your responsibilities and the provider's is documented.",
      4: 'Vulnerability handling follows a defined process. It also covers dependencies used by other dependencies (transitive dependencies) and rebuilding affected base images.',
      5: 'Monitoring is continuous, critical advisories have agreed response times, and the process is reviewed regularly.'
    }
  },
  {
    id: 5,
    name: 'Open Source Licensing',
    formalName: 'Legal and Licensing Awareness',
    risk: 'high',
    prompt: 'Do you know the licence requirements of the open source software you use or distribute, including software contained in base images?',
    levels: {
      1: 'The licence requirements of the open source software in use are unknown.',
      2: 'There is some awareness of open source licences, but no regular checks before software is adopted.',
      3: 'A basic licence check is carried out when new open source software is introduced.',
      4: 'Licence checks happen as a matter of routine before adoption, and a named person owns licence questions.',
      5: 'Licence compliance is managed consistently and can be demonstrated when needed, for example through processes aligned with ISO/IEC 5230.'
    }
  },
  {
    id: 6,
    name: 'Regulatory Readiness',
    risk: 'medium',
    /* No delivery question: which EU rules apply is a question about the
       organisation and its products, not about who runs a given component. */
    delivery: false,
    prompt: 'Do you know which EU rules may apply to your organisation or products, including the Cyber Resilience Act (CRA) and NIS2?',
    levels: {
      1: 'The organisation does not know which EU rules may apply.',
      2: 'There is some awareness of the CRA or NIS2, but no assessment has been carried out.',
      3: 'The organisation has checked which regulations may apply and whether any of its products may fall within CRA scope.',
      4: 'Relevant obligations are documented and tracked against regulatory deadlines.',
      5: 'Regulatory responsibilities are reviewed regularly and updated when requirements change.'
    }
  },
  {
    id: 7,
    name: 'Working with Open Source Projects',
    formalName: 'External Collaboration and Contribution',
    risk: 'lower',
    prompt: 'Does your organisation manage how employees contribute to and work with the open source projects you depend on?',
    help: 'This can include contributions, forks, patched images and changes you maintain locally.',
    levels: {
      1: 'The organisation does not track the health of important upstream projects or manage external contributions.',
      2: 'Employees may contribute to open source projects, but there is no clear policy.',
      3: 'A basic contribution policy exists and the key upstream projects the organisation depends on are known.',
      4: 'Contribution and engagement with open source communities follow a defined process.',
      5: 'The organisation actively manages important upstream relationships and contributes under clear policies.'
    }
  }
];

/* True when an area asks who runs the components it covers. */
function areaHasDelivery(area) {
  return area.delivery !== false;
}

/* The design target stated in Appendix A and Section 4: Level 3 in the
   high-risk areas before the relevant CRA / NIS2 obligations activate. */
const TARGET_AREAS = [4, 5];
const TARGET_LEVEL = 3;
