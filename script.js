'use strict';

const rows = [
  ['Native VLN', 'Clean reference', [4.58,68.2,54.1,42.3], [3.32,79.7,67.5,56.6]],
  ['Native VLN', 'Degraded', [7.34,43.0,26.8,17.3], [5.94,56.3,41.8,29.9]],
  ['AdaIR', '', [7.10,45.1,29.4,19.7], [5.82,57.2,42.7,30.5]],
  ['DCPT', '', [6.68,48.8,34.1,25.1], [5.33,62.0,47.5,36.6]],
  ['MoCE-IR-S', '', [6.08,50.9,34.8,27.8], [5.21,62.9,51.2,38.3]],
  ['DFPIR', '', [6.65,49.5,32.9,23.7], [5.46,60.9,46.2,34.9]],
  ['R2R-Compos', '', [6.52,50.5,34.5,24.8], [5.32,61.9,48.2,36.6]],
  ['DATPRL-IR', '', [6.68,49.0,33.5,23.7], [5.44,60.8,47.2,35.6]],
  ['HOGformer', '', [6.84,47.7,31.5,22.3], [5.57,60.0,44.5,33.1]],
  ['BiLaLoRA', '', [6.34,54.2,35.6,25.2], [4.86,63.1,48.8,40.1]],
  ['Raw RGB + Adapter', '', [6.35,52.4,35.3,25.2], [5.04,64.6,49.8,38.6]],
  ['Restored RGB + Adapter', '', [6.16,53.9,37.3,27.1], [4.99,66.2,50.8,39.5]],
  ['FireNav', 'Ours', [5.65,59.0,41.6,32.0], [4.53,68.8,56.1,45.5]],
];
const toast = document.querySelector('.toast');
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 5000);
}

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(expanded));
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    menuButton.focus();
  }
});

const comparisonVideos = [...document.querySelectorAll('video[data-method]')];
const playButton = document.querySelector('.play-comparison');
let comparisonEpoch = 0;
function setVideo(video, name) {
  video.pause();
  video.querySelector('source').src = `${name}.mp4`;
  video.poster = `${name}.jpg`;
  video.load();
}
function updatePlayButton() {
  const playing = comparisonVideos.some(v => !v.paused && !v.ended);
  playButton.innerHTML = `<span aria-hidden="true">${playing ? 'Ⅱ' : '▷'}</span> ${playing ? 'Pause all' : 'Play all'}`;
}
document.querySelectorAll('[data-comparison-view]').forEach(button => {
  button.addEventListener('click', () => {
    comparisonEpoch++;
    document.querySelectorAll('[data-comparison-view]').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    comparisonVideos.forEach(v => setVideo(v, `${v.dataset.method}-${button.dataset.comparisonView}`));
    updatePlayButton();
  });
});
playButton.addEventListener('click', async () => {
  if (comparisonVideos.some(v => !v.paused && !v.ended)) {
    comparisonEpoch++;
    comparisonVideos.forEach(v => v.pause());
  } else {
    const epoch = ++comparisonEpoch;
    comparisonVideos.forEach(v => { if (v.ended) v.currentTime = 0; });
    const results = await Promise.allSettled(comparisonVideos.map(v => v.play()));
    if (epoch !== comparisonEpoch) return;
    if (results.some(r => r.status === 'rejected')) notify('Use the individual video controls if your browser limits simultaneous playback.');
  }
  updatePlayButton();
});
comparisonVideos.forEach(v => ['play','pause','ended'].forEach(event => v.addEventListener(event, updatePlayButton)));
document.querySelector('#long-view').addEventListener('change', e => {
  setVideo(document.querySelector('#long-video'), e.target.value);
});
document.querySelectorAll('video').forEach(video => {
  video.addEventListener('error', () => notify('The video could not load. Please check your connection and try again.'));
});

const trackButtons = [...document.querySelectorAll('[data-track]')];
function showTrack(button, focus = false) {
  const ce = button.dataset.track === 'ce';
  trackButtons.forEach(b => {
    b.classList.toggle('active', b === button);
    b.setAttribute('aria-selected', String(b === button));
    b.tabIndex = b === button ? 0 : -1;
  });
  if (focus) button.focus();
  document.querySelector('#results-panel').setAttribute('aria-labelledby', button.id);
  document.querySelector('#results-caption').textContent = `${ce ? 'Continuous environment (CE)' : 'Physical environment (PE)'} · Unseen test · Instruction following`;
  document.querySelector('#results-body').innerHTML = rows.map((r, i) => {
    const values = r[ce ? 3 : 2];
    const cls = i === 0 ? 'reference-row' : i === 10 ? 'adapter-row' : i === 12 ? 'ours-row' : '';
    return `<tr class="${cls}"><th scope="row">${r[0]}${r[1] ? ` <span>${r[1]}</span>` : ''}</th>${values.map((v,j) => `<td>${v.toFixed(j ? 1 : 2)}</td>`).join('')}</tr>`;
  }).join('');
  document.querySelector('#stat-sr').innerHTML = `${ce ? '56.1' : '41.6'}<span>%</span>`;
  document.querySelector('#stat-spl').innerHTML = `${ce ? '45.5' : '32.0'}<span>%</span>`;
  document.querySelector('#stat-ne').innerHTML = `${ce ? '4.53' : '5.65'}<span>m</span>`;
  document.querySelector('#stat-sr-gain').textContent = `+${ce ? '14.3' : '14.8'} points vs. degraded native VLN`;
  document.querySelector('#stat-spl-gain').textContent = `+${ce ? '6.0' : '4.9'} points vs. Restored RGB + Adapter`;
  document.querySelector('#stat-ne-gain').textContent = `${ce ? '0.46' : '0.51'} m lower vs. Restored RGB + Adapter`;
}
trackButtons.forEach(button => {
  button.addEventListener('click', () => showTrack(button));
  button.addEventListener('keydown', e => {
    if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
      e.preventDefault();
      const index = e.key === 'Home' ? 0 : e.key === 'End' ? 1 : (trackButtons.indexOf(button) + 1) % 2;
      showTrack(trackButtons[index], true);
    }
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(a => a.classList.toggle('current', a.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, {rootMargin: '-15% 0px -65% 0px', threshold: 0});
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
}
