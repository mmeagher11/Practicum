/* OSS Governance Diagnostic - app.js
   Vanilla JS, no frameworks. All rendering via DOM API + innerHTML for static markup.
   State is held in a module-level object and persisted to localStorage. */
'use strict';

/* ---- State ---- */
let state = {
  started: false,
  role: null,    // 'user' | 'contributor' | 'steward' | 'distributor'
  areas: {}      // keyed by area id
};

const STORAGE_KEY = 'oss-governance-diagnostic-v1';

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

  /* Guarantee every area has a default entry */
  AREAS.forEach(a => {
    if (!state.areas[a.id]) {
      state.areas[a.id] = { level: null, owner: '', nextAction: '' };
    }
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

/* ---- Risk label/class ---- */
const RISK_LABELS = {
  high:         'High risk',
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
        <div class="header-title">
          <span class="header-logo" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="13" cy="13" r="11.5" stroke="currentColor" stroke-width="2"/>
              <path d="M7 13h12M13 7v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <h1>OSS Governance Diagnostic</h1>
        </div>
        <div class="header-actions no-print">
          <button id="hdr-print" class="btn btn-secondary btn-sm">Print / PDF</button>
          <button id="hdr-clear" class="btn btn-ghost btn-sm">Clear / start again</button>
        </div>
      </div>
    </div>`;

  header.querySelector('#hdr-print').addEventListener('click', () => window.print());
  header.querySelector('#hdr-clear').addEventListener('click', clearAll);
  return header;
}

/* ---- Intro ---- */
function buildIntro() {
  const sec = document.createElement('section');
  sec.className = 'intro-panel';
  sec.innerHTML = `
    <div class="container">
      <div class="intro-content">
        <h2>What is this tool?</h2>
        <p>
          This is a governance self-assessment for European SMEs using open source software (OSS).
          It covers seven capability areas, from internal ownership through to regulatory readiness,
          and surfaces targeted guidance once you record your current level in each area.
          It is a self-assessment, not legal advice. Where it indicates specific legal or
          Cyber Resilience Act (CRA) exposure, specialist input is needed before acting on that assessment.
        </p>
        <div class="disclaimer">
          <strong>Disclaimer:</strong> This tool helps you reflect on your current practices in a structured way.
          It does not constitute legal advice and does not determine whether any specific EU regulation applies to
          your organisation. Where regulatory exposure is signposted, please consult a qualified specialist.
        </div>
        ${!state.started
          ? `<button id="btn-start" class="btn btn-primary btn-lg no-print">Start assessment</button>`
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
    desc: 'We use OSS components in our products or operations but do not distribute or publish them externally.'
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
    desc: 'We distribute a product with digital elements (hardware or software) to customers on the EU market.'
  }
];

function buildRoleSelector() {
  const sec = document.createElement('section');
  sec.id = 'role-selector';
  sec.className = 'role-section';
  sec.innerHTML = `
    <div class="container">
      <h2>Your organisation's role</h2>
      <p>Select the option that best describes your relationship with the OSS components you use.
         This determines which regulatory context appears in the guidance panels below.</p>
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
      state.role = input.value;
      saveState();
      render();
      setTimeout(() => {
        document.getElementById('role-selector')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    });
  });

  return sec;
}

/* ---- Matrix ---- */
function buildMatrix() {
  const sec = document.createElement('section');
  sec.className = 'matrix-section';
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = '<h2>Capability Assessment</h2>';

  AREAS.forEach(area => container.appendChild(buildAreaCard(area)));

  sec.appendChild(container);
  return sec;
}

function buildAreaCard(area) {
  const areaState = state.areas[area.id];
  const resources = state.resources.find(r => r.areaId === area.id);

  const card = document.createElement('div');
  card.className = `area-card${areaState.level ? ' area-assessed' : ''}`;
  card.id = `area-${area.id}`;

  card.innerHTML = `
    <div class="area-header">
      <div class="area-title">
        <span class="area-number" aria-hidden="true">${area.id}</span>
        <h3>${esc(area.name)}</h3>
      </div>
      <span class="risk-badge risk-${area.risk}">${esc(RISK_LABELS[area.risk] || area.risk)}</span>
    </div>

    <div class="level-selector">
      <div class="level-legend">Select your current maturity level:</div>
      <div class="level-grid">
        ${Object.entries(MATURITY_LEVELS).map(([lvl, title]) => `
          <label class="level-card${areaState.level === +lvl ? ' selected' : ''}">
            <input type="radio" name="area-${area.id}-level" value="${lvl}"
              ${areaState.level === +lvl ? 'checked' : ''}
              aria-label="Level ${lvl}: ${esc(title)}">
            <div class="level-card-inner">
              <div class="level-number">${lvl}</div>
              <div class="level-title">${esc(title)}</div>
              <div class="level-desc">${esc(area.levels[lvl])}</div>
            </div>
          </label>`).join('')}
      </div>
    </div>

    <div class="area-inputs">
      <div class="input-group">
        <label for="area-${area.id}-owner">Owner / responsible role</label>
        <input type="text" id="area-${area.id}-owner" class="text-input"
          placeholder="e.g. Head of Engineering, Tech Lead"
          value="${esc(areaState.owner)}" maxlength="120"
          autocomplete="off">
      </div>
      <div class="input-group">
        <label for="area-${area.id}-action">Single most immediate next action</label>
        <input type="text" id="area-${area.id}-action" class="text-input"
          placeholder="The one concrete thing to do next"
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

      /* Update level card visual state within this card only */
      card.querySelectorAll('.level-card').forEach(lc => {
        const v = +(lc.querySelector('input')?.value);
        lc.classList.toggle('selected', v === newLevel);
      });
      card.classList.add('area-assessed');

      /* Show/update remediation panel */
      const panel = card.querySelector('.remediation-panel');
      if (panel && resources) {
        panel.classList.add('visible');
        const body = panel.querySelector('.remediation-body');
        if (body) body.innerHTML = remediationBodyHTML(newLevel, resources);
      }

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
        <h4>Guidance</h4>
        <span class="last-reviewed">Content last reviewed: ${esc(resources.lastReviewed)}</span>
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
          <p class="reg-boundary"><em>${esc(hook.boundary)}</em></p>
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
    : '--';

  /* Lowest-scoring areas (up to 3, only assessed ones) */
  const sorted   = [...assessed].sort((a, b) => state.areas[a.id].level - state.areas[b.id].level);
  const lowest   = sorted.slice(0, 3);

  /* High-risk areas at Level 1 or 2 */
  const highRiskLow = AREAS.filter(a =>
    a.risk === 'high' && state.areas[a.id]?.level && state.areas[a.id].level <= 2
  );

  /* Check Area 1 (Internal Ownership) owner */
  const ownerNamed = (state.areas[1]?.owner || '').trim().length > 0;

  return `
    <h2>Live Summary</h2>

    <div class="summary-headline ${ownerNamed ? 'headline-ok' : 'headline-alert'}">
      <span class="headline-icon" aria-hidden="true">${ownerNamed ? '&#10003;' : '!'}</span>
      <span>
        Have you named an owner for OSS governance overall?
        ${ownerNamed
          ? ` <strong>Yes</strong> (${esc(state.areas[1].owner)})`
          : ' <strong>Not yet.</strong> Enter an owner in the Internal Ownership area above.'}
      </span>
    </div>

    <div class="summary-grid">
      <div class="summary-stat">
        <div class="stat-value">${count}&thinsp;/&thinsp;${total}</div>
        <div class="stat-label">Areas assessed</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value">${avg}</div>
        <div class="stat-label">Average maturity score</div>
      </div>
      <div class="summary-stat">
        <div class="stat-value${highRiskLow.length > 0 ? ' stat-alert' : ''}">${highRiskLow.length}</div>
        <div class="stat-label">High-risk areas at Level 1 or 2</div>
      </div>
    </div>

    ${highRiskLow.length > 0 ? `
      <div class="summary-block">
        <h3>Prioritised: high-risk areas requiring attention</h3>
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
      <h2>Export and Import</h2>
      <div class="export-grid">
        <div class="export-group">
          <h3>Export your assessment</h3>
          <div class="btn-group">
            <button id="exp-json" class="btn btn-secondary">Download JSON</button>
            <button id="exp-csv"  class="btn btn-secondary">Download CSV</button>
            <button id="exp-print" class="btn btn-secondary">Print / Save as PDF</button>
          </div>
        </div>
        <div class="export-group">
          <h3>Import a saved assessment</h3>
          <div class="btn-group">
            <label class="btn btn-secondary" style="cursor:pointer;">
              Import JSON
              <input type="file" id="imp-file" accept=".json" style="display:none">
            </label>
          </div>
          <p style="font-size:.78rem;color:var(--c-text-muted);margin-top:.5rem;">
            Import a JSON file previously exported from this tool.
          </p>
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
function exportJSON() {
  const payload = {
    exportedAt: new Date().toISOString(),
    tool: 'OSS Governance Diagnostic',
    role: state.role,
    areas: AREAS.map(area => ({
      id:         area.id,
      name:       area.name,
      risk:       area.risk,
      level:      state.areas[area.id]?.level  ?? null,
      levelLabel: state.areas[area.id]?.level  != null
                    ? MATURITY_LEVELS[state.areas[area.id].level]
                    : null,
      owner:      state.areas[area.id]?.owner      || '',
      nextAction: state.areas[area.id]?.nextAction || ''
    }))
  };
  downloadBlob(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
    'oss-governance-diagnostic.json'
  );
}

/* ---- Export: CSV ---- */
function exportCSV() {
  const headers = ['Area ID', 'Area Name', 'Risk Level', 'Maturity Level', 'Level Label', 'Owner / Role', 'Next Action'];
  const rows = AREAS.map(area => {
    const s = state.areas[area.id] || {};
    return [
      area.id,
      area.name,
      area.risk,
      s.level ?? '',
      s.level != null ? MATURITY_LEVELS[s.level] : '',
      s.owner      || '',
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
          state.areas[a.id] = {
            level:      a.level      ?? null,
            owner:      a.owner      ?? '',
            nextAction: a.nextAction ?? ''
          };
        }
      });

      state.started = true;
      saveState();
      render();
    } catch (_) {
      /* eslint-disable-next-line no-alert */
      alert('Could not import the file. Please make sure it is a valid OSS Governance Diagnostic JSON export.');
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
    areas:     Object.fromEntries(AREAS.map(a => [a.id, { level: null, owner: '', nextAction: '' }])),
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
        <p class="attribution">
          Based on Meagher, M. (2026),
          <em>Open Source Governance Capabilities for European SMEs</em>,
          MSc Practicum, National College of Ireland.
        </p>
        <p class="footer-links">
          <a href="LICENSE" target="_blank" rel="noopener noreferrer">MIT Licence</a>
          &middot;
          <a href="https://github.com/mickmeagher/oss-governance-diagnostic" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
        </p>
        <p class="footer-disclaimer">
          Remediation content is community-maintained; last reviewed dates are shown per item.
          This tool is a self-assessment aid and does not constitute legal advice.
        </p>
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
