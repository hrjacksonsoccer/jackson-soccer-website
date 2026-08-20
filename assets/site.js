/* ================================================================
   Jackson Soccer Club — Shared Site JS
   ================================================================

   SETUP INSTRUCTIONS
   ------------------
   1. FIELD STATUS (Google Sheet):
      Columns (in order): Complex | Address | FieldName | Status | LastUpdated
      - Leave FieldName blank on the complex-level row
      - Status = "Open" or "Closed"
      File > Share > Publish to web > select sheet > CSV > Publish
      Paste the URL into FIELD_STATUS_CSV below.

   2. ANNOUNCEMENTS (Google Sheet):
      Columns (in order): Title | Date | Description | Emoji | LinkURL
      File > Share > Publish to web > select sheet > CSV > Publish
      Paste the URL into ANNOUNCEMENTS_CSV below.

   3. CALENDAR:
      In Google Calendar > Settings > share with specific people / get embed code
      Paste the src= URL into GOOGLE_CALENDAR_SRC below.

================================================================ */

const CONFIG = {
  FIELD_STATUS_CSV:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLJNTDIV0yN6fCLPU6WkjlB_l8vSkLHaXJ-p050qznRzDl5WsVJv6lMhD5VbKHeu07cVOL29ccZGGX/pub?output=csv',
  ANNOUNCEMENTS_CSV:   '',
  GOOGLE_CALENDAR_SRC: '',
  TRAVEL_TEAMS_CSV:    '',
  REGISTER_URL:        'https://login.stacksports.com/login?client_id=612b0399b1854a002e427f78&redirect_uri=https://core-api.bluesombrero.com/login/redirect/portal/50583&app_name=Jackson+Soccer+Club&portalid=50583&instancekey=clubs&returnurl=%2fDefault.aspx%3ftabid%3d755727%26ctl%3dManageProgramDivisionListing%26mid%3d1504400',
  STORE_URL:           'https://www.soccer.com/club/#/2000598230/fanwear?category=Shirts',
};

/* ── GLOBAL SITE CONTENT (nav / footer) ─────────────────────────
   These are the DEFAULTS. They are overwritten by data/site.json,
   which is what CloudCannon editors change. If the fetch fails the
   site still renders with these values.

   href / url values support two substitution tokens:
     {{STORE_URL}}    → CONFIG.STORE_URL    (from data/settings.json)
     {{REGISTER_URL}} → CONFIG.REGISTER_URL (from data/settings.json)
   so the Store / Register links stay in one place (settings.json).
──────────────────────────────────────────────────────────────── */

const SITE = {
  club_name: 'Jackson Soccer Club',
  tagline: 'Play · Train · Grow · Succeed',
  address_line1: 'P.O. Box 734',
  address_line2: 'Jackson, New Jersey 08527',
  contact_email: 'info@jacksonsoccer.com',
  login_label: 'Login',
  login_url: 'https://www.jacksonsoccer.com/Default.aspx?tabid=717119&isLogin=True',
  copyright_text: 'Jackson Soccer Club · Jackson Township, NJ',
  nav_links: [
    { id: 'home',         label: 'Home',         href: 'index.html',        external: false },
    { id: 'club-info',    label: 'Club Info',    href: 'club-info.html',    external: false },
    { id: 'coaches',      label: 'Coaches',      href: 'coaches.html',      external: false },
    { id: 'travel',       label: 'Travel',       href: 'travel.html',       external: false },
    { id: 'recreational', label: 'Recreational', href: 'recreational.html', external: false },
    { id: 'fields',       label: 'Fields',       href: 'fields.html',       external: false },
    { id: 'calendar',     label: 'Calendar',     href: 'calendar.html',     external: false },
    { id: 'store',        label: 'Store',        href: '{{STORE_URL}}',     external: true },
  ],
  social_links: [
    { label: 'Facebook',  url: 'https://www.facebook.com/jacksonsoccerclub' },
    { label: 'Instagram', url: 'https://www.instagram.com/jacksonnjsoccerclub' },
    { label: 'YouTube',   url: 'https://www.youtube.com/channel/UCjI_MBOkDDY3vLQdjor0W8Q/' },
  ],
  footer_club_heading: 'Club',
  footer_club_links: [
    { label: 'Board of Directors',  url: 'club-info.html' },
    { label: 'Coaching Resources',  url: 'coaches.html' },
    { label: 'Travel Program',      url: 'travel.html' },
    { label: 'Recreational Soccer', url: 'recreational.html' },
  ],
  footer_fields_heading: 'Fields',
  footer_fields_links: [
    { label: 'Field Status',          url: 'fields.html' },
    { label: 'Justice Complex',       url: 'fields.html#justice' },
    { label: 'Jackson Mills Complex', url: 'fields.html#jackson-mills' },
    { label: 'Field Rental',          url: 'fields.html#rental' },
  ],
  footer_more_heading: 'More',
  footer_more_links: [
    { label: 'JSC Calendar', url: 'calendar.html' },
    { label: 'Club Store',   url: '{{STORE_URL}}' },
    { label: 'Contact Us',   url: 'mailto:info@jacksonsoccer.com' },
    { label: 'Register Now', url: '{{REGISTER_URL}}' },
  ],
};

/** Replace {{STORE_URL}} / {{REGISTER_URL}} tokens in a href/url value. */
function resolveUrl(u) {
  if (!u) return '';
  return String(u)
    .replace(/\{\{\s*STORE_URL\s*\}\}/g, CONFIG.STORE_URL)
    .replace(/\{\{\s*REGISTER_URL\s*\}\}/g, CONFIG.REGISTER_URL);
}

/** True if a resolved URL should open in a new tab. */
function isExternalUrl(u) {
  return /^https?:\/\//i.test(u || '');
}

/* ── SETTINGS LOADER (CloudCannon-managed) ──────────────────── */

async function loadSettings() {
  try {
    const res = await fetch('data/settings.json');
    if (res.ok) {
      const s = await res.json();
      if (s.register_url)        CONFIG.REGISTER_URL        = s.register_url;
      if (s.store_url)           CONFIG.STORE_URL           = s.store_url;
      if (s.field_status_csv)    CONFIG.FIELD_STATUS_CSV    = s.field_status_csv;
      if (s.announcements_csv)   CONFIG.ANNOUNCEMENTS_CSV   = s.announcements_csv;
      if (s.google_calendar_src) CONFIG.GOOGLE_CALENDAR_SRC = s.google_calendar_src;
      if (s.travel_teams_csv)    CONFIG.TRAVEL_TEAMS_CSV    = s.travel_teams_csv;
    }
  } catch (_) {}

  // Global nav / footer content — loaded here so it is always populated
  // before initSite() runs on every page (no per-page changes needed).
  await loadSiteContent();
}

async function loadSiteContent() {
  try {
    const res = await fetch('data/site.json');
    if (!res.ok) return;
    const s = await res.json();
    Object.keys(s).forEach(k => {
      const v = s[k];
      if (v === null || v === undefined) return;
      if (Array.isArray(v) && !v.length) return;   // keep defaults if array emptied
      if (typeof v === 'string' && !v.trim()) return;
      SITE[k] = v;
    });
  } catch (_) {}
}

/* ── DEMO DATA ─────────────────────────────────────────────── */

const DEMO_FIELDS = [
  {
    complex: 'Justice Complex (JSC)',
    address: '1 Jackson Drive, Jackson, NJ 08527',
    status: 'Open',
    updated: 'Updated: 10/06/25 at 7:24 PM',
    fields: [
      { name: 'Field 1 – 11v11', status: 'Open', updated: '10/06/25 7:24 PM' },
      { name: 'Field 2 – 11v11', status: 'Open', updated: '10/06/25 7:24 PM' },
      { name: 'Field 3 – 9v9',   status: 'Open', updated: '10/06/25 7:24 PM' },
      { name: 'Field 4 – 7v7',   status: 'Open', updated: '10/06/25 7:24 PM' },
    ]
  },
  {
    complex: 'Jackson Mills Soccer Complex',
    address: '334 Jackson Mills Road, Jackson, NJ 08527',
    status: 'Open',
    updated: 'Updated: 07/14/20 at 11:25 AM',
    fields: [
      { name: 'Field #1 – 9v9',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #2 – 11v11', status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #3 – 9v9',   status: 'Closed', updated: '10/06/25 7:35 PM' },
      { name: 'Field #4 – 7v7',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #5 – 7v7',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #7 – 5v5',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #8 – 5v5',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #9 – 5v5',   status: 'Open',   updated: '10/06/25 7:35 PM' },
      { name: 'Field #10 – 5v5',  status: 'Open',   updated: '10/06/25 7:35 PM' },
    ]
  }
];

const DEMO_ANNOUNCEMENTS = [
  {
    title: 'Register for Fall Soccer',
    date: 'May 14, 2026',
    description: 'Fall Registration Open May 14, 2026 to Aug. 30, 2026. All levels welcome, ages 3–17.',
    imageUrl: 'assets/announce-register.png?v=2',
    linkUrl: 'https://login.stacksports.com/login?client_id=612b0399b1854a002e427f78&redirect_uri=https://core-api.bluesombrero.com/login/redirect/portal/50583&app_name=Jackson+Soccer+Club&portalid=50583&instancekey=clubs',
    emoji: '⚽'
  },
  {
    title: 'NJYS Awards JSC Coach of the Year Honors',
    date: '',
    description: 'JSC Recreational Coach Honored as New Jersey Youth Soccer Coach of the Year!',
    imageUrl: 'assets/announce-coach-award.png?v=2',
    linkUrl: 'https://www.linkedin.com/posts/congratulations-to-carolyn-orecchio-of-jackson-share-7426720922323136512-OD2q/',
    emoji: '🏅'
  },
  {
    title: 'Sunburst Tournament Champions',
    date: '',
    description: 'Congratulations 2012 TES Girls Tournament Champions',
    imageUrl: 'assets/announce-sunburst.png?v=2',
    linkUrl: '',
    emoji: '🏆'
  },
  {
    title: '2014 TES – Manalapan Tournament',
    date: '',
    description: '2014 TES Boys Manalapan Memorial Day Tournament Champions',
    imageUrl: 'assets/announce-manalapan.png?v=2',
    linkUrl: '',
    emoji: '🏆'
  },
  {
    title: 'Become a Referee',
    date: '',
    description: 'Interested in becoming a referee? Click for more information.',
    imageUrl: 'assets/announce-referee.png?v=2',
    linkUrl: 'https://www.njrefs.com/',
    emoji: '🟡'
  }
];

/* ── SEARCH INDEX ───────────────────────────────────────────── */

const SEARCH_INDEX = [
  { title: 'Home',                              url: 'index.html',                  keywords: 'home announcements news field status helpful links' },
  { title: 'Register for Fall 2026',            url: CONFIG.REGISTER_URL,           keywords: 'register registration sign up fall 2026 intramural recreational' },
  { title: 'Board of Directors',                url: 'club-info.html',              keywords: 'board directors president vice president treasurer secretary registrar commissioner robert greg ryan shaun zack lou ben anthony mary mike' },
  { title: 'Mission & Vision',                  url: 'club-info.html',              keywords: 'mission vision values positive coaching educational athletic program goals' },
  { title: 'Contact Us',                        url: 'club-info.html',              keywords: 'contact email address info@jacksonsoccer.com mailing box' },
  { title: 'Sponsors & Partners',               url: 'club-info.html',              keywords: 'sponsors partners puma centrastate lions positive coaching alliance soccer parent resource center' },
  { title: 'By-Laws & Financial Documents',     url: 'club-info.html',              keywords: 'bylaws by-laws financial transparency 990 tax return cri-200 peer mentor financial assistance' },
  { title: 'Coaches – Education & Certificates',url: 'coaches.html',               keywords: 'coaching license certificate njys f license e license d license grassroots courses' },
  { title: 'Youth Trainer Pass',                url: 'coaches.html',               keywords: 'youth trainer pass njys assistant coach 18 requirement' },
  { title: 'Coaching Education Pathway',        url: 'coaches.html',               keywords: 'coaching education pathway us soccer njys courses progression' },
  { title: 'Concussion Training',               url: 'coaches.html',               keywords: 'concussion training njys cdc awareness certification' },
  { title: 'Player Transfers',                  url: 'coaches.html',               keywords: 'player transfers njys rules process' },
  { title: 'Travel Soccer Overview',            url: 'travel.html',                keywords: 'travel teams competitive edp njys u7 u8 u9 u10 u11 u12 u13 u14 u15 u16 u17 tryouts tournament fall spring' },
  { title: 'Travel Policies & Documents',       url: 'travel.html',                keywords: 'travel policy fundraising parent handbook guidelines documents' },
  { title: 'Recreational Soccer',               url: 'recreational.html',          keywords: 'intramural recreational fall spring peanuts micro collegiate major league divisions ages 3 17 saturday' },
  { title: 'Volunteer Opportunities',           url: 'recreational.html#volunteer',keywords: 'volunteer coach volunteer opportunities help coaching' },
  { title: 'Season Dates',                      url: 'recreational.html',          keywords: 'season dates fall spring registration deadline start end schedule' },
  { title: 'Field Status',                      url: 'fields.html',                keywords: 'field status open closed live update' },
  { title: 'Justice Complex (JSC)',             url: 'fields.html#justice',        keywords: 'justice complex 1 jackson drive artificial turf 11v11 9v9 7v7 directions address' },
  { title: 'Jackson Mills Soccer Complex',      url: 'fields.html#jackson-mills-loc', keywords: 'jackson mills 334 jackson mills road fields directions address' },
  { title: 'Field Rental',                      url: 'fields.html#rental',         keywords: 'field rental permit scheduling sunrise sunset youth sports' },
  { title: 'Calendar & Meetings',               url: 'calendar.html',              keywords: 'calendar events schedule meetings membership general' },
  { title: 'Club Store',                        url: CONFIG.STORE_URL,             keywords: 'store gear jerseys shirts apparel merchandise soccer.com' },
  { title: 'Get Directions – Justice Complex',  url: 'https://maps.google.com/?q=1+Jackson+Drive+Jackson+NJ+08527', keywords: 'directions map justice complex 1 jackson drive' },
  { title: 'Get Directions – Jackson Mills',    url: 'https://maps.google.com/?q=334+Jackson+Mills+Road+Jackson+NJ+08527', keywords: 'directions map jackson mills 334 jackson mills road' },
];

function searchSite(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return SEARCH_INDEX.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.keywords.toLowerCase().includes(q)
  ).slice(0, 7);
}

function handleSearch(query, resultsId) {
  const id = resultsId || 'search-results';
  const el = document.getElementById(id);
  if (!el) return;
  const results = searchSite(query);
  if (!results.length || !query.trim()) {
    el.innerHTML = '';
    el.classList.remove('open');
    return;
  }
  el.innerHTML = results.map(r => `<a href="${r.url}">${r.title}</a>`).join('');
  el.classList.add('open');
}

function closeSearch() {
  setTimeout(() => {
    document.querySelectorAll('.search-results').forEach(el => el.classList.remove('open'));
  }, 150);
}

/* ── NAV HTML ───────────────────────────────────────────────── */

function buildHeader(activePage) {
  const pages = (SITE.nav_links || []).map(p => ({
    id: p.id || '',
    label: p.label || '',
    href: resolveUrl(p.href),
    external: p.external === true || p.external === 'true' || isExternalUrl(resolveUrl(p.href)),
  }));

  const desktopLinks = pages.map(p =>
    `<li><a href="${p.href}"${p.external ? ' target="_blank" rel="noopener"' : ''}${p.id === activePage ? ' class="active"' : ''}>${p.label}</a></li>`
  ).join('');

  const mobileLinks = pages.map(p =>
    `<li><a href="${p.href}"${p.external ? ' target="_blank" rel="noopener"' : ''}>${p.label}</a></li>`
  ).join('');

  return `
    <header>
      <div class="header-inner">
        <a href="index.html" class="site-logo">
          <img src="assets/logo.png" alt="${SITE.club_name} Logo">
          <div class="logo-text">
            ${SITE.club_name}
            <small>${SITE.tagline}</small>
          </div>
        </a>
        <div class="header-right">
          <div class="search-wrap">
            <input type="search" id="site-search" placeholder="Search…" autocomplete="off"
              oninput="handleSearch(this.value,'search-results')"
              onfocus="handleSearch(this.value,'search-results')"
              onblur="closeSearch()"
              aria-label="Search site">
            <div id="search-results" class="search-results"></div>
          </div>
          <a href="${SITE.login_url}"
             target="_blank" rel="noopener" class="header-login-btn">⬡&nbsp; ${SITE.login_label}
          </a>
          <button class="hamburger" onclick="toggleMobileNav()" aria-label="Open menu">☰</button>
        </div>
      </div>
      <nav class="main-nav-bar" aria-label="Main navigation">
        <ul>${desktopLinks}</ul>
      </nav>
      <nav id="mobile-nav" aria-label="Mobile navigation">
        <ul>
          <li class="mobile-search-li">
            <input type="search" placeholder="Search…" autocomplete="off"
              oninput="handleSearch(this.value,'mobile-search-results')"
              onfocus="handleSearch(this.value,'mobile-search-results')"
              aria-label="Search site">
            <div id="mobile-search-results" class="search-results search-results-mobile"></div>
          </li>
          ${mobileLinks}
          <li style="padding:0.7rem 0;border-top:1px solid #333;margin-top:0.25rem;">
            <a href="${SITE.login_url}"
               target="_blank" rel="noopener"
               style="color:#ccc;font-size:0.9rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
              &#x25A1;&nbsp; ${SITE.login_label}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `;
}

function buildFooter() {
  const footerList = (links) => (links || []).map(l => {
    const href = resolveUrl(l.url);
    const ext  = isExternalUrl(href) ? ' target="_blank" rel="noopener"' : '';
    return `<li><a href="${href}"${ext}>${l.label || ''}</a></li>`;
  }).join('');

  const socials = (SITE.social_links || []).map(s =>
    `<a href="${resolveUrl(s.url)}" target="_blank" rel="noopener">${s.label || ''}</a>`
  ).join('');

  return `
    <footer>
      <div class="footer-grid">
        <div>
          <div class="footer-logo-wrap">
            <img src="assets/logo.png" alt="${SITE.club_name} Logo">
            <div>
              <div class="footer-brand">${SITE.club_name}</div>
              <div class="footer-tagline">${SITE.tagline}</div>
            </div>
          </div>
          <p style="font-size:0.82rem;color:#888;line-height:1.7;margin-top:0.5rem;">
            ${SITE.address_line1}<br>${SITE.address_line2}<br>
            <a href="mailto:${SITE.contact_email}" style="color:#aaa;">${SITE.contact_email}</a>
          </p>
          <div class="footer-socials">
            ${socials}
          </div>
        </div>
        <div class="footer-col">
          <h4>${SITE.footer_club_heading}</h4>
          <ul>${footerList(SITE.footer_club_links)}</ul>
        </div>
        <div class="footer-col">
          <h4>${SITE.footer_fields_heading}</h4>
          <ul>${footerList(SITE.footer_fields_links)}</ul>
        </div>
        <div class="footer-col">
          <h4>${SITE.footer_more_heading}</h4>
          <ul>${footerList(SITE.footer_more_links)}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} ${SITE.copyright_text}
      </div>
    </footer>
  `;
}

/* ── INIT ───────────────────────────────────────────────────── */

function initSite(activePage) {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = buildHeader(activePage);
  if (footerEl) footerEl.innerHTML = buildFooter();
}

function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  if (nav) nav.classList.toggle('open');
}

/* ── CSV PARSER ─────────────────────────────────────────────── */

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = parseCSVRow(lines[0]);
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const cols = parseCSVRow(line);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (cols[i] || '').trim());
    return obj;
  });
}

function parseCSVRow(line) {
  const cols = [];
  let cur = '', inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur);
  return cols;
}

/* ── STATUS BADGE HTML ──────────────────────────────────────── */

function statusBadge(status) {
  const isOpen = status.toLowerCase() === 'open';
  const cls = isOpen ? 'badge-open' : 'badge-closed';
  return `<span class="status-badge ${cls}"><span class="status-dot"></span>${status}</span>`;
}

/* ── FIELD STATUS ───────────────────────────────────────────── */

function renderFieldStatus(complexes, containerId, refreshId) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById(refreshId);
  if (el) el.textContent = `as of ${now}`;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = complexes.map(c => `
    <div class="field-block" id="${c.complex === 'Justice Complex (JSC)' ? 'justice' : 'jackson-mills'}">
      <div class="field-block-head">
        <div>
          <div class="complex-name">${c.complex}</div>
          <div class="complex-addr">${c.address}</div>
        </div>
        ${statusBadge(c.status)}
      </div>
      ${c.updated ? `<div class="complex-updated">${c.updated}</div>` : ''}
      ${c.fields.length ? `
        <div class="field-rows">
          ${c.fields.map(f => `
            <div class="field-row">
              <div>
                <div class="field-label">${f.name}</div>
                ${f.updated ? `<div class="field-updated">${f.updated}</div>` : ''}
              </div>
              ${statusBadge(f.status)}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
}

async function loadFieldStatus(containerId, refreshId) {
  if (CONFIG.FIELD_STATUS_CSV === 'YOUR_FIELD_STATUS_CSV_URL_HERE') {
    renderFieldStatus(DEMO_FIELDS, containerId, refreshId);
    return;
  }
  try {
    const res = await fetch(CONFIG.FIELD_STATUS_CSV);
    const rawText = await res.text();
    const lines = rawText.split(/\r?\n/);
    const headerIdx = lines.findIndex(l => l.startsWith('Complex'));
    const csvToParse = headerIdx >= 0 ? lines.slice(headerIdx).join('\n') : rawText;
    const rows = parseCSV(csvToParse);
    const map = {};
    const order = [];
    for (const row of rows) {
      const key = row['Complex'];
      if (!key) continue;
      if (!map[key]) {
        map[key] = { complex: key, address: row['Address'], updated: row['LastUpdated'], override: null, fields: [] };
        order.push(key);
      }
      if (!row['FieldName']) {
        // Blank FieldName row = complex-level master toggle
        map[key].override = row['Status'];
      } else {
        map[key].fields.push({ name: row['FieldName'], status: row['Status'], updated: row['LastUpdated'] });
      }
    }
    // Compute complex status: override takes priority, otherwise open if any field open
    order.forEach(k => {
      const c = map[k];
      if (c.override && c.override.toLowerCase() === 'closed') {
        c.status = 'Closed';
        c.fields = c.fields.map(f => ({ ...f, status: 'Closed' }));
      } else {
        const allClosed = c.fields.length > 0 && c.fields.every(f => f.status.toLowerCase() === 'closed');
        c.status = allClosed ? 'Closed' : 'Open';
      }
    });
    renderFieldStatus(order.map(k => map[k]), containerId, refreshId);
  } catch (_) {
    renderFieldStatus(DEMO_FIELDS, containerId, refreshId);
  }
}

/* ── BOARD OF DIRECTORS ─────────────────────────────────────── */

async function loadBoard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res = await fetch('data/board.json');
    if (!res.ok) return;
    const members = await res.json();

    // Create bio modal once
    if (!document.getElementById('board-bio-modal')) {
      const modal = document.createElement('div');
      modal.id = 'board-bio-modal';
      modal.innerHTML = `
        <div class="bbm-overlay"></div>
        <div class="bbm-box">
          <button class="bbm-close">✕</button>
          <div class="bbm-header">
            <img class="bbm-photo" src="" alt="" style="display:none;">
            <div>
              <div class="bbm-name"></div>
              <div class="bbm-role"></div>
            </div>
          </div>
          <div class="bbm-bio"></div>
        </div>`;
      document.body.appendChild(modal);
      const close = () => { modal.classList.remove('bbm-open'); document.body.style.overflow = ''; };
      modal.querySelector('.bbm-overlay').addEventListener('click', close);
      modal.querySelector('.bbm-close').addEventListener('click', close);
    }

    const PREVIEW_LEN = 120;
    function avatarHTML(m, idx) {
      if (m.photo) return `<img class="board-avatar board-avatar--photo board-avatar--clickable" src="${m.photo}" alt="${m.name}" data-idx="${idx}">`;
      const initials = m.name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0, 2);
      return `<div class="board-avatar board-avatar--initials">${initials}</div>`;
    }

    container.innerHTML = members.map((m, i) => m.open ? `
      <div class="board-card open-seat">
        <div class="board-card-top">
          <div class="board-avatar board-avatar--initials" style="opacity:0.4;">${m.name.split(' ').map(w => w[0]).filter(Boolean).join('').slice(0,2) || '?'}</div>
          <div>
            <div class="board-name">${m.name}</div>
            <div class="board-role">${m.role || ''}</div>
          </div>
        </div>
      </div>
    ` : `
      <div class="board-card">
        <div class="board-card-top">
          ${avatarHTML(m, i)}
          <div>
            <div class="board-name">${m.name}</div>
            <div class="board-role">${m.role || ''}</div>
          </div>
        </div>
        ${m.bio ? `
          <div class="board-bio">${m.bio.length > PREVIEW_LEN ? m.bio.slice(0, PREVIEW_LEN).trimEnd() + '…' : m.bio}</div>
          ${m.bio.length > PREVIEW_LEN ? `<button class="board-bio-more" data-idx="${i}">Read more →</button>` : ''}
        ` : ''}
        ${m.email ? `<a class="board-email" href="mailto:${m.email}">Email</a>` : ''}
      </div>
    `).join('');

    // Wire up photo click to enlarge photo in lightbox
    if (!document.getElementById('photo-lightbox')) {
      const lb = document.createElement('div');
      lb.id = 'photo-lightbox';
      lb.innerHTML = `<div class="plb-overlay"></div><div class="plb-box"><button class="plb-close">✕</button><img class="plb-img" src="" alt=""></div>`;
      document.body.appendChild(lb);
      const closeLb = () => { lb.classList.remove('plb-open'); document.body.style.overflow = ''; };
      lb.querySelector('.plb-overlay').addEventListener('click', closeLb);
      lb.querySelector('.plb-close').addEventListener('click', closeLb);
    }

    container.querySelectorAll('.board-avatar--clickable').forEach(img => {
      img.addEventListener('click', () => {
        const lb = document.getElementById('photo-lightbox');
        lb.querySelector('.plb-img').src = img.src;
        lb.querySelector('.plb-img').alt = img.alt;
        lb.classList.add('plb-open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Wire up "Read more" buttons to open bio modal
    function openModal(m) {
      const modal = document.getElementById('board-bio-modal');
      modal.querySelector('.bbm-name').textContent = m.name;
      modal.querySelector('.bbm-role').textContent = m.role || '';
      modal.querySelector('.bbm-bio').textContent = m.bio || '';
      const modalPhoto = modal.querySelector('.bbm-photo');
      if (m.photo) {
        modalPhoto.src = m.photo;
        modalPhoto.alt = m.name;
        modalPhoto.style.display = '';
      } else {
        modalPhoto.style.display = 'none';
      }
      modal.classList.add('bbm-open');
      document.body.style.overflow = 'hidden';
    }

    // Wire up "Read more" buttons
    container.querySelectorAll('.board-bio-more').forEach(btn => {
      btn.addEventListener('click', () => openModal(members[+btn.dataset.idx]));
    });

  } catch (_) {}
}

/* ── ANNOUNCEMENTS ──────────────────────────────────────────── */

function renderAnnouncements(items, containerId, countId) {
  const MAX_ANNOUNCEMENTS = 8;
  items = items.slice(0, MAX_ANNOUNCEMENTS);
  const countEl = document.getElementById(countId);
  if (countEl) countEl.textContent = `${items.length} posted`;

  const container = document.getElementById(containerId);
  if (!container) return;

  const INTERVAL = 5000;

  // How many cards are visible at the current viewport width
  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 960) return 2;
    return 4;
  }

  function getSteps() {
    return Math.max(1, items.length - getVisibleCount() + 1);
  }

  // Build cards HTML
  const cardsHTML = items.map(a => `
    <div class="card">
      ${a.imageUrl
        ? `<div class="card-img-wrap"><img class="card-img" src="${a.imageUrl}" alt="${a.title}" loading="lazy"></div>`
        : `<div class="card-placeholder">${a.emoji || '📢'}</div>`
      }
      <div class="card-body">
        <div class="card-date">${a.date}</div>
        <div class="card-title">${a.title}</div>
        <div class="card-desc">${a.description}</div>
        ${a.linkUrl ? `<a class="card-link" href="${a.linkUrl}"${a.linkUrl.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>View Details →</a>` : ''}
      </div>
    </div>
  `).join('');

  container.outerHTML = `
    <div class="carousel-wrap" id="${containerId}-wrap">
      <div id="${containerId}" class="cards-grid">
        <div class="cards-track" id="${containerId}-track">${cardsHTML}</div>
      </div>
      <button class="carousel-btn prev" id="${containerId}-prev" aria-label="Previous">&#8249;</button>
      <button class="carousel-btn next" id="${containerId}-next" aria-label="Next">&#8250;</button>
    </div>
    <div class="carousel-dots" id="${containerId}-dots"></div>
    <div class="carousel-progress" id="${containerId}-progress" style="display:none;">
      <div class="carousel-progress-bar" id="${containerId}-bar"></div>
    </div>
  `;

  let current = 0;
  let timer;

  const track      = document.getElementById(`${containerId}-track`);
  const prevBtn    = document.getElementById(`${containerId}-prev`);
  const nextBtn    = document.getElementById(`${containerId}-next`);
  const bar        = document.getElementById(`${containerId}-bar`);
  const progressEl = document.getElementById(`${containerId}-progress`);
  const dotsEl     = document.getElementById(`${containerId}-dots`);

  function getCardWidth() {
    const card = track.querySelector('.card');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 17.6;
    return card.offsetWidth + gap;
  }

  function buildDots() {
    const steps = getSteps();
    const multiStep = steps > 1;
    // Show/hide progress bar and dots
    progressEl.style.display = multiStep ? '' : 'none';
    dotsEl.style.display     = multiStep ? '' : 'none';
    dotsEl.innerHTML = Array.from({ length: steps }, (_, i) =>
      `<button class="carousel-dot${i === current ? ' active' : ''}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`
    ).join('');
    dotsEl.querySelectorAll('.carousel-dot').forEach(d =>
      d.addEventListener('click', () => { goTo(+d.dataset.i); resetAuto(); })
    );
  }

  function goTo(idx, animate = true) {
    const steps = getSteps();
    current = Math.max(0, Math.min(idx, steps - 1));
    track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform  = `translateX(-${current * getCardWidth()}px)`;
    // Buttons always enabled — clicks use goToWrapped which loops around
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    resetBar();
  }

  function resetBar() {
    if (!bar || getSteps() <= 1) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetWidth; // force reflow
    bar.style.transition = `width ${INTERVAL}ms linear`;
    bar.style.width = '100%';
  }

  function startAuto() {
    clearInterval(timer);
    if (getSteps() <= 1) return;
    timer = setInterval(() => {
      const steps = getSteps();
      goTo(current < steps - 1 ? current + 1 : 0);
    }, INTERVAL);
  }

  function resetAuto() { clearInterval(timer); startAuto(); }

  function goToWrapped(idx) {
    const steps = getSteps();
    goTo((idx + steps) % steps);
    resetAuto();
  }

  prevBtn.addEventListener('click', () => goToWrapped(current - 1));
  nextBtn.addEventListener('click', () => goToWrapped(current + 1));

  // Pause on hover
  const wrap = document.getElementById(`${containerId}-wrap`);
  wrap.addEventListener('mouseenter', () => clearInterval(timer));
  wrap.addEventListener('mouseleave', () => startAuto());

  // Touch swipe support
  let touchStartX = 0;
  wrap.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goToWrapped(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // Recalculate on resize (e.g. rotating phone, resizing window)
  let resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, getSteps() - 1), false);
      resetAuto();
    }, 150);
  });

  buildDots();
  goTo(0, false);
  startAuto();
}

async function loadAnnouncements(containerId, countId) {
  // 1. Try data/announcements.json (CloudCannon-managed)
  try {
    const res = await fetch('data/announcements.json');
    if (res.ok) {
      const raw = await res.json();
      const items = raw
        .filter(a => a.active && a.title)
        .slice(0, 10)
        .map(a => ({
          title: a.title,
          date: a.date || '',
          description: a.description || '',
          imageUrl: a.photo || null,
          linkUrl: a.link_url || '',
          emoji: '📢'
        }));
      if (items.length) {
        renderAnnouncements(items, containerId, countId);
        return;
      }
    }
  } catch (_) {}

  // 2. Fall back to CSV if configured
  if (CONFIG.ANNOUNCEMENTS_CSV) {
    try {
      const res = await fetch(CONFIG.ANNOUNCEMENTS_CSV);
      const rows = parseCSV(await res.text());
      const items = rows
        .filter(r => r['Title'])
        .map(r => ({
          title: r['Title'],
          date: r['Date'],
          description: r['Description'],
          imageUrl: null,
          linkUrl: r['LinkURL'],
          emoji: r['Emoji'] || '📢'
        }));
      if (items.length) {
        renderAnnouncements(items, containerId, countId);
        return;
      }
    } catch (_) {}
  }

  // 3. Demo data
  renderAnnouncements(DEMO_ANNOUNCEMENTS, containerId, countId);
}

/* ── CALENDAR EMBED ─────────────────────────────────────────── */

function loadCalendar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (CONFIG.GOOGLE_CALENDAR_SRC === 'YOUR_GOOGLE_CALENDAR_EMBED_SRC_HERE') {
    container.innerHTML = `
      <div style="padding:2rem;text-align:center;color:#666;background:#f9f9f9;border-radius:8px;">
        <p style="font-size:1.5rem;margin-bottom:0.5rem;">📅</p>
        <p style="font-weight:700;margin-bottom:0.25rem;">Calendar Not Yet Configured</p>
        <p style="font-size:0.85rem;">Paste your Google Calendar embed src URL into CONFIG.GOOGLE_CALENDAR_SRC in assets/site.js</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="calendar-wrap">
      <iframe
        src="${CONFIG.GOOGLE_CALENDAR_SRC}"
        style="width:100%;height:650px;border:none;"
        title="Jackson Soccer Club Calendar">
      </iframe>
    </div>`;
}

/* ── PRACTICE SCHEDULE ──────────────────────────────────────── */

const PRACTICE_SCHEDULE_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSwq5L_mTvhaOXzfJOfLhwu37TF_Qu7bFwSnYSKJTsEZ7EJMRMyEZ7x_UXG2xgYqeiEWY44tcDLB575/pubhtml?gid=939394155&single=true&widget=false&headers=false';

async function loadPracticeSchedule(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '<p style="color:#888;padding:0.5rem 0;">Loading schedule…</p>';

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

  function fallback() {
    el.innerHTML = `
      <div style="text-align:center;padding:2rem 1rem;">
        <p style="color:#666;margin-bottom:1.25rem;">Tap below to view the full practice schedule.</p>
        <a href="${PRACTICE_SCHEDULE_URL}" target="_blank" rel="noopener"
           style="display:inline-block;background:var(--red);color:#fff;padding:0.75rem 2rem;border-radius:8px;font-weight:700;text-decoration:none;font-size:1rem;">
          📅 Open Practice Schedule →
        </a>
      </div>`;
  }

  try {
    const res = await fetch(PRACTICE_SCHEDULE_URL);
    if (!res.ok) throw new Error();
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allRows = Array.from(doc.querySelectorAll('tbody tr'));
    if (!allRows.length) throw new Error();

    // Color map from getComputedStyle on live sheet — covers all sN classes in this sheet
    const classMap = {
      s1:  { bg: 'rgb(153,153,153)', fg: null,    bold: true  },
      s3:  { bg: 'rgb(39,78,19)',    fg: '#ffffff', bold: true  },
      s6:  { bg: 'rgb(146,208,80)',  fg: null,    bold: true  },
      s8:  { bg: 'rgb(146,208,80)',  fg: null,    bold: true  },
      s10: { bg: 'rgb(255,255,0)',   fg: null,    bold: true  },
      s12: { bg: 'rgb(0,0,0)',       fg: '#ffffff', bold: true  },
      s13: { bg: 'rgb(0,255,0)',     fg: null,    bold: true  },
      s14: { bg: 'rgb(255,255,0)',   fg: null,    bold: true  },
      s15: { bg: 'rgb(255,255,0)',   fg: null,    bold: true  },
      s17: { bg: 'rgb(255,0,0)',     fg: '#ffffff', bold: true  },
      s23: { bg: 'rgb(0,255,0)',     fg: null,    bold: true  },
      s24: { bg: 'rgb(153,153,153)', fg: null,    bold: false },
      s33: { bg: 'rgb(0,255,0)',     fg: null,    bold: true  },
    };

    // Group rows by day; skip rows where every cell is empty text
    const groups = {};
    DAYS.forEach(d => groups[d] = []);
    let currentDay = null;
    allRows.forEach(row => {
      const text = row.textContent.trim();
      const match = DAYS.find(d => text.includes(d));
      if (match) currentDay = match;
      const hasContent = Array.from(row.querySelectorAll('td')).some(td => td.textContent.replace(/[\s ]+/g, '') !== '');
      if (currentDay && hasContent) groups[currentDay].push(row);
    });

    const tabBtns = DAYS.map((d, i) =>
      `<button class="sched-tab${i===0?' active':''}" data-day="${d}">${d.slice(0,3).toUpperCase()}</button>`
    ).join('');

    const WHITE = /^(#fff(fff)?|rgb\(255,\s*255,\s*255\)|white)$/i;

    const panels = DAYS.map((d, i) => {
      const rows = groups[d];
      if (!rows.length) return `<div class="sched-panel${i===0?' active':''}" data-day="${d}"><p style="color:#888;padding:1rem 0;">No schedule listed for ${d}.</p></div>`;
      const tableRows = rows.map(r => {
        const cells = Array.from(r.querySelectorAll('td')).map(td => {
          const cs = td.getAttribute('colspan') ? ` colspan="${td.getAttribute('colspan')}"` : '';
          const rs = td.getAttribute('rowspan') ? ` rowspan="${td.getAttribute('rowspan')}"` : '';
          const txt = td.textContent.trim();
          const sClass = ((td.getAttribute('class') || '').split(/\s+/).find(c => /^s\d+$/.test(c)) || '');
          const cm  = classMap[sClass] || {};
          let style = '';
          if (cm.bg && !WHITE.test(cm.bg)) style += `background-color:${cm.bg};`;
          if (cm.fg && !/^(#000(000)?|rgb\(0,\s*0,\s*0\)|black)$/i.test(cm.fg)) style += `color:${cm.fg};`;
          if (cm.bold) style += 'font-weight:700;';
          return `<td${cs}${rs}${style ? ` style="${style}"` : ''}>${txt}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `
        <div class="sched-panel${i===0?' active':''}" data-day="${d}">
          <div class="sched-scroll">
            <table class="sched-table"><tbody>${tableRows}</tbody></table>
          </div>
        </div>`;
    }).join('');

    el.innerHTML = `
      <div class="sched-tabs">${tabBtns}</div>
      <div class="sched-panels">${panels}</div>
      <p style="font-size:0.78rem;color:#aaa;margin-top:0.75rem;text-align:right;">
        <a href="${PRACTICE_SCHEDULE_URL}" target="_blank" rel="noopener" style="color:#aaa;">Open full schedule ↗</a>
      </p>`;

    el.querySelectorAll('.sched-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.sched-tab').forEach(b => b.classList.remove('active'));
        el.querySelectorAll('.sched-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        el.querySelector(`.sched-panel[data-day="${btn.dataset.day}"]`).classList.add('active');
      });
    });

  } catch(_) { fallback(); }
}

/* ── CALENDAR CONTENT ───────────────────────────────────────── */

async function loadCalendarContent(bannerId, scheduleId) {
  try {
    const res = await fetch('data/calendar.json');
    if (!res.ok) return;
    const d = await res.json();

    // Update meeting dates banner
    const banner = document.getElementById(bannerId);
    if (banner && d.meeting_dates) {
      const intro = d.meeting_intro || 'General Membership Meetings are held at Jackson Township Senior Center (8–9 PM) on:';
      banner.innerHTML = `📅 <strong>Upcoming:</strong> ${intro} ${d.meeting_dates}`;
    }

    // Render season schedule
    const el = document.getElementById(scheduleId);
    if (!el) return;
    let html = '';
    (d.seasons || []).forEach(s => {
      html += `<h3>${s.season_name || ''}</h3><ul>${(s.bullets||[]).map(b=>`<li>${b}</li>`).join('')}</ul>`;
    });
    if (d.game_day_bullets && d.game_day_bullets.length) {
      html += `<h3>Game Day</h3><ul>${d.game_day_bullets.map(b=>`<li>${b}</li>`).join('')}</ul>`;
    }
    el.innerHTML = html;
  } catch(_) {}
}

/* ── SHARED LINK-LIST RENDERERS ──────────────────────────────── */

/**
 * Render an array of {label, url} into a container by id.
 * cls        — CSS class for each link ('doc-link' or 'ext-link')
 * plainWhenNoUrl — if true, entries with an empty url render as a
 *                  non-clickable <span class="{cls} {cls}--plain">
 */
function renderLinkList(containerId, links, cls, plainWhenNoUrl) {
  const el = document.getElementById(containerId);
  if (!el || !Array.isArray(links) || !links.length) return;
  el.innerHTML = links.map(l => {
    const label = l.label || '';
    const url   = resolveUrl(l.url);
    if (!url) {
      return plainWhenNoUrl
        ? `<span class="${cls} ${cls}--plain">${label}</span>`
        : '';
    }
    const ext = isExternalUrl(url) ? ' target="_blank" rel="noopener"' : '';
    return `<a class="${cls}" href="${url}"${ext}>${label}</a>`;
  }).join('');
}

/* ── COACHES CONTENT ─────────────────────────────────────────── */

async function loadCoachesContent() {
  try {
    const res = await fetch('data/coaches.json');
    if (!res.ok) return;
    const d = await res.json();

    renderLinkList('coaches-available-courses',    d.available_courses,       'doc-link', false);
    renderLinkList('coaches-additional-resources', d.additional_resources,    'ext-link', false);
    renderLinkList('coaches-youth-trainer-links',  d.youth_trainer_links,     'ext-link', false);
    renderLinkList('coaches-pathway-links',        d.education_pathway_links, 'ext-link', false);

    const njysEl = document.getElementById('coaches-njys-email');
    if (njysEl && d.njys_contact_email)
      njysEl.innerHTML = `For questions about NJYS Coaching Schools, email <a href="mailto:${d.njys_contact_email}">${d.njys_contact_email}</a>.`;

    const ctaEl = document.getElementById('coaches-volunteer-cta');
    if (ctaEl && d.volunteer_cta_email)
      ctaEl.innerHTML = `💡 <strong>Want to volunteer?</strong> ${d.volunteer_cta_text || ''} <a href="mailto:${d.volunteer_cta_email}">${d.volunteer_cta_link_label || 'Email us to get started.'}</a>`;

    const ytEl = document.getElementById('youth-trainer-bullets');
    if (ytEl && d.youth_trainer_bullets)
      ytEl.innerHTML = d.youth_trainer_bullets.map(b=>`<li>${b}</li>`).join('');

    const recEl = document.getElementById('rec-coach-bullets');
    if (recEl && d.rec_coach_bullets)
      recEl.innerHTML = d.rec_coach_bullets.map(b=>`<li>${b}</li>`).join('');

    const trvEl = document.getElementById('travel-coach-bullets');
    if (trvEl && d.travel_coach_bullets)
      trvEl.innerHTML = d.travel_coach_bullets.map(b=>`<li>${b}</li>`).join('');

    const dirEl = document.getElementById('director-contact');
    if (dirEl && d.director_name)
      dirEl.innerHTML = `<h3>${d.director_name}</h3><p>Director of Coaching<br><a href="mailto:${d.director_email}">${d.director_email}</a></p>`;
  } catch(_) {}
}

/* ── CLUB INFO / MISSION ─────────────────────────────────────── */

async function loadMissionContent(containerId) {
  try {
    const res = await fetch('data/club-info.json');
    if (!res.ok) return;
    const d = await res.json();

    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = `
        ${d.mission_intro ? `<p>${d.mission_intro}</p>` : ''}
        ${d.mission_bullets ? `<ul>${d.mission_bullets.map(b=>`<li>${b}</li>`).join('')}</ul>` : ''}
        ${d.mission_closing ? `<p>${d.mission_closing}</p>` : ''}
        ${d.coaching_statement ? `<p>${d.coaching_statement}</p>` : ''}`;
    }

    const mailingEl = document.getElementById('club-mailing-address');
    if (mailingEl && d.mailing_address)
      mailingEl.innerHTML = d.mailing_address.split('\n').join('<br>');

    const generalEl = document.getElementById('club-contact-general');
    if (generalEl && d.general_email)
      generalEl.innerHTML = `<a href="mailto:${d.general_email}">${d.general_email}</a>`;

    const travelEl = document.getElementById('club-contact-travel');
    if (travelEl && d.travel_commissioner_name) {
      const tEmail = d.travel_commissioner_email
        ? ` <a href="mailto:${d.travel_commissioner_email}">${d.travel_commissioner_email}</a>`
        : '';
      travelEl.innerHTML = `Contact <strong>${d.travel_commissioner_name}</strong> (Overall Commissioner)<br>for general travel info and field scheduling.${tEmail}`;
    }

    const boardIntroEl = document.getElementById('club-board-intro');
    if (boardIntroEl && d.board_intro) boardIntroEl.textContent = d.board_intro;

    const finEl = document.getElementById('club-financial-text');
    if (finEl && d.financial_transparency_text) finEl.textContent = d.financial_transparency_text;

    const govDocsEl = document.getElementById('club-governing-docs');
    if (govDocsEl && d.governing_docs)
      govDocsEl.innerHTML = d.governing_docs.map(f => `<a class="doc-link" href="${f.url}" target="_blank" rel="noopener">📄 ${f.label}</a>`).join('');

    renderLinkList('club-assistance-links', d.assistance_links, 'ext-link', false);

    const sponsorsIntroEl = document.getElementById('club-sponsors-intro');
    if (sponsorsIntroEl && d.sponsors_intro) sponsorsIntroEl.textContent = d.sponsors_intro;

    const sponsorsEl = document.getElementById('club-sponsors-grid');
    if (sponsorsEl && Array.isArray(d.sponsors) && d.sponsors.length)
      sponsorsEl.innerHTML = d.sponsors
        .filter(s => s.logo_url || s.name)
        .map(s => `
          <a href="${s.url || '#'}"${isExternalUrl(s.url) ? ' target="_blank" rel="noopener"' : ''} title="${s.name || ''}">
            <img src="${s.logo_url || ''}" alt="${s.name || ''}">
          </a>`).join('');
  } catch(_) {}
}

/* ── RECREATIONAL CONTENT ────────────────────────────────────── */

async function loadRecreationalContent() {
  try {
    const res = await fetch('data/recreational.json');
    if (!res.ok) return;
    const d = await res.json();

    const aboutIntroEl = document.getElementById('rec-about-intro');
    if (aboutIntroEl && d.about_intro) aboutIntroEl.textContent = d.about_intro;

    const aboutEl = document.getElementById('rec-about-bullets');
    if (aboutEl && d.about_bullets)
      aboutEl.innerHTML = d.about_bullets.map(b => `<li>${b}</li>`).join('');

    const volEl = document.getElementById('rec-volunteer-cta');
    if (volEl && d.volunteer_email)
      volEl.innerHTML = `🙋 <strong>We need volunteer coaches at every level — no experience required!</strong><br>
        ${d.volunteer_text || ''}<br><br>
        <a href="mailto:${d.volunteer_email}" style="color:#fff;font-weight:700;">${d.volunteer_link_label || 'Email us to volunteer →'}</a>`;

    const divEl = document.getElementById('rec-divisions-table');
    if (divEl && Array.isArray(d.divisions) && d.divisions.length)
      divEl.innerHTML = d.divisions.map(r => `
        <tr>
          <td><strong>${r.division || ''}</strong></td>
          <td>${r.ages || ''}</td>
          <td>${r.format || ''}</td>
          <td>${r.schedule || ''}</td>
        </tr>`).join('');

    const divNoteEl = document.getElementById('rec-divisions-note');
    if (divNoteEl && d.divisions_note) divNoteEl.textContent = d.divisions_note;

    const ctaHeadEl = document.getElementById('rec-cta-heading');
    if (ctaHeadEl && d.cta_heading) ctaHeadEl.textContent = d.cta_heading;

    const ctaSubEl = document.getElementById('rec-cta-subtext');
    if (ctaSubEl && d.cta_subtext) ctaSubEl.innerHTML = d.cta_subtext;

    const ctaBtnEl = document.getElementById('rec-register-btn');
    if (ctaBtnEl) {
      ctaBtnEl.href = CONFIG.REGISTER_URL;
      if (d.register_button_text) ctaBtnEl.textContent = d.register_button_text;
    }

    const regHighlightEl = document.getElementById('rec-register-highlight');
    if (regHighlightEl && d.register_highlight)
      regHighlightEl.innerHTML = `⚠️ ${d.register_highlight}`;

    const providesEl = document.getElementById('rec-club-provides');
    if (providesEl && d.club_provides)
      providesEl.innerHTML = d.club_provides.map(b => `<li>${b}</li>`).join('');

    const bringEl = document.getElementById('rec-players-bring');
    if (bringEl && d.players_bring)
      bringEl.innerHTML = d.players_bring.map(b => `<li>${b}</li>`).join('');

    const placementEl = document.getElementById('rec-placement-bullets');
    if (placementEl && d.team_placement_bullets)
      placementEl.innerHTML = d.team_placement_bullets.map(b => `<li>${b}</li>`).join('');

    const waitlistEl = document.getElementById('rec-waitlist-text');
    if (waitlistEl && d.waitlist_text)
      waitlistEl.innerHTML = d.waitlist_text.split('\n\n').map(p => `<p>${p}</p>`).join('');

    const commEl = document.getElementById('rec-commissioner');
    if (commEl && d.commissioner_name)
      commEl.innerHTML = `<strong>${d.commissioner_name}</strong>${d.commissioner_email ? ` &mdash; <a href="mailto:${d.commissioner_email}">${d.commissioner_email}</a>` : ''}`;
  } catch(_) {}
}

/* ── TRAVEL CONTENT ──────────────────────────────────────────── */

async function loadTravelContent() {
  try {
    const res = await fetch('data/travel.json');
    if (!res.ok) return;
    const d = await res.json();

    const overviewEl = document.getElementById('travel-overview');
    if (overviewEl && d.overview_paragraphs)
      overviewEl.innerHTML = d.overview_paragraphs.map(p => `<p>${p}</p>`).join('');

    const commEl = document.getElementById('travel-commissioner-highlight');
    if (commEl && d.commissioner_name)
      commEl.innerHTML = `📞 <strong>Contact the Overall Commissioner for general travel information and field scheduling:</strong><br>${d.commissioner_name} — <a href="mailto:${d.commissioner_email}">${d.commissioner_email}</a>`;

    const tryoutsEl = document.getElementById('travel-tryouts');
    if (tryoutsEl && d.tryouts_text)
      tryoutsEl.innerHTML = `<p>${d.tryouts_text}</p>`;

    const tryoutsCtaEl = document.getElementById('travel-tryouts-cta');
    if (tryoutsCtaEl && d.commissioner_email)
      tryoutsCtaEl.innerHTML = `📋 <strong>Questions about tryouts?</strong> Contact the Overall Commissioner ${d.commissioner_name || ''} at <a href="mailto:${d.commissioner_email}" style="color:#fff;">${d.commissioner_email}</a>`;

    const leaguesIntroEl = document.getElementById('travel-leagues-intro');
    if (leaguesIntroEl && d.leagues_intro) leaguesIntroEl.textContent = d.leagues_intro;

    // Leagues without a URL render as plain (non-clickable) chips.
    renderLinkList('travel-leagues', d.leagues, 'ext-link', true);

    const boysNoteEl = document.getElementById('travel-boys-note');
    if (boysNoteEl && d.boys_teams_note_email)
      boysNoteEl.innerHTML = `Current season roster. For the most current info contact <a href="mailto:${d.boys_teams_note_email}">${d.boys_teams_note_email}</a>.`;

    const tecnicaEl = document.getElementById('travel-tecnica');
    if (tecnicaEl && d.tecnica_description)
      tecnicaEl.innerHTML = `<p>${d.tecnica_description}</p>${d.tecnica_philosophy ? `<p><strong>Our Philosophy:</strong> ${d.tecnica_philosophy}</p>` : ''}`;

    const tecnicaLinkEl = document.getElementById('travel-tecnica-link');
    if (tecnicaLinkEl && d.tecnica_url)
      tecnicaLinkEl.innerHTML = `<a class="doc-link" href="${d.tecnica_url}" target="_blank" rel="noopener">${d.tecnica_link_label || d.tecnica_url}</a>`;

    const tecnicaNoteEl = document.getElementById('travel-tecnica-social');
    if (tecnicaNoteEl && d.tecnica_social_note) tecnicaNoteEl.innerHTML = d.tecnica_social_note;

    renderLinkList('travel-resource-forms',   d.resource_forms,   'doc-link', false);
    renderLinkList('travel-accounting-forms', d.accounting_forms, 'doc-link', false);
    renderLinkList('travel-policy-docs',      d.policy_docs,      'doc-link', false);

    const policyNoteEl = document.getElementById('travel-policy-note');
    if (policyNoteEl && d.policy_docs_note_email)
      policyNoteEl.innerHTML = `Note: Document links will be updated each season. Contact <a href="mailto:${d.policy_docs_note_email}">${d.policy_docs_note_email}</a> if you cannot access a document.`;
  } catch(_) {}
}

/* ── FIELDS CONTENT ──────────────────────────────────────────── */

async function loadFieldsContent() {
  try {
    const res = await fetch('data/fields.json');
    if (!res.ok) return;
    const d = await res.json();

    const rentalEl = document.getElementById('fields-rental-info');
    if (rentalEl && d.rental_info) {
      let html = d.rental_info.split('\n\n').map(p => `<p>${p}</p>`).join('');
      if (d.rental_email)
        html += `<div class="highlight">📧 For field rental inquiries, contact: <a href="mailto:${d.rental_email}">${d.rental_email}</a></div>`;
      rentalEl.innerHTML = html;
    }

    const justiceEl = document.getElementById('fields-justice-location');
    if (justiceEl && d.justice_address)
      justiceEl.innerHTML = `${d.justice_address.split('\n').join('<br>')}<br><br><a href="${d.justice_map_url}" target="_blank" rel="noopener">View on Google Maps →</a>`;

    const millsEl = document.getElementById('fields-mills-location');
    if (millsEl && d.mills_address)
      millsEl.innerHTML = `${d.mills_address.split('\n').join('<br>')}<br><br><a href="${d.mills_map_url}" target="_blank" rel="noopener">View on Google Maps →</a>`;
  } catch(_) {}
}

/* ── HOMEPAGE CONTENT ────────────────────────────────────────── */

async function loadHomepageContent() {
  try {
    const res = await fetch('data/homepage.json');
    if (!res.ok) return;
    const d = await res.json();

    const subtextEl = document.getElementById('hero-subtext');
    if (subtextEl && d.hero_subtext)
      subtextEl.textContent = d.hero_subtext;

    const heroBtnEl = document.getElementById('hero-register-btn');
    if (heroBtnEl) {
      heroBtnEl.href = CONFIG.REGISTER_URL;
      if (d.register_button_text) heroBtnEl.textContent = d.register_button_text;
    }

    const linksEl = document.getElementById('helpful-links-list');
    if (linksEl && d.helpful_links)
      linksEl.innerHTML = d.helpful_links.map(l =>
        `<li><a href="${l.url}"${isExternalUrl(l.url) ? ' target="_blank" rel="noopener"' : ''} style="color:var(--red);font-weight:600;text-decoration:none;">${l.emoji ? l.emoji + ' ' : ''}${l.label}</a></li>`
      ).join('');

    const dirEl = document.getElementById('homepage-directions');
    if (dirEl && Array.isArray(d.directions) && d.directions.length)
      dirEl.innerHTML = d.directions.map(l =>
        `<a href="${l.url}"${isExternalUrl(l.url) ? ' target="_blank" rel="noopener"' : ''}
            style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.9rem;background:var(--gray);border:1px solid var(--border);border-radius:7px;color:var(--text);text-decoration:none;font-size:0.88rem;font-weight:600;">
           ${l.label || ''} <span style="margin-left:auto;color:var(--red);">→</span>
         </a>`
      ).join('');
  } catch(_) {}
}

/* ── TRAVEL TEAMS ───────────────────────────────────────────── */

function renderTravelTeamsTable(rows) {
  if (!rows.length) return '<p style="color:#888;font-size:0.9rem;">No teams listed yet.</p>';
  return `
    <div style="overflow-x:auto;">
      <table class="div-table">
        <thead>
          <tr>
            <th>Age</th>
            <th>Team</th>
            <th>Birth Year</th>
            <th>League</th>
            <th>Coaches</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const coaches = [r['Coach1'], r['Coach2'], r['Coach3']].filter(Boolean);
            const emails  = [r['Email1'], r['Email2'], r['Email3']].filter(Boolean);
            const coachHTML   = coaches.join('<br>') || '—';
            const contactHTML = emails.map(e => `<a href="mailto:${e}">${e}</a>`).join('<br>') || '—';
            return `
              <tr>
                <td>${r['Age'] || ''}</td>
                <td><strong>${r['Team'] || ''}</strong></td>
                <td>${r['BirthYear'] || ''}</td>
                <td>${r['League'] || ''}</td>
                <td>${coachHTML}</td>
                <td>${contactHTML}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

async function loadTravelTeams(csvUrl) {
  const girlsEl = document.getElementById('travel-teams-girls');
  const boysEl  = document.getElementById('travel-teams-boys');
  if (!girlsEl && !boysEl) return;

  if (!csvUrl) {
    if (girlsEl) girlsEl.innerHTML = '<p style="color:#888;font-size:0.9rem;">Teams coming soon.</p>';
    if (boysEl)  boysEl.innerHTML  = '<p style="color:#888;font-size:0.9rem;">Teams coming soon.</p>';
    return;
  }

  try {
    const res  = await fetch(csvUrl);
    const rows = parseCSV(await res.text());
    const girls = rows.filter(r => r['Gender'] && r['Gender'].toLowerCase().startsWith('g'));
    const boys  = rows.filter(r => r['Gender'] && r['Gender'].toLowerCase().startsWith('b'));
    if (girlsEl) girlsEl.innerHTML = renderTravelTeamsTable(girls);
    if (boysEl)  boysEl.innerHTML  = renderTravelTeamsTable(boys);
  } catch (_) {
    if (girlsEl) girlsEl.innerHTML = '<p style="color:#888;font-size:0.9rem;">Unable to load teams. Please try again later.</p>';
    if (boysEl)  boysEl.innerHTML  = '<p style="color:#888;font-size:0.9rem;">Unable to load teams. Please try again later.</p>';
  }
}
