/* ================================================================
   Jackson Soccer Club — Halloween theme (decorations)
   Injected by site.js only during the Halloween window.
   Adds: top banner + countdown, cobwebs, dangling spider, flying
   bats, rolling fog, and a floating ghost. No external images.
   ================================================================ */
(function () {
  if (window.__hwLoaded) return;
  window.__hwLoaded = true;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  /* Countdown text */
  function countdownText() {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var hal = new Date(now.getFullYear(), 9, 31);
    var days = Math.round((hal - today) / 86400000);
    if (days > 1)  return '👻 ' + days + ' days until Halloween!';
    if (days === 1) return '👻 Halloween is TOMORROW!';
    if (days === 0) return '🎃 It’s HALLOWEEN! Good luck out there!';
    return '🎃 Hope you had a spooktacular Halloween!';
  }

  /* Hand-built cobweb: radial spokes + curved cross-threads */
  function cobwebSvg(cls) {
    var rays = [0, 22, 45, 68, 90].map(function (d) { return d * Math.PI / 180; });
    var radii = [28, 54, 80, 108];
    var d = '';
    rays.forEach(function (a) {
      d += 'M0 0 L' + (112 * Math.cos(a)).toFixed(1) + ' ' + (112 * Math.sin(a)).toFixed(1) + ' ';
    });
    radii.forEach(function (r) {
      for (var i = 0; i < rays.length - 1; i++) {
        var a1 = rays[i], a2 = rays[i + 1], mid = (a1 + a2) / 2;
        d += 'M' + (r * Math.cos(a1)).toFixed(1) + ' ' + (r * Math.sin(a1)).toFixed(1) +
             ' Q' + (r * 0.8 * Math.cos(mid)).toFixed(1) + ' ' + (r * 0.8 * Math.sin(mid)).toFixed(1) +
             ' ' + (r * Math.cos(a2)).toFixed(1) + ' ' + (r * Math.sin(a2)).toFixed(1) + ' ';
      }
    });
    return '<svg class="hw-web ' + cls + '" viewBox="0 0 120 120" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  /* ── Spooky sound (synthesized with Web Audio: no audio files) ──
     Browsers block autoplay, so the sound plays once per visit on the
     visitor's first click/tap/keypress. A speaker button mutes it for
     good (remembered in localStorage). */
  var AC = window.AudioContext || window.webkitAudioContext;
  var actx = null;

  function soundOn() {
    try { return localStorage.getItem('hw_sound') !== 'off'; } catch (e) { return true; }
  }

  /* ── Sound building blocks ── */
  function noiseBuf(sec, brown) {
    var n = Math.floor(actx.sampleRate * sec);
    var b = actx.createBuffer(1, n, actx.sampleRate);
    var d = b.getChannelData(0), last = 0;
    for (var i = 0; i < n; i++) {
      var w = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else d[i] = w;
    }
    return b;
  }

  function impulse(sec) {
    var n = Math.floor(actx.sampleRate * sec);
    var b = actx.createBuffer(2, n, actx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6);
    }
    return b;
  }

  /* One lightning strike: sharp crack + crackle + long rolling rumble */
  function thunder(t, vol, out) {
    var crack = actx.createBufferSource();
    crack.buffer = noiseBuf(0.5, false);
    var hp = actx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 1800;
    var cg = actx.createGain();
    cg.gain.setValueAtTime(0.0001, t);
    cg.gain.linearRampToValueAtTime(vol * 0.9, t + 0.008);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    crack.connect(hp); hp.connect(cg); cg.connect(out);
    crack.start(t); crack.stop(t + 0.5);

    /* crackle: a few tiny bursts right after the crack */
    [0.12, 0.2, 0.31, 0.38, 0.52].forEach(function (dt) {
      var s = actx.createBufferSource();
      s.buffer = noiseBuf(0.08, false);
      var f = actx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 2500 + Math.random() * 2500; f.Q.value = 0.8;
      var g = actx.createGain();
      g.gain.setValueAtTime(vol * 0.35, t + dt);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.07);
      s.connect(f); f.connect(g); g.connect(out);
      s.start(t + dt); s.stop(t + dt + 0.1);
    });

    /* rumble */
    var rum = actx.createBufferSource();
    rum.buffer = noiseBuf(4.5, true);
    var lp = actx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(700, t + 0.05);
    lp.frequency.exponentialRampToValueAtTime(70, t + 4.2);
    var rg = actx.createGain();
    rg.gain.setValueAtTime(0.0001, t + 0.05);
    rg.gain.linearRampToValueAtTime(vol * 1.7, t + 0.3);
    /* rolling ripples as the thunder fades */
    rg.gain.linearRampToValueAtTime(vol * 0.9, t + 0.9);
    rg.gain.linearRampToValueAtTime(vol * 1.3, t + 1.5);
    rg.gain.linearRampToValueAtTime(vol * 0.5, t + 2.4);
    rg.gain.linearRampToValueAtTime(vol * 0.7, t + 2.9);
    rg.gain.linearRampToValueAtTime(0.0001, t + 4.4);
    rum.connect(lp); lp.connect(rg); rg.connect(out);
    rum.start(t + 0.05); rum.stop(t + 4.5);
  }

  /* Long, wavering ghostly "ooooOOOOooo" (two slightly detuned voices) */
  function ghostOoo(t, len, out) {
    [0, 9].forEach(function (cents, idx) {
      var o = actx.createOscillator();
      o.type = 'triangle';
      o.detune.value = cents;
      o.frequency.setValueAtTime(290, t);
      o.frequency.linearRampToValueAtTime(430, t + len * 0.25);
      o.frequency.linearRampToValueAtTime(690, t + len * 0.5);
      o.frequency.linearRampToValueAtTime(520, t + len * 0.72);
      o.frequency.linearRampToValueAtTime(300, t + len);
      var lfo = actx.createOscillator();
      lfo.frequency.setValueAtTime(4.2, t);
      lfo.frequency.linearRampToValueAtTime(6.5, t + len);
      var lg = actx.createGain();
      lg.gain.setValueAtTime(5, t);
      lg.gain.linearRampToValueAtTime(34, t + len * 0.6);
      lfo.connect(lg); lg.connect(o.frequency);
      var lp = actx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 1500;
      var g = actx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.2, t + len * 0.35);
      g.gain.linearRampToValueAtTime(0.24, t + len * 0.55);
      g.gain.linearRampToValueAtTime(0.0001, t + len);
      o.connect(lp); lp.connect(g); g.connect(out);
      o.start(t); lfo.start(t);
      o.stop(t + len + 0.1); lfo.stop(t + len + 0.1);
    });
  }

  /* One witch "heh": sawtooth through nasal formants + a breath of noise */
  function heh(t, f, len, out, opts) {
    opts = opts || {};
    var o = actx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(f * (opts.fall || 0.8), t + len);
    var vib = actx.createOscillator();
    vib.frequency.value = opts.vibHz || 0.1;
    var vg = actx.createGain();
    vg.gain.value = opts.vibDepth || 0;
    vib.connect(vg); vg.connect(o.frequency);

    var f1 = actx.createBiquadFilter();
    f1.type = 'bandpass'; f1.Q.value = 5;
    f1.frequency.setValueAtTime(opts.f1 || 760, t);
    var f2 = actx.createBiquadFilter();
    f2.type = 'bandpass'; f2.Q.value = 6;
    f2.frequency.setValueAtTime(opts.f2 || 2100, t);
    if (opts.sweep) {
      f1.frequency.linearRampToValueAtTime(opts.f1 * 0.7, t + len);
      f2.frequency.linearRampToValueAtTime(opts.f2 * 0.75, t + len);
    }
    var env = actx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(opts.peak || 1, t + 0.02);
    if (opts.sustain) {
      env.gain.setValueAtTime(opts.peak || 1, t + len * 0.55);
    }
    env.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(f1); o.connect(f2);
    f1.connect(env); f2.connect(env);
    env.connect(out);
    o.start(t); vib.start(t);
    o.stop(t + len + 0.05); vib.stop(t + len + 0.05);

    var br = actx.createBufferSource();
    br.buffer = noiseBuf(len + 0.05, false);
    var bf = actx.createBiquadFilter();
    bf.type = 'bandpass'; bf.frequency.value = 3200; bf.Q.value = 0.7;
    var bg = actx.createGain();
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.linearRampToValueAtTime(0.1, t + 0.02);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + len);
    br.connect(bf); bf.connect(bg); bg.connect(out);
    br.start(t); br.stop(t + len + 0.05);
  }

  /* Screen flash for each lightning strike (single soft flash, well under
     the 3-flashes-per-second accessibility limit; skipped if reduced-motion) */
  function lightningFlash() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    } catch (e) {}
    var f = el('div', 'hw-flash');
    f.setAttribute('aria-hidden', 'true');
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 1100);
  }

  /* Recorded clip: fetched + decoded once, then reused */
  var clipPromise = null;
  function loadClip() {
    if (clipPromise) return clipPromise;
    clipPromise = fetch('assets/halloween-sound.mp3?v=1')
      .then(function (r) { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
      .then(function (ab) {
        return new Promise(function (res, rej) { actx.decodeAudioData(ab, res, rej); });
      })
      .catch(function () { return null; });
    return clipPromise;
  }

  /* Synthesized fallback: long "ooo" + witch cackle + second thunder */
  function synthVoices(ts, voices, master) {
    ghostOoo(ts, 4.2, voices);
    var tc = ts + 3.5;
    var pitches = [600, 650, 700, 750, 790, 770, 730, 690, 650];
    var gap = 0.23;
    pitches.forEach(function (f) {
      heh(tc, f, 0.15, voices, { fall: 0.8, f1: 760, f2: 2200, peak: 1 });
      tc += gap;
      gap = Math.max(0.13, gap - 0.011);
    });
    heh(tc + 0.02, 820, 1.4, voices,
        { fall: 0.38, f1: 900, f2: 2300, sweep: true, sustain: true, peak: 1,
          vibHz: 7.5, vibDepth: 28 });
    var t2 = tc + 0.4;
    thunder(t2, 0.5, master);
    setTimeout(lightningFlash, Math.max(0, (t2 - actx.currentTime) * 1000));
  }

  function playSpooky() {
    if (!AC || !soundOn()) return;
    try {
      actx = actx || new AC();
      if (actx.state === 'suspended') actx.resume();
      var t0 = actx.currentTime + 0.08;

      /* master -> compressor (prevents clipping) -> speakers */
      var comp = actx.createDynamicsCompressor();
      comp.connect(actx.destination);
      var master = actx.createGain();
      master.gain.value = 0.55;
      master.connect(comp);

      /* a little cavernous reverb for the voices */
      var verb = actx.createConvolver();
      verb.buffer = impulse(2.2);
      var wet = actx.createGain();
      wet.gain.value = 0.45;
      verb.connect(wet); wet.connect(master);
      var voices = actx.createGain();
      voices.gain.value = 1;
      voices.connect(master);   /* dry */
      voices.connect(verb);     /* wet */

      /* 1. Lightning + thunder */
      thunder(t0, 0.7, master);
      lightningFlash();

      /* 2. Your recorded ghost/witch sounds (assets/halloween-sound.mp3),
            falling back to the synthesized ooo + cackle if it can't load */
      var voicesOut = voices;
      loadClip().then(function (buf) {
        var ts = actx.currentTime + 0.7;
        if (buf) {
          var src = actx.createBufferSource();
          src.buffer = buf;
          var cg = actx.createGain();
          cg.gain.value = 1.0;
          src.connect(cg); cg.connect(master);
          src.start(ts);
          /* second distant strike near the end of the clip */
          var t2 = ts + Math.max(1, buf.duration - 2.5);
          thunder(t2, 0.5, master);
          setTimeout(lightningFlash, Math.max(0, (t2 - actx.currentTime) * 1000));
        } else {
          synthVoices(ts, voicesOut, master);
        }
      });
    } catch (e) { /* audio unavailable: stay silent */ }
  }

  function setupSound() {
    var btn = el('button', 'hw-sound', soundOn() ? '🔊' : '🔇');
    function sync() {
      btn.textContent = soundOn() ? '🔊' : '🔇';
      btn.setAttribute('aria-label', soundOn() ? 'Mute spooky sounds' : 'Unmute spooky sounds');
      btn.title = soundOn() ? 'Mute spooky sounds' : 'Unmute spooky sounds';
    }
    btn.onclick = function () {
      var next = soundOn() ? 'off' : 'on';
      try { localStorage.setItem('hw_sound', next); } catch (e) {}
      sync();
      if (next === 'on') playSpooky();
    };
    sync();
    document.body.appendChild(btn);

    /* Play once per visit on the first real interaction */
    var played = false;
    try { played = sessionStorage.getItem('hw_played') === '1'; } catch (e) {}
    if (played) return;
    function first(ev) {
      if (ev.target && ev.target.closest && ev.target.closest('.hw-sound')) return;
      ['pointerdown', 'keydown', 'touchstart'].forEach(function (n) {
        document.removeEventListener(n, first, true);
      });
      try { sessionStorage.setItem('hw_played', '1'); } catch (e) {}
      playSpooky();
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (n) {
      document.addEventListener(n, first, true);
    });
  }

  var BAT_SVG =
    '<svg viewBox="0 0 100 50" aria-hidden="true"><path d="' +
    'M46 14 L47 7 L50 12 L53 7 L54 14 ' +
    'C59 15 66 12 76 13 C72 17 72 21 73 25 C80 22 90 22 98 28 C90 28 85 31 82 36 ' +
    'C78 32 72 32 67 36 C64 32 59 31 55 34 L53 30 L50 36 L47 30 L45 34 ' +
    'C41 31 36 32 33 36 C28 32 22 32 18 36 C15 31 10 28 2 28 C10 22 20 22 27 25 ' +
    'C28 21 28 17 24 13 C34 12 41 15 46 14 Z"/></svg>';

  function start() {
    document.body.classList.add('halloween');

    /* Banner (dismissible for the session) */
    var closed = false;
    try { closed = sessionStorage.getItem('hw_banner_closed') === '1'; } catch (e) {}
    if (!closed) {
      var banner = el('div', 'hw-banner',
        '🎃 Happy Halloween from Jackson Soccer Club! &nbsp;·&nbsp; ' + countdownText() + ' 🦇');
      var x = el('button', '', '✕');
      x.setAttribute('aria-label', 'Dismiss Halloween banner');
      x.onclick = function () {
        banner.remove();
        try { sessionStorage.setItem('hw_banner_closed', '1'); } catch (e) {}
      };
      banner.appendChild(x);
      document.body.insertBefore(banner, document.body.firstChild);
    }

    /* Cobwebs + spider in the header */
    var header = document.querySelector('#site-header header');
    if (header) {
      header.insertAdjacentHTML('beforeend', cobwebSvg('hw-web-l') + cobwebSvg('hw-web-r'));
      header.appendChild(el('div', 'hw-spider',
        '<div class="hw-thread"></div><div class="hw-spider-body">🕷️</div>'));
    }

    /* Bats */
    var small = window.innerWidth < 700;
    var bats = [
      { top: 6,  w: 54, dur: 24, delay: -2,  rev: false },
      { top: 18, w: 38, dur: 31, delay: -14, rev: true  },
      { top: 34, w: 64, dur: 27, delay: -9,  rev: false },
      { top: 48, w: 42, dur: 36, delay: -22, rev: true  },
      { top: 62, w: 50, dur: 29, delay: -5,  rev: false },
      { top: 12, w: 30, dur: 40, delay: -30, rev: true  },
      { top: 74, w: 46, dur: 33, delay: -18, rev: false },
      { top: 26, w: 36, dur: 38, delay: -11, rev: true  }
    ];
    if (small) bats = bats.slice(0, 4);
    var layer = el('div', 'hw-bats');
    layer.setAttribute('aria-hidden', 'true');
    bats.forEach(function (b) {
      var bat = el('div', 'hw-bat' + (b.rev ? ' rev' : ''), BAT_SVG);
      bat.style.top = b.top + 'vh';
      bat.style.width = (small ? b.w * 0.7 : b.w) + 'px';
      bat.style.animationDuration = b.dur + 's';
      bat.style.animationDelay = b.delay + 's';
      layer.appendChild(bat);
    });
    document.body.appendChild(layer);

    /* Fog */
    var fog = el('div', 'hw-fog');
    fog.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fog);

    /* Ghost (click for a "Boo!") */
    var ghost = el('button', 'hw-ghost', '👻<span class="hw-boo">BOO!</span>');
    ghost.setAttribute('aria-label', 'Boo!');
    var t;
    ghost.onclick = function () {
      ghost.classList.add('boo');
      clearTimeout(t);
      t = setTimeout(function () { ghost.classList.remove('boo'); }, 1600);
      playSpooky();
    };
    document.body.appendChild(ghost);

    setupSound();
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
})();
