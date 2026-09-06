/* Lightweight Open Source Governance Diagnostic - app.js
   Vanilla JS, no frameworks, no runtime network calls. All rendering via the DOM API
   plus innerHTML for static markup. State is held in a module-level object and
   persisted to localStorage. Mirrors Meagher (2026) v2.5. */
'use strict';

/* ---- State ---- */
let state = {
  started: false,
  role: null,    // 'user' | 'contributor' | 'steward' | 'distributor'
  areas: {}      // keyed by area id: { level, owner, nextAction, delivery }
};

const STORAGE_KEY = 'oss-governance-diagnostic-v1';
const TOOL_NAME   = 'Lightweight Open Source Governance Diagnostic';
const TOOL_VERSION = '2.5';

/* ---- Persistence ---- */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      started: state.started,
      role:    state.role,
      areas:   state.areas
    }));
  } catch (_) {
    /* localStorage unavailable: degrade to in-memory only */
  }
}

function emptyArea() {
  return { level: null, owner: '', nextAction: '', delivery: null };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state.started = !!saved.started;
      state.role    = saved.role || null;
      state.areas   = saved.areas || {};
    }
  } catch (_) { /* start fresh */ }

  /* Guarantee every area has a complete entry (older saves lack delivery) */
  AREAS.forEach(a => {
    state.areas[a.id] = Object.assign(emptyArea(), state.areas[a.id] || {});
  });
}

/* ---- Resource loading ---- */
async function loadResources() {
  try {
    const res = await fetch('resources.json');
    if (res.ok) return res.json();
  } catch (_) { /* offline or file missing */ }
  return [];
}

/* ---- Escape helpers ---- */
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Brand rule: the phrase "open source" is Brand Green in headings. */
function greenOS(text) {
  return esc(text).replace(/open source/gi, m => `<span class="os">${m}</span>`);
}

/* ---- Risk label/class ---- */
const RISK_LABELS = {
  high:         'High risk if L1 to L2',
  medium:       'Medium risk',
  foundational: 'Foundational',
  lower:        'Lower risk'
};

/* ---- Main render ---- */
function render() {
  const app = document.getElementById('app');
  while (app.firstChild) app.removeChild(app.firstChild);

  app.appendChild(buildHeader());
  app.appendChild(buildIntro());

  if (state.started) {
    app.appendChild(buildRoleSelector());

    if (state.role) {
      app.appendChild(buildMatrix());
      app.appendChild(buildSummary());
      app.appendChild(buildExportControls());
    }
  }

  app.appendChild(buildFooter());
}

/* ---- Header ---- */
function buildHeader() {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container">
      <div class="header-inner">
        <div class="header-brand">
          <a class="header-logo" href="https://openirelandnetwork.com" target="_blank" rel="noopener noreferrer">
            <img src="assets/oin-logo-landscape.svg" alt="Open Ireland Network" width="200" height="37">
          </a>
          <span class="header-divider" aria-hidden="true"></span>
          <span class="header-tool">OSS Governance Diagnostic</span>
        </div>
        <div class="header-actions no-print">
          <button id="hdr-print" class="btn btn-outline btn-sm">Print / PDF</button>
          <button id="hdr-clear" class="btn btn-ghost btn-sm">Clear and start again</button>
        </div>
      </div>
    </div>`;

  header.querySelector('#hdr-print').addEventListener('click', () => window.print());
  header.querySelector('#hdr-clear').addEventListener('click', clearAll);
  return header;
}

/* ---- Intro / hero ---- */
function buildIntro() {
  const sec = document.createElement('section');
  sec.className = 'intro-panel';
  sec.innerHTML = `
    <div class="container">
      <div class="intro-content">
        <p class="eyebrow">Self-assessment for European SMEs</p>
        <h1>Know where your <span class="os">open source</span> governance stands<span class="os">.</span></h1>
        <p class="lede">
          Most European SMEs run on open source software, and increasingly they consume it through
          the cloud: base container images, managed platform services, CI/CD pipelines, and
          infrastructure defined as code. Most govern none of it. The Cyber Resilience Act and NIS2
          have put a clock on that. This Diagnostic helps a founder, CTO, or operations lead work out
          where governance currently sits across seven capability areas, who owns it or should, and
          what the single most immediate next step looks like.
        </p>
        <div class="intro-grid">
          <div class="intro-point">
            <h3>Ownership first</h3>
            <p>Each area asks who is responsible before it asks how mature you are. Naming an owner is the foundational governance act.</p>
          </div>
          <div class="intro-point">
            <h3>Built for cloud-native stacks</h3>
            <p>Where a component is consumed as a managed service, note who patches it: you or the provider. The answers change with that split.</p>
          </div>
          <div class="intro-point">
            <h3>Nothing leaves your machine</h3>
            <p>No accounts, no server, no analytics. Answers save in your browser, export to CSV or JSON, and print to the A3 worksheet.</p>
          </div>
        </div>
        <div class="disclaimer">
          <strong>This is a self-assessment, not legal advice.</strong> It does not determine whether any
          specific EU regulation applies to your organisation. Where regulatory exposure is signposted,
          for example a copyleft question or a possible CRA obligation, take it to a qualified specialist.
        </div>
        ${!state.started
          ? `<div class="intro-actions no-print">
               <button id="btn-start" class="btn btn-primary btn-lg">Start the assessment</button>
               <a class="btn btn-outline btn-lg" href="docs/USER-GUIDE.md" target="_blank" rel="noopener noreferrer">Read the user guide</a>
             </div>`
          : ''}
      </div>
    </div>`;

  if (!state.started) {
    sec.querySelector('#btn-start').addEventListener('click', () => {
      state.started = true;
      saveState();
      render();
      setTimeout(() => {
        document.getElementById('role-selector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  }
  return sec;
}

/* ---- Role selector ---- */
const ROLES = [
  {
    id: 'user',
    label: 'User',
    desc: 'We use OSS components in our products or operations, including through cloud services, but do not distribute or publish them externally.'
  },
  {
    id: 'contributor',
    label: 'Contributor',
    desc: 'We contribute code, documentation, or resources to upstream OSS projects.'
  },
  {
    id: 'steward',
    label: 'Steward',
    desc: 'We maintain or govern OSS projects as a community service or part of our mission.'
  },
  {
    id: 'distributor',
    label: 'Commercial distributor',
    desc: 'We place a product with digital elements on the EU market. A hosted or SaaS product can count where the remote service is an essential part of the product.'
  }
];

function buildRoleSelector() {
  const sec = document.createElement('section');
  sec.id = 'role-selector';
  sec.className = 'role-section';
  sec.innerHTML = `
    <div class="container">
      <p class="eyebrow">Step 1 of 3</p>
      <h2>Your organisation's role</h2>
      <p class="section-lede">Select the option that best describes your relationship with the open source you use.
         This decides which regulatory context appears in the guidance panels, and nothing else.
         Most SMEs do not know which of these roles they occupy in regulatory terms; picking one here is a first step, not a determination.</p>
      <div class="role-grid">
        ${ROLES.map(r => `
          <label class="role-card${state.role === r.id ? ' selected' : ''}">
            <input type="radio" name="org-role" value="${r.id}"${state.role === r.id ? ' checked' : ''}>
            <span class="role-card-label">${esc(r.label)}</span>
            <span class="role-card-desc">${esc(r.desc)}</span>
          </label>`).join('')}
      </div>
    </div>`;

  sec.querySelectorAll('input[name="org-role"]').forEach(input => {
    input.addEventListener('change', () => {
      const first = !state.role;
      state.role = input.value;
      saveState();
      render();
      if (first) {
        setTimeout(() => {
          document.getElementById('matrix')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      }
    });
  });

  return sec;
}

/* ---- Matrix ---- */
function buildMatrix() {
  const sec = document.createElement('section');
  sec.id = 'matrix';
  sec.className = 'matrix-section';
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = `
    <p class="eyebrow">Step 2 of 3</p>
    <h2>Capability assessment</h2>
    <p class="section-lede">For each of the seven areas, name an owner (even an informal one), note who runs the
      components involved, mark your current level, and record the single most immediate next action.
      Rate where the organisation is, not where it would like to be.</p>`;

  AREAS.forEach(area => container.appendChild(buildAreaCard(area)));

  sec.appendChild(container);
  return sec;
}

function buildAreaCard(area) {
  const areaState = state.areas[area.id];
  const resources = (state.resources || []).find(r => r.areaId === area.id);

  const card = document.createElement('article');
  card.className = `area-card${areaState.level ? ' area-assessed' : ''}`;
  card.id = `area-${area.id}`;

  card.innerHTML = `
    <div class="area-header">
      <div class="area-title">
        <span class="area-number" aria-hidden="true">${area.id}</span>
        <h3>${greenOS(area.name)}</h3>
      </div>
      <span class="risk-badge risk-${area.risk}">${esc(RISK_LABELS[area.risk] || area.risk)}</span>
    </div>

    <p class="area-prompt">${esc(area.prompt)}</p>

    <div class="area-inputs area-inputs-top">
      <div class="input-group">
        <label for="area-${area.id}-owner">Owner or responsible role <span class="label-hint">(name the current owner, even if informal)</span></label>
        <input type="text" id="area-${area.id}-owner" class="text-input"
          placeholder="e.g. CTO, Head of Engineering, Tech Lead"
          value="${esc(areaState.owner)}" maxlength="120"
          autocomplete="off">
      </div>
      <fieldset class="input-group delivery-group">
        <legend>Who runs the components this area covers?</legend>
        <div class="delivery-options">
          ${DELIVERY_MODELS.map(d => `
            <label class="delivery-option${areaState.delivery === d.id ? ' selected' : ''}" title="${esc(d.desc)}">
              <input type="radio" name="area-${area.id}-delivery" value="${d.id}"${areaState.delivery === d.id ? ' checked' : ''}>
              <span>${esc(d.label)}</span>
            </label>`).join('')}
        </div>
      </fieldset>
    </div>

    <div class="level-selector">
      <div class="level-legend" id="area-${area.id}-legend">Select your current maturity level</div>
      <div class="level-grid" role="radiogroup" aria-labelledby="area-${area.id}-legend">
        ${Object.entries(MATURITY_LEVELS).map(([lvl, title]) => `
          <label class="level-card${areaState.level === +lvl ? ' selected' : ''}">
            <input type="radio" name="area-${area.id}-level" value="${lvl}"
              ${areaState.level === +lvl ? 'checked' : ''}
              aria-label="Level ${lvl}: ${esc(title)}. ${esc(area.levels[lvl])}">
            <div class="level-card-inner">
              <div class="level-number">${lvl}</div>
              <div class="level-title">${esc(title)}</div>
              <div class="level-desc">${esc(area.levels[lvl])}</div>
            </div>
          </label>`).join('')}
      </div>
    </div>

    <div class="area-inputs">
      <div class="input-group input-group-wide">
        <label for="area-${area.id}-action">Single most immediate next action</label>
        <input type="text" id="area-${area.id}-action" class="text-input"
          placeholder="The one concrete thing to do next from your current level"
          value="${esc(areaState.nextAction)}" maxlength="240"
          autocomplete="off">
      </div>
    </div>`;

  /* Remediation panel */
  if (resources) {
    card.appendChild(buildRemediationPanel(area.id, areaState.level, resources));
  }

  /* Level selection */
  card.querySelectorAll(`input[name="area-${area.id}-level"]`).forEach(input => {
    input.addEventListener('change', () => {
      const newLevel = +input.value;
      state.areas[area.id].level = newLevel;
      saveState();

      card.querySelectorAll('.level-card').forEach(lc => {
        const v = +(lc.querySelector('input')?.value);
        lc.classList.toggle('selected', v === newLevel);
      });
      card.classList.add('area-assessed');

      const panel = card.querySelector('.remediation-panel');
      if (panel && resources) {
        panel.classList.add('visible');
        const body = panel.querySelector('.remediation-body');
        if (body) body.innerHTML = remediationBodyHTML(newLevel, resources);
      }

      updateSummary();
    });
  });

  /* Delivery model selection */
  card.querySelectorAll(`input[name="area-${area.id}-delivery"]`).forEach(input => {
    input.addEventListener('change', () => {
      state.areas[area.id].delivery = input.value;
      saveState();
      card.querySelectorAll('.delivery-option').forEach(o => {
        o.classList.toggle('selected', o.querySelector('input')?.value === input.value);
      });
      updateSummary();
    });
  });

  /* Owner input */
  card.querySelector(`#area-${area.id}-owner`).addEventListener('input', e => {
    state.areas[area.id].owner = e.target.value;
    saveState();
    updateSummary();
  });

  /* Next-action input */
  card.querySelector(`#area-${area.id}-action`).addEventListener('input', e => {
    state.areas[area.id].nextAction = e.target.value;
    saveState();
  });

  return card;
}

/* ---- Remediation panel ---- */
function buildRemediationPanel(areaId, level, resources) {
  const div = document.createElement('div');
  div.className = `remediation-panel${level ? ' visible' : ''}`;
  div.innerHTML = `
    <div class="remediation-inner">
      <div class="remediation-header">
        <h4>Guidance for your current level</h4>
        <span class="last-reviewed">Content last reviewed ${esc(resources.lastReviewed)}</span>
      </div>
      <div class="remediation-body">
        ${level ? remediationBodyHTML(level, resources) : ''}
      </div>
    </div>`;
  return div;
}

function remediationBodyHTML(level, resources) {
  /* Regulatory hook: show only if the user's role is in appliesToRoles */
  const hook = resources.understand.regulatoryHook;
  const showHook = hook && Array.isArray(hook.appliesToRoles) &&
    hook.appliesToRoles.includes(state.role);

  /* Act prompt: use exact level or nearest lower level */
  let actText = '';
  for (let l = level; l >= 1; l--) {
    if (resources.act[l]) { actText = resources.act[l]; break; }
  }
  if (level === 5 && !resources.act[5]) {
    actText = 'You are at the top of the scale for this area. Keep the practice under periodic review so it survives staff turnover, and consider contributing your approach back to the community that maintains this tool.';
  }

  const learnItems = resources.learn.map(item => `
    <li class="learn-item">
      <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer" class="learn-link">${esc(item.title)}</a>
      <span class="learn-meta">
        <span class="learn-type">${esc(item.type)}</span>
        <span class="${item.cost === 'free' ? 'cost-free' : 'cost-paid'}">${esc(item.cost)}</span>
      </span>
    </li>`).join('');

  return `
    <div class="rem-understand">
      <h5>Understand</h5>
      <p>${esc(resources.understand.plain)}</p>
      ${showHook ? `
        <div class="reg-hook">
          <span class="reg-hook-badge">${esc(hook.instrument)}</span>
          <p>${esc(hook.plain)}</p>
          <p class="reg-boundary">${esc(hook.boundary)}</p>
        </div>` : ''}
    </div>
    <div class="rem-act">
      <h5>Act</h5>
      <p>${esc(actText)}</p>
    </div>
    <div class="rem-learn">
      <h5>Learn</h5>
      <ul class="learn-list">${learnItems}</ul>
    </div>`;
}

/* ---- Summary ---- */
function buildSummary() {
  const sec = document.createElement('section');
  sec.id = 'summary-panel';
  sec.className = 'summary-section';
  sec.innerHTML = `<div class="container"><div class="summary-inner">${summaryHTML()}</div></div>`;
  return sec;
}

function summaryHTML() {
  const assessed = AREAS.filter(a => state.areas[a.id]?.level);
  const total    = AREAS.length;
  const count    = assessed.length;

  const avg = count > 0
    ? (assessed.reduce((s, a) => s + state.areas[a.id].level, 0) / count).toFixed(1)
    : 'n/a';

  /* Lowest-scoring areas (up to 3, only assessed ones) */
  const sorted = [...assessed].sort((a, b) => state.areas[a.id].level - state.areas[b.id].level);
  const lowest = sorted.slice(0, 3);

  /* High-risk areas at Level 1 or 2 */
  const highRiskLow = AREAS.filter(a =>
    a.risk === 'high' && state.areas[a.id]?.level && state.areas[a.id].level <= 2
  );

  /* Headline: Area 1 (Internal Ownership) owner */
  const ownerNamed = (state.areas[1]?.owner || '').trim().length > 0;

  /* Ownership coverage and delivery split across all areas */
  const ownersNamed = AREAS.filter(a => (state.areas[a.id]?.owner || '').trim().length > 0).length;
  const deliveryRecorded = AREAS.filter(a => state.areas[a.id]?.delivery).length;

  /* Target: Level 3 in Security and Licensing before CRA / NIS2 obligations activate */
  const targetRows = TARGET_AREAS.map(id => {
    const area = AREAS.find(a => a.id === id);
    const lvl  = state.areas[id]?.level;
    const met  = lvl != null && lvl >= TARGET_LEVEL;
    return { area, lvl, met };
  });

  return `
    <p class="eyebrow">Step 3 of 3</p>
    <h2>Live summary</h2>

    <div class="summary-headline ${ownerNamed ? 'headline-ok' : 'headline-alert'}" role="status">
      <span class="headline-icon" aria-hidden="true">${ownerNamed ? '&#10003;' : '!'}</span>
      <span>
        Has an owner been named for open source governance overall?
        ${ownerNamed
          ? ` <strong>Yes</strong> (${esc(state.areas[1].owner)}). That is the single most consequential outcome of a first pass.`
          : ' <strong>Not yet.</strong> Enter an owner in Internal Ownership above, even an interim one. Nothing else in this assessment works without it.'}
      </span>
    </div>

    <div class="summary-grid">
      <div class="summary-stat">
        <div class="stat-value">${count}&thinsp;/&thinsp;${total}</div>
        <div class="stat-label">Areas assessed</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value">${avg}</div>
        <div class="stat-label">Average maturity level</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value${highRiskLow.length > 0 ? ' stat-alert' : ''}">${highRiskLow.length}</div>
        <div class="stat-label">High-risk areas at Level 1 or 2</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value">${ownersNamed}&thinsp;/&thinsp;${total}</div>
        <div class="stat-label">Areas with a named owner</div>
      </div>
    </div>

    ${highRiskLow.length > 0 ? `
      <div class="summary-block summary-block-alert">
        <h3>Prioritised: high-risk areas at Level 1 or 2</h3>
        <p class="summary-note">These carry the most immediate CRA and NIS2 exposure and should come first.</p>
        <ul class="summary-list">
          ${highRiskLow.map(a => `
            <li class="summary-list-item alert">
              <a href="#area-${a.id}" class="area-link">${esc(a.name)}</a>
              <span class="level-chip level-chip-low">Level ${state.areas[a.id].level}: ${esc(MATURITY_LEVELS[state.areas[a.id].level])}</span>
            </li>`).join('')}
        </ul>
      </div>` : ''}

    ${lowest.length > 0 ? `
      <div class="summary-block">
        <h3>Lowest-scoring areas</h3>
        <ul class="summary-list">
          ${lowest.map(a => `
            <li class="summary-list-item">
              <a href="#area-${a.id}" class="area-link">${esc(a.name)}</a>
              <span class="level-chip">Level ${state.areas[a.id].level}: ${esc(MATURITY_LEVELS[state.areas[a.id].level])}</span>
            </li>`).join('')}
        </ul>
      </div>` : ''}

    ${count > 0 ? `
      <div class="summary-block">
        <h3>Target: Level ${TARGET_LEVEL} in Security and Licensing before the relevant CRA / NIS2 obligations activate</h3>
        <p class="summary-note">A design threshold argued from the regulatory timeline, not a level required by any framework. Reaching it in the two highest-risk areas is the minimum viable governance posture worth targeting first.</p>
        <ul class="summary-list">
          ${targetRows.map(t => `
            <li class="summary-list-item${t.met ? ' ok' : (t.lvl ? ' alert' : '')}">
              <a href="#area-${t.area.id}" class="area-link">${esc(t.area.name)}</a>
              <span class="level-chip${t.met ? ' level-chip-ok' : (t.lvl ? ' level-chip-low' : '')}">
                ${t.lvl ? `Level ${t.lvl}${t.met ? ': target met' : `: ${TARGET_LEVEL - t.lvl} level${TARGET_LEVEL - t.lvl > 1 ? 's' : ''} to go`}` : 'Not yet assessed'}
              </span>
            </li>`).join('')}
        </ul>
      </div>

      <div class="summary-block">
        <h3>Managed and self-managed split</h3>
        <p class="summary-note">
          Recorded for ${deliveryRecorded} of ${total} areas.
          ${deliveryRecorded < total
            ? 'From Level 3 onwards this decides who is responsible when a vulnerability or advisory appears; assuming the provider covers something it does not is the most common way a self-assessment overstates maturity.'
            : 'Good. Check the Security and Maintenance answer against it: does someone know who patches each important component?'}
        </p>
      </div>` : ''}

    ${count === 0 ? `<p class="summary-empty">Complete the assessment above to see your summary here.</p>` : ''}`;
}

function updateSummary() {
  const panel = document.getElementById('summary-panel');
  if (!panel) return;
  const inner = panel.querySelector('.summary-inner');
  if (inner) inner.innerHTML = summaryHTML();
}

/* ---- Export controls ---- */
function buildExportControls() {
  const sec = document.createElement('section');
  sec.className = 'export-section no-print';
  sec.innerHTML = `
    <div class="container">
      <h2>Export, print, or restore</h2>
      <p class="section-lede">Your assessment is saved automatically in this browser. Export it to keep a copy, share it, or revisit it later; the Diagnostic is meant to be repeated, not completed once.</p>
      <div class="export-grid">
        <div class="export-group">
          <h3>Export your assessment</h3>
          <div class="btn-group">
            <button id="exp-json" class="btn btn-outline">Download JSON</button>
            <button id="exp-csv"  class="btn btn-outline">Download CSV</button>
            <button id="exp-print" class="btn btn-outline">Print or save as PDF (A3)</button>
          </div>
        </div>
        <div class="export-group">
          <h3>Restore a saved assessment</h3>
          <div class="btn-group">
            <label class="btn btn-outline" for="imp-file">Import JSON</label>
            <input type="file" id="imp-file" accept=".json,application/json" class="sr-only">
          </div>
          <p class="export-hint">Import a JSON file previously exported from this tool. It replaces what is currently on screen.</p>
        </div>
      </div>
    </div>`;

  sec.querySelector('#exp-json').addEventListener('click', exportJSON);
  sec.querySelector('#exp-csv').addEventListener('click',  exportCSV);
  sec.querySelector('#exp-print').addEventListener('click', () => window.print());
  sec.querySelector('#imp-file').addEventListener('change', importJSON);
  return sec;
}

/* ---- Export: JSON ---- */
function deliveryLabel(id) {
  const d = DELIVERY_MODELS.find(x => x.id === id);
  return d ? d.label : '';
}

function exportJSON() {
  const payload = {
    exportedAt: new Date().toISOString(),
    tool: TOOL_NAME,
    version: TOOL_VERSION,
    role: state.role,
    areas: AREAS.map(area => ({
      id:            area.id,
      name:          area.name,
      risk:          area.risk,
      level:         state.areas[area.id]?.level  ?? null,
      levelLabel:    state.areas[area.id]?.level  != null
                       ? MATURITY_LEVELS[state.areas[area.id].level]
                       : null,
      owner:         state.areas[area.id]?.owner      || '',
      delivery:      state.areas[area.id]?.delivery   || null,
      deliveryLabel: deliveryLabel(state.areas[area.id]?.delivery),
      nextAction:    state.areas[area.id]?.nextAction || ''
    }))
  };
  downloadBlob(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    'oss-governance-diagnostic.json'
  );
}

/* ---- Export: CSV ---- */
function exportCSV() {
  const headers = ['Area ID', 'Area Name', 'Risk Level', 'Maturity Level', 'Level Label', 'Owner / Role', 'Who runs the components', 'Next Action'];
  const rows = AREAS.map(area => {
    const s = state.areas[area.id] || {};
    return [
      area.id,
      area.name,
      area.risk,
      s.level ?? '',
      s.level != null ? MATURITY_LEVELS[s.level] : '',
      s.owner      || '',
      deliveryLabel(s.delivery),
      s.nextAction || ''
    ].map(csvCell).join(',');
  });
  downloadBlob(
    new Blob(['﻿' + [headers.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' }),
    'oss-governance-diagnostic.csv'
  );
}

function csvCell(val) {
  const s = String(val ?? '');
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

/* ---- Import: JSON ---- */
function importJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data.areas)) throw new Error('Invalid format');

      if (data.role) state.role = data.role;

      data.areas.forEach(a => {
        if (a.id != null && state.areas[a.id] !== undefined) {
          const validDelivery = DELIVERY_MODELS.some(d => d.id === a.delivery) ? a.delivery : null;
          state.areas[a.id] = {
            level:      a.level      ?? null,
            owner:      a.owner      ?? '',
            nextAction: a.nextAction ?? '',
            delivery:   validDelivery
          };
        }
      });

      state.started = true;
      saveState();
      render();
    } catch (_) {
      /* eslint-disable-next-line no-alert */
      alert('Could not import the file. Please make sure it is a valid JSON export from this Diagnostic.');
    }
    e.target.value = '';
  };
  reader.readAsText(file);
}

/* ---- Download helper ---- */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---- Clear / reset ---- */
function clearAll() {
  /* eslint-disable-next-line no-alert */
  if (!confirm('Clear all assessment data and start again? This cannot be undone.')) return;
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) { /* */ }
  const res = state.resources; /* keep fetched resources */
  state = {
    started:   false,
    role:      null,
    areas:     Object.fromEntries(AREAS.map(a => [a.id, emptyArea()])),
    resources: res
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
  render();
}

/* ---- Footer ---- */
function buildFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <img src="assets/oin-logo-landscape.svg" alt="Open Ireland Network" width="180" height="33">
          <p class="footer-tagline">Open Ireland Network | <a href="https://openirelandnetwork.com" target="_blank" rel="noopener noreferrer">openirelandnetwork.com</a></p>
        </div>
        <div class="footer-text">
          <p class="attribution">
            Based on Meagher, M. (2026),
            <em>Open Source Governance Capabilities for European SMEs: Developing a Lightweight Diagnostic Tool for Cloud-Native SMEs</em>,
            MSc Digital4Business Final Practicum, National College of Ireland. Version ${TOOL_VERSION}.
          </p>
          <p class="footer-links">
            <a href="LICENSE" target="_blank" rel="noopener noreferrer">MIT licence</a>
            &middot;
            <a href="https://github.com/mmeagher11/Practicum" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
            &middot;
            <a href="docs/USER-GUIDE.md" target="_blank" rel="noopener noreferrer">User guide</a>
            &middot;
            <a href="CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute</a>
          </p>
          <p class="footer-disclaimer">
            Remediation content is community-maintained; last reviewed dates are shown per area.
            This tool is a self-assessment aid and does not constitute legal advice.
            It signposts regulatory context and never determines whether an obligation applies to you.
          </p>
        </div>
      </div>
    </div>`;
  return footer;
}

/* ---- Init ---- */
async function init() {
  loadState();
  state.resources = await loadResources();

  /* Register service worker for offline support */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* non-fatal */ });
  }

  render();
}

document.addEventListener('DOMContentLoaded', init);
