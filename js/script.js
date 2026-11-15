/* Everything the site needs in one small file: clock, password screen, project reset. */

/* ---------- 1. Athens clock (always Europe/Athens, on every page) ---------- */
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
function tick() {
  const p = Object.fromEntries(fmt.formatToParts(new Date()).map(x => [x.type, x.value]));
  const ampm = +p.hour < 12 ? 'am' : 'pm';
  document.querySelectorAll('.clock').forEach(el => { el.textContent = 'Ath, ' + p.hour + ':' + p.minute + ':' + p.second + ' ' + ampm; });
}
tick();
setInterval(tick, 1000);

/* ---------- 1b. Copyright year on the lock screen: always the current year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = '\u00a9 ' + new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', year: 'numeric' }).format(new Date());

/* ---------- 2. Password screen ----------
   Only a scrambled version (hash) of the password is stored here, never the password.
   To change it: open password-maker.html in your browser, type the new password,
   and paste the two lines it gives you over SALT/HASH below. */
const SALT = 'sa-portfolio:';
const HASH = '5cd2d250dc4a782cf385844165cdc544573b3048e7ed6ee49a30522eaa90bced';   // currently the password "hello" -> CHANGE IT
const ITER = 100000;

const input = document.getElementById('pw');

async function hashOf(pw) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(SALT), iterations: ITER, hash: 'SHA-256' }, base, 256);
  return [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* Enter = try the password. Right -> remember it for this tab and open projects.html */

let checking = false;
async function check() {
  if (!input.value || checking) return;
  checking = true;
  try { await verify(); } finally { checking = false; }
}

async function verify() {
  if (!input.value) return;
  if (await hashOf(input.value) === HASH) {
    sessionStorage.setItem('portfolio-ok', HASH);
    location.href = 'projects.html';
  } else {
    input.value = '';          // wrong password: clear the field, stay here
  }
}

if (input) {                   // we are on index.html (lock screen)
  input.closest('form').addEventListener('submit', e => { e.preventDefault(); check(); });
  input.addEventListener('change', check);   // iPhone: the check mark that closes the keyboard
} else if (sessionStorage.getItem('portfolio-ok') !== HASH) {
  location.replace('index.html');   // projects.html opened without the password -> back to the lock
}

/* ---------- 3. Projects page: slides, click zones (arrows), counter ---------- */
const projs = [...document.querySelectorAll('.proj')];
const pad = n => String(n).padStart(2, '0');
let busy = false;

const fade = document.createElement('div');           // black flash used when the last project loops to the first
fade.className = 'loop-fade';
document.body.appendChild(fade);

function goProject(from, dir) {                       // dir +1 = the project below, -1 = the one above
  if (busy) return;
  const to = projs[projs.indexOf(from) + dir];
  busy = true;
  if (!to && dir > 0 && projs.length > 1) {           // after the last project: loop to the first one
    fade.classList.add('on');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      fade.classList.remove('on');
      setTimeout(() => { busy = false; }, 400);
    }, 380);
    return;
  }
  if (to) to.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { busy = false; }, 800);
}


projs.forEach(proj => {
  const fix = proj.querySelector('.fix');
  const track = proj.querySelector('.track');
  const slides = [...track.children];                 // one <figure> = one slide (images AND videos, any number)
  // click zones + counter are added here, so a new project needs no extra markup
  fix.insertAdjacentHTML('beforeend', '<div class="zone zone-back"></div><div class="zone zone-next"></div><span class="counter"></span>');
  const zBack = fix.querySelector('.zone-back'), zNext = fix.querySelector('.zone-next');
  const counter = fix.querySelector('.counter');
  proj.idx = 0;

  proj.go = i => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    proj.idx = i;
    track.style.setProperty('--i', i);                // CSS slides the track
    counter.textContent = (i + 1) + ' of ' + slides.length;        // 1 of 6
    zBack.classList.toggle('off', i === 0);                                           // nothing before the first image
    slides.forEach((s, k) => s.querySelectorAll('video').forEach(v => {              // only the visible video plays
      if (k === i && proj.live) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();   // ... and only while its project is on screen
    }));
  };
  proj.back = () => proj.go(proj.idx - 1);
  proj.next = () => { if (proj.idx < slides.length - 1) proj.go(proj.idx + 1); else goProject(proj, 1); };   // last image -> the next project below (the last project loops to the first)
  zBack.addEventListener('click', proj.back);
  zNext.addEventListener('click', proj.next);
  const info = proj.querySelector('.info');
  proj.querySelector('.title').addEventListener('click', () => {            // the whole title block is the button, like Read more
    info.checked = !info.checked;
    info.dispatchEvent(new Event('change', { bubbles: true }));
  });
  proj.go(0);
});


/* A click anywhere outside the title / text closes Read more */
document.addEventListener('click', e => {
  const open = document.querySelector('.info:checked');
  if (!open || e.target.closest('.title, .desc > p, label, input')) return;
  open.checked = false;
});


/* A project goes back to its first slide (and Info closes) once it has left the screen */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  const proj = e.target;
  proj.live = e.isIntersecting;                       // on screen? (videos only play while it is)
  if (e.isIntersecting) { proj.go(proj.idx); return; }
  proj.go(0);
  proj.querySelector('.info').checked = false;
}), { rootMargin: '-10% 0px' });
projs.forEach(p => io.observe(p));

/* Information (bio) and a project's Read more never stay open together */
const bio = document.getElementById('bio');
document.addEventListener('change', e => {
  if (e.target === bio && bio.checked) document.querySelectorAll('.info:checked').forEach(i => i.checked = false);
  else if (e.target.classList && e.target.classList.contains('info') && e.target.checked && bio) bio.checked = false;
});

/* ---------- 4. Keyboard ----------
   Right / Left = next / previous image (the last image goes on to the next project)     Down / Up = next / previous project
   Esc = close Information / Read more (while one is open the other keys are locked, like the scroll) */
const activeProj = () => projs.find(p => { const r = p.getBoundingClientRect(); return r.top > -innerHeight / 2 && r.top < innerHeight / 2; }) || projs[0];

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey || !projs.length) return;
  const open = document.querySelector('.info:checked, #bio:checked');
  if (open) {                                        // open: only Esc works, the browser's own key-scrolling is blocked too
    if (e.key === 'Escape') open.checked = false;
    if (['Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) e.preventDefault();
    return;
  }
  const p = activeProj();
  if (e.key === 'ArrowRight') p.next();
  else if (e.key === 'ArrowLeft') p.back();
  else if (e.key === 'ArrowDown') goProject(p, 1);
  else if (e.key === 'ArrowUp') goProject(p, -1);
  else return;
  e.preventDefault();
});
