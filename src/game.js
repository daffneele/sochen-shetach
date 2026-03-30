import { MISSIONS, BIOMES, getRank, getStarCount, isBiomeUnlocked } from './data.js';
import { buildKeyboard, highlightKey } from './keyboard.js';

const SAVE_KEY = 'sochen_shetach_save';

function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
  } catch { return {}; }
}

function writeSave(data) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- Screen helpers ---
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// --- State ---
let state = {
  agentName: '',
  progress: {}, // level -> best star count
  currentMission: null,
  typedCount: 0,
  errors: 0,
  startTime: null,
  timerInterval: null,
};

// --- Story Screen ---
const STORY_LINES = [
  'אתה סוכן תקשורת בשטח.',
  'הצוות שלך בשטח שולח לך הודעות.',
  'אתה חייב להקליד אותן בדיוק ובמהירות.',
  'אם תטעה – הקשר יתערער.',
  'מוכן להתחבר?',
];

function initStory() {
  const save = loadSave();
  if (save.hasSeenIntro) {
    showScreen('screen-intro');
    initIntro();
    return;
  }

  showScreen('screen-story');

  const linesContainer = document.getElementById('story-lines');
  const continueBtn = document.getElementById('btn-story-continue');
  linesContainer.innerHTML = '';

  const typeSound = new Audio('/typewriter.mp3');
  typeSound.loop = true;

  let lineIndex = 0;
  let charIndex = 0;
  let currentLineEl = null;
  let currentTextEl = null;
  let cursorEl = null;

  function stopSound() {
    typeSound.pause();
    typeSound.currentTime = 0;
  }

  function typeNextChar() {
    if (lineIndex >= STORY_LINES.length) {
      // All lines done — stop sound, remove cursor, show button
      stopSound();
      if (cursorEl) cursorEl.remove();
      continueBtn.classList.remove('hidden');
      return;
    }

    const line = STORY_LINES[lineIndex];

    // Start a new line element
    if (charIndex === 0) {
      currentLineEl = document.createElement('div');
      currentLineEl.className = 'story-line';

      const iconEl = document.createElement('span');
      iconEl.className = 'story-line-icon';
      iconEl.textContent = '▶';

      currentTextEl = document.createElement('span');
      currentTextEl.className = 'story-line-text';

      cursorEl = document.createElement('span');
      cursorEl.className = 'story-cursor';

      currentLineEl.appendChild(iconEl);
      currentLineEl.appendChild(currentTextEl);
      currentLineEl.appendChild(cursorEl);
      linesContainer.appendChild(currentLineEl);
    }

    // Start sound on first character (requires user gesture — screen is already shown)
    if (lineIndex === 0 && charIndex === 0 && typeSound.paused) {
      typeSound.play().catch(() => {});
    }

    // Type one character
    currentTextEl.textContent += line[charIndex];
    charIndex++;

    if (charIndex < line.length) {
      setTimeout(typeNextChar, 45);
    } else {
      // Line done — move cursor away, pause before next line
      if (cursorEl) cursorEl.remove();
      lineIndex++;
      charIndex = 0;
      cursorEl = null;
      setTimeout(typeNextChar, 500);
    }
  }

  typeNextChar();

  continueBtn.onclick = () => {
    stopSound();
    const s = loadSave();
    s.hasSeenIntro = true;
    writeSave(s);
    showScreen('screen-intro');
    initIntro();
  };
}

// --- Audio ---
const bgMusic = new Audio('/background-music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;

const successSound = new Audio('/success.mp3');
successSound.volume = 0.8;

function startBgMusic() {
  if (bgMusic.paused) bgMusic.play().catch(() => {});
}

function playSuccess() {
  successSound.currentTime = 0;
  successSound.play().catch(() => {});
}

// --- Mission Briefing Screen ---
function showMissionBriefing(mission) {
  showScreen('screen-briefing');
  startBgMusic();

  const biome = BIOMES[mission.biome];
  document.getElementById('briefing-image').src = biome.image;
  document.getElementById('briefing-title').textContent = `${biome.icon} ${mission.title}`;

  const linesContainer = document.getElementById('briefing-lines');
  const goBtn = document.getElementById('btn-briefing-go');
  linesContainer.innerHTML = '';
  goBtn.classList.add('hidden');

  const typeSound = new Audio('/typewriter.mp3');
  typeSound.loop = true;

  let lineIndex = 0;
  let charIndex = 0;
  let currentTextEl = null;
  let cursorEl = null;

  function stopTypeSound() {
    typeSound.pause();
    typeSound.currentTime = 0;
  }

  function typeNextChar() {
    const lines = biome.briefing;

    if (lineIndex >= lines.length) {
      stopTypeSound();
      if (cursorEl) cursorEl.remove();
      goBtn.classList.remove('hidden');
      return;
    }

    const line = lines[lineIndex];

    if (charIndex === 0) {
      const lineEl = document.createElement('div');
      lineEl.className = 'story-line';

      const iconEl = document.createElement('span');
      iconEl.className = 'story-line-icon';
      iconEl.textContent = '▶';

      currentTextEl = document.createElement('span');
      currentTextEl.className = 'story-line-text';

      cursorEl = document.createElement('span');
      cursorEl.className = 'story-cursor';

      lineEl.appendChild(iconEl);
      lineEl.appendChild(currentTextEl);
      lineEl.appendChild(cursorEl);
      linesContainer.appendChild(lineEl);

      if (typeSound.paused) typeSound.play().catch(() => {});
    }

    currentTextEl.textContent += line[charIndex];
    charIndex++;

    if (charIndex < line.length) {
      setTimeout(typeNextChar, 40);
    } else {
      if (cursorEl) cursorEl.remove();
      lineIndex++;
      charIndex = 0;
      cursorEl = null;
      setTimeout(typeNextChar, 450);
    }
  }

  typeNextChar();

  goBtn.onclick = () => {
    stopTypeSound();
    startMission(mission);
  };
}

// --- Intro Screen ---
export function initIntro() {
  const save = loadSave();
  const input = document.getElementById('agent-name-input');
  const infoEl = document.getElementById('returning-agent-info');

  if (save.agentName) {
    input.value = save.agentName;
    const rank = getRank(save.currentLevel || 1);
    const biomeIdx = save.currentBiome || 0;
    const biome = BIOMES[biomeIdx];
    infoEl.textContent = `ברוך שובך, ${save.agentName} | דרגה: ${rank.name} | אזור: ${biome.name} ${biome.icon}`;
    infoEl.classList.remove('hidden');
  }

  document.getElementById('btn-start').addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 400);
      return;
    }

    const existing = loadSave();
    if (!existing.agentName || existing.agentName !== name) {
      // New agent or different name
      writeSave({ agentName: name, progress: {}, currentLevel: 1, currentBiome: 0 });
    }

    state.agentName = name;
    const s = loadSave();
    state.progress = s.progress || {};
    startBgMusic();
    showMap();
  });
}

// --- World Map ---
function showMap() {
  showScreen('screen-map');
  const save = loadSave();
  state.progress = save.progress || {};

  document.getElementById('map-agent-name').textContent = state.agentName;
  const currentLevel = getCurrentLevel();
  document.getElementById('map-rank').textContent = getRank(currentLevel).name;

  BIOMES.forEach((biome, biomeIdx) => {
    const zoneEl = document.getElementById(`zone-${biome.id}`);
    const starsEl = document.getElementById(`stars-${biome.id}`);
    const lockEl = zoneEl.querySelector('.zone-lock');
    const unlocked = isBiomeUnlocked(biomeIdx, state.progress);

    if (unlocked) {
      zoneEl.classList.remove('locked');
      lockEl.classList.add('hidden');
      // Show best stars for this biome
      const biomeMissions = MISSIONS.filter(m => m.biome === biomeIdx);
      const totalStars = biomeMissions.reduce((sum, m) => sum + (state.progress[m.level] || 0), 0);
      const maxStars = biomeMissions.length * 3;
      starsEl.textContent = `${totalStars}/${maxStars} ⭐`;

      zoneEl.onclick = () => showLevelSelect(biomeIdx);
    } else {
      zoneEl.classList.add('locked');
      lockEl.classList.remove('hidden');
      starsEl.textContent = '';
      zoneEl.onclick = null;
    }
  });
}

function getCurrentLevel() {
  const levels = Object.keys(state.progress).map(Number);
  return levels.length > 0 ? Math.max(...levels) + 1 : 1;
}

// Level select: pick first incomplete level in biome, or let player choose
function showLevelSelect(biomeIdx) {
  const biomeMissions = MISSIONS.filter(m => m.biome === biomeIdx);
  const nextMission = biomeMissions.find(m => (state.progress[m.level] || 0) < 3)
    || biomeMissions[biomeMissions.length - 1];
  showMissionBriefing(nextMission);
}

// --- Mission Screen ---
function startMission(mission) {
  state.currentMission = mission;
  state.typedCount = 0;
  state.errors = 0;
  state.startTime = null;

  showScreen('screen-mission');

  const biome = BIOMES[mission.biome];
  document.getElementById('mission-rank').textContent = getRank(mission.level).name;
  document.getElementById('mission-agent').textContent = state.agentName;
  document.getElementById('mission-biome').textContent = `${biome.icon} ${biome.name}`;
  document.getElementById('mission-level').textContent = `שלב ${mission.level}`;

  renderMissionText(mission.text, 0, -1);
  updateSignal(100);

  const kbWrap = document.getElementById('keyboard-wrap');
  buildKeyboard(kbWrap);
  highlightKey(kbWrap, mission.text[0]);

  if (state.timerInterval) clearInterval(state.timerInterval);
  document.getElementById('mission-timer').textContent = '00:00';

  // Remove any previous listener, attach fresh
  document.removeEventListener('keydown', handleTyping);
  document.addEventListener('keydown', handleTyping);
}

function renderMissionText(text, typedCount, lastWasError) {
  const container = document.getElementById('mission-text');
  container.innerHTML = '';

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i] === ' ' ? '\u00A0' : text[i];

    if (i < typedCount) {
      span.className = 'char-done';
    } else if (i === typedCount) {
      span.className = lastWasError ? 'char-error char-current' : 'char-current';
    } else {
      span.className = 'char-pending';
    }
    container.appendChild(span);
  }
}

function updateSignal(pct) {
  const bar = document.getElementById('signal-bar');
  const label = document.getElementById('signal-pct');
  bar.style.width = `${pct}%`;
  label.textContent = `${Math.round(pct)}%`;
  bar.className = 'signal-bar-inner';
  if (pct > 85) bar.classList.add('signal-green');
  else if (pct > 70) bar.classList.add('signal-yellow');
  else bar.classList.add('signal-red');
}

function handleTyping(e) {
  const mission = state.currentMission;
  const text = mission.text;
  const pos = state.typedCount;

  // Start timer on first keypress
  if (!state.startTime && e.key.length === 1) {
    state.startTime = Date.now();
    state.timerInterval = setInterval(updateTimer, 1000);
  }

  if (e.key === 'Backspace') {
    e.preventDefault();
    if (pos > 0) {
      state.typedCount--;
      renderMissionText(text, state.typedCount, false);
      highlightKey(document.getElementById('keyboard-wrap'), text[state.typedCount]);
    }
    return;
  }

  if (e.key.length !== 1) return;
  e.preventDefault();

  const expected = text[pos];

  if (e.key === expected || (expected === ' ' && e.key === ' ')) {
    // Correct
    state.typedCount++;
    renderMissionText(text, state.typedCount, false);
    const totalPresses = state.typedCount + state.errors;
    updateSignal(Math.round((state.typedCount / totalPresses) * 100));

    if (state.typedCount >= text.length) {
      finishMission();
      return;
    }

    highlightKey(document.getElementById('keyboard-wrap'), text[state.typedCount]);
  } else {
    // Wrong
    state.errors++;
    renderMissionText(text, pos, true);
    // accuracy = correct / total_keypresses_so_far
    const totalPresses = state.typedCount + state.errors;
    const accuracy = Math.max(0, Math.round((state.typedCount / totalPresses) * 100));
    updateSignal(accuracy);
  }
}

function updateTimer() {
  if (!state.startTime) return;
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  document.getElementById('mission-timer').textContent = `${m}:${s}`;
}

function finishMission() {
  document.removeEventListener('keydown', handleTyping);
  if (state.timerInterval) clearInterval(state.timerInterval);

  const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;
  const text = state.currentMission.text;
  const totalChars = text.length;
  const totalPresses = totalChars + state.errors;
  const accuracy = Math.round((totalChars / totalPresses) * 100);
  const stars = getStarCount(accuracy);

  // Save progress
  const save = loadSave();
  const prevStars = save.progress[state.currentMission.level] || 0;
  if (stars > prevStars) {
    save.progress[state.currentMission.level] = stars;
  }
  save.currentLevel = state.currentMission.level;
  save.currentBiome = state.currentMission.biome;
  writeSave(save);
  state.progress = save.progress;

  if (stars >= 1) playSuccess();
  showResults(accuracy, elapsed, state.errors, stars);
}

// --- Results Screen ---
function showResults(accuracy, elapsed, errors, stars) {
  showScreen('screen-results');

  const starsEl = document.getElementById('results-stars');
  const statusEl = document.getElementById('results-status');

  if (stars === 0) {
    starsEl.textContent = '💀';
    statusEl.textContent = 'המשימה נכשלה — נסה שוב!';
    statusEl.className = 'results-status status-fail';
  } else {
    starsEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    statusEl.textContent = stars === 3 ? 'משימה הושלמה בהצלחה!' : 'משימה הושלמה';
    statusEl.className = 'results-status status-pass';
  }

  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  document.getElementById('stat-accuracy').textContent = `${accuracy}%`;
  document.getElementById('stat-time').textContent = `${m}:${s}`;
  document.getElementById('stat-errors').textContent = errors;

  // Check if new biome unlocked
  const unlockEl = document.getElementById('results-unlock-msg');
  const nextBiome = state.currentMission.biome + 1;
  if (nextBiome < 4 && isBiomeUnlocked(nextBiome, state.progress)) {
    const prev = loadSave();
    const wasLocked = !isBiomeUnlocked(nextBiome, prev.progress || {});
    // We already saved, check if it was just unlocked by comparing before/after
    const biome = BIOMES[nextBiome];
    if (stars >= 2) {
      unlockEl.textContent = `🔓 אזור חדש נפתח: ${biome.name} ${biome.icon}`;
      unlockEl.classList.remove('hidden');
    } else {
      unlockEl.classList.add('hidden');
    }
  } else {
    unlockEl.classList.add('hidden');
  }

  const btnNext = document.getElementById('btn-next');
  const btnRetry = document.getElementById('btn-retry');
  const btnMap = document.getElementById('btn-map');

  // Reset visibility
  btnNext.classList.add('hidden');
  btnRetry.classList.add('hidden');
  btnMap.classList.add('hidden');

  if (stars === 3) {
    btnNext.classList.remove('hidden');
    btnMap.classList.remove('hidden');
    const nextMission = MISSIONS.find(m => m.level === state.currentMission.level + 1);
    btnNext.onclick = () => {
      document.removeEventListener('keydown', handleTyping);
      if (nextMission) showMissionBriefing(nextMission);
      else showMap();
    };
  } else if (stars >= 1) {
    btnRetry.classList.remove('hidden');
    btnMap.classList.remove('hidden');
  } else {
    // 0 stars — retry only
    btnRetry.classList.remove('hidden');
  }

  btnRetry.onclick = () => {
    document.removeEventListener('keydown', handleTyping);
    startMission(state.currentMission);
  };
  btnMap.onclick = () => {
    document.removeEventListener('keydown', handleTyping);
    showMap();
  };
}

export function initGame() {
  initStory();
}
