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
      Columns (in order): Title | Date | Description | ImageURL | LinkURL
      File > Share > Publish to web > select sheet > CSV > Publish
      Paste the URL into ANNOUNCEMENTS_CSV below.

   3. CALENDAR:
      In Google Calendar > Settings > share with specific people / get embed code
      Paste the src= URL into GOOGLE_CALENDAR_SRC below.

================================================================ */

const CONFIG = {
  FIELD_STATUS_CSV:    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTLJNTDIV0yN6fCLPU6WkjlB_l8vSkLHaXJ-p050qznRzDl5WsVJv6lMhD5VbKHeu07cVOL29ccZGGX/pub?output=csv',
  ANNOUNCEMENTS_CSV:   'YOUR_ANNOUNCEMENTS_CSV_URL_HERE',
  GOOGLE_CALENDAR_SRC: 'YOUR_GOOGLE_CALENDAR_EMBED_SRC_HERE',
  REGISTER_URL:        'https://login.stacksports.com/login?client_id=612b0399b1854a002e427f78&redirect_uri=https://core-api.bluesombrero.com/login/redirect/portal/50583&app_name=Jackson+Soccer+Club&portalid=50583&instancekey=clubs&returnurl=%2fDefault.aspx%3ftabid%3d755727%26ctl%3dManageProgramDivisionListing%26mid%3d1504400',
  STORE_URL:           'https://www.soccer.com/club/#/2000598230/fanwear?category=Shirts',
};

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
  const pages = [
    { id: 'home',         label: 'Home',         href: 'index.html' },
    { id: 'club-info',    label: 'Club Info',     href: 'club-info.html' },
    { id: 'coaches',      label: 'Coaches',       href: 'coaches.html' },
    { id: 'travel',       label: 'Travel',        href: 'travel.html' },
    { id: 'recreational', label: 'Recreational',  href: 'recreational.html' },
    { id: 'fields',       label: 'Fields',        href: 'fields.html' },
    { id: 'calendar',     label: 'Calendar',      href: 'calendar.html' },
    { id: 'store',        label: 'Store',         href: CONFIG.STORE_URL, external: true },
  ];

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
          <img src="assets/logo.png" alt="Jackson Soccer Club Logo">
          <div class="logo-text">
            Jackson Soccer Club
            <small>Play · Train · Grow · Succeed</small>
          </div>
        </a>
        <nav class="desktop-nav" aria-label="Main navigation">
          <ul>${desktopLinks}</ul>
        </nav>
        <div style="display:flex;align-items:center;gap:0.75rem;flex-shrink:0;">
          <div class="search-wrap">
            <input type="search" id="site-search" placeholder="Search…" autocomplete="off"
              oninput="handleSearch(this.value,'search-results')"
              onfocus="handleSearch(this.value,'search-results')"
              onblur="closeSearch()"
              aria-label="Search site">
            <div id="search-results" class="search-results"></div>
          </div>
          <a href="https://www.jacksonsoccer.com/Default.aspx?tabid=717119&isLogin=True"
             target="_blank" rel="noopener" class="header-login-btn"
             style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.38rem 0.9rem;border:1px solid #555;border-radius:5px;color:#ddd;text-decoration:none;font-size:0.78rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;transition:border-color 0.15s,color 0.15s;"
             onmouseover="this.style.borderColor='#C8102E';this.style.color='#fff';"
             onmouseout="this.style.borderColor='#555';this.style.color='#ddd';">
            &#x25A1;&nbsp; Login
          </a>
          <button class="hamburger" onclick="toggleMobileNav()" aria-label="Open menu">☰</button>
        </div>
      </div>
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
            <a href="https://www.jacksonsoccer.com/Default.aspx?tabid=717119&isLogin=True"
               target="_blank" rel="noopener"
               style="color:#ccc;font-size:0.9rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
              &#x25A1;&nbsp; Login
            </a>
          </li>
        </ul>
      </nav>
    </header>
    <div class="accent-bar"></div>
  `;
}

function buildFooter() {
  return `
    <footer>
      <div class="footer-grid">
        <div>
          <div class="footer-logo-wrap">
            <img src="assets/logo.png" alt="JSC Logo">
            <div>
              <div class="footer-brand">Jackson Soccer Club</div>
              <div class="footer-tagline">Play · Train · Grow · Succeed</div>
            </div>
          </div>
          <p style="font-size:0.82rem;color:#888;line-height:1.7;margin-top:0.5rem;">
            P.O. Box 734<br>Jackson, New Jersey 08527<br>
            <a href="mailto:info@jacksonsoccer.com" style="color:#aaa;">info@jacksonsoccer.com</a>
          </p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/jacksonsoccerclub" target="_blank" rel="noopener">Facebook</a>
            <a href="https://www.instagram.com/jacksonnjsoccerclub" target="_blank" rel="noopener">Instagram</a>
            <a href="https://www.youtube.com/channel/UCjI_MBOkDDY3vLQdjor0W8Q/" target="_blank" rel="noopener">YouTube</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Club</h4>
          <ul>
            <li><a href="club-info.html">Board of Directors</a></li>
            <li><a href="coaches.html">Coaching Resources</a></li>
            <li><a href="travel.html">Travel Program</a></li>
            <li><a href="recreational.html">Recreational Soccer</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Fields</h4>
          <ul>
            <li><a href="fields.html">Field Status</a></li>
            <li><a href="fields.html#justice">Justice Complex</a></li>
            <li><a href="fields.html#jackson-mills">Jackson Mills Complex</a></li>
            <li><a href="fields.html#rental">Field Rental</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>More</h4>
          <ul>
            <li><a href="calendar.html">JSC Calendar</a></li>
            <li><a href="${CONFIG.STORE_URL}" target="_blank" rel="noopener">Club Store</a></li>
            <li><a href="mailto:info@jacksonsoccer.com">Contact Us</a></li>
            <li><a href="${CONFIG.REGISTER_URL}" target="_blank" rel="noopener">Register Now</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; ${new Date().getFullYear()} Jackson Soccer Club &middot; Jackson Township, NJ
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
        map[key] = { complex: key, address: row['Address'], updated: row['LastUpdated'], fields: [] };
        order.push(key);
      }
      if (row['FieldName']) {
        map[key].fields.push({ name: row['FieldName'], status: row['Status'], updated: row['LastUpdated'] });
      }
    }
    // Complex is Open if any field is open; Closed only if all fields are closed
    order.forEach(k => {
      const allClosed = map[k].fields.length > 0 && map[k].fields.every(f => f.status.toLowerCase() === 'closed');
      map[k].status = allClosed ? 'Closed' : 'Open';
    });
    renderFieldStatus(order.map(k => map[k]), containerId, refreshId);
  } catch (_) {
    renderFieldStatus(DEMO_FIELDS, containerId, refreshId);
  }
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
  if (CONFIG.ANNOUNCEMENTS_CSV === 'YOUR_ANNOUNCEMENTS_CSV_URL_HERE') {
    renderAnnouncements(DEMO_ANNOUNCEMENTS, containerId, countId);
    return;
  }
  try {
    const res = await fetch(CONFIG.ANNOUNCEMENTS_CSV);
    const rows = parseCSV(await res.text());
    const items = rows
      .filter(r => r['Title'])
      .map(r => ({
        title: r['Title'],
        date: r['Date'],
        description: r['Description'],
        imageUrl: r['ImageURL'],
        linkUrl: r['LinkURL'],
        emoji: '📢'
      }));
    renderAnnouncements(items.length ? items : DEMO_ANNOUNCEMENTS, containerId, countId);
  } catch (_) {
    renderAnnouncements(DEMO_ANNOUNCEMENTS, containerId, countId);
  }
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
