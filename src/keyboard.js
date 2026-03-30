import { HEBREW_KEYBOARD, HEBREW_TO_KEY } from './data.js';

const FINGER_COLORS = [
  '#1a3a5c', // left pinky
  '#1a4a2e', // left ring
  '#3a2a5c', // left middle
  '#4a3a1a', // left index
  '#4a3a1a', // left index (inner)
  '#4a1a1a', // right index (inner)
  '#4a1a1a', // right index
  '#3a1a4a', // right middle
  '#1a3a4a', // right ring
  '#2a1a3a', // right pinky
];

export function buildKeyboard(container) {
  container.innerHTML = '';
  const kb = document.createElement('div');
  kb.className = 'keyboard';

  const rowNames = ['top', 'home', 'bottom'];
  HEBREW_KEYBOARD.rows.forEach((row, rowIdx) => {
    const rowEl = document.createElement('div');
    rowEl.className = `kb-row kb-row-${rowNames[rowIdx]}`;

    row.forEach(key => {
      const info = HEBREW_KEYBOARD.map[key];
      if (!info) return;
      const keyEl = document.createElement('div');
      keyEl.className = 'kb-key';
      keyEl.dataset.key = key;
      keyEl.style.backgroundColor = FINGER_COLORS[info.finger] || '#1a1a1a';

      const hebSpan = document.createElement('span');
      hebSpan.className = 'kb-heb';
      hebSpan.textContent = info.heb;

      const engSpan = document.createElement('span');
      engSpan.className = 'kb-eng';
      engSpan.textContent = key.toUpperCase();

      keyEl.appendChild(hebSpan);
      keyEl.appendChild(engSpan);
      rowEl.appendChild(keyEl);
    });

    kb.appendChild(rowEl);
  });

  // Space bar
  const spaceRow = document.createElement('div');
  spaceRow.className = 'kb-row kb-row-space';
  const spaceKey = document.createElement('div');
  spaceKey.className = 'kb-key kb-space';
  spaceKey.dataset.key = ' ';
  spaceKey.textContent = 'רווח';
  spaceRow.appendChild(spaceKey);
  kb.appendChild(spaceRow);

  container.appendChild(kb);
}

export function highlightKey(container, hebrewChar) {
  // Remove previous highlights
  container.querySelectorAll('.kb-key').forEach(k => k.classList.remove('kb-active'));

  if (!hebrewChar) return;

  const qkey = HEBREW_TO_KEY[hebrewChar];
  if (!qkey) return;

  const keyEl = container.querySelector(`[data-key="${qkey === ' ' ? ' ' : qkey}"]`);
  if (keyEl) keyEl.classList.add('kb-active');
}
