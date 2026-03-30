// Hebrew keyboard layout mapping (QWERTY -> Hebrew)
// Home row: א ס ד פ ג ה י כ ל ק  (maps to a s d f g h j k l ;)
// Top row:  ק ר א ט ו ן מ צ / (maps to q w e r t y u i o p)
// Wait - standard Israeli keyboard:
// Top row:    / ' ק ר א ט ו ן מ צ
// Home row:   ף ך ל ח י פ ז ס ב ה נ מ
// Actually let me use the standard:
// Row 1 (top): q=/ w=' e=ק r=ר t=א y=ט u=ו i=ן j=מ k=צ (and more)
// Let me use the standard Israeli keyboard:
// ק=q, ר=w, א=e, ט=r, ו=t, ן=y, מ=u, צ=i, פ=o, =(p
// ש=a, ד=s, ג=d, כ=f, ע=g, י=h, ח=j, ל=k, ך=l
// ז=z, ס=x, ב=c, ה=v, נ=b, מ=n, צ=m

// Standard Israeli (phonetic is different - using layout-based)
// QWERTY to Hebrew mapping (Standard Israeli):
export const HEBREW_KEYBOARD = {
  rows: [
    // Top row
    ['q','w','e','r','t','y','u','i','o','p'],
    // Home row
    ['a','s','d','f','g','h','j','k','l',';'],
    // Bottom row
    ['z','x','c','v','b','n','m',',','.'],
  ],
  // key -> {hebrew, finger}
  // finger: 0=left-pinky,1=left-ring,2=left-middle,3=left-index,4=left-index
  //         5=right-index,6=right-index,7=right-middle,8=right-ring,9=right-pinky
  map: {
    'q': { heb: '/', finger: 0 },
    'w': { heb: '\'', finger: 1 },
    'e': { heb: 'ק', finger: 2 },
    'r': { heb: 'ר', finger: 3 },
    't': { heb: 'א', finger: 4 },
    'y': { heb: 'ט', finger: 5 },
    'u': { heb: 'ו', finger: 6 },
    'i': { heb: 'ן', finger: 7 },
    'o': { heb: 'מ', finger: 8 },
    'p': { heb: 'פ', finger: 9 },
    'a': { heb: 'ש', finger: 0 },
    's': { heb: 'ד', finger: 1 },
    'd': { heb: 'ג', finger: 2 },
    'f': { heb: 'כ', finger: 3 },
    'g': { heb: 'ע', finger: 4 },
    'h': { heb: 'י', finger: 5 },
    'j': { heb: 'ח', finger: 6 },
    'k': { heb: 'ל', finger: 7 },
    'l': { heb: 'ך', finger: 8 },
    ';': { heb: 'ף', finger: 9 },
    'z': { heb: 'ז', finger: 0 },
    'x': { heb: 'ס', finger: 1 },
    'c': { heb: 'ב', finger: 2 },
    'v': { heb: 'ה', finger: 3 },
    'b': { heb: 'נ', finger: 4 },
    'n': { heb: 'מ', finger: 5 },
    'm': { heb: 'צ', finger: 6 },
    ',': { heb: 'ת', finger: 7 },
    '.': { heb: 'ץ', finger: 8 },
    ' ': { heb: ' ', finger: -1 },
  }
};

// Build reverse map: hebrew char -> qwerty key
export const HEBREW_TO_KEY = {};
for (const [key, val] of Object.entries(HEBREW_KEYBOARD.map)) {
  HEBREW_TO_KEY[val.heb] = key;
}
HEBREW_TO_KEY[' '] = ' ';

export const BIOMES = [
  {
    id: 'desert', name: 'מדבר', icon: '🏜️', en: 'DESERT',
    image: '/desert-level.png',
    briefing: [
      'אתה נמצא באמצע המדבר הבוער.',
      'החום עז, החול מכסה הכל.',
      'הצוות שלך מחכה להוראות.',
      'הקלד את ההודעה בדיוק — כל מילה חשובה.',
    ],
  },
  {
    id: 'forest', name: 'יער', icon: '🌲', en: 'FOREST',
    image: '/forest-level.png',
    briefing: [
      'אתה נכנס ליער הצפוף והחשוך.',
      'עצים גבוהים מסתירים את השמיים.',
      'רשרוש עלים — מישהו שם בחוץ.',
      'שלח את הדיווח לפני שיאבד הקשר.',
    ],
  },
  {
    id: 'arctic', name: 'ארקטי', icon: '🧊', en: 'ARCTIC',
    image: '/arctic-level.png',
    briefing: [
      'קור של מינוס עשרים מעלות.',
      'השלג לא מפסיק לרדת.',
      'האצבעות קפואות אבל המשימה לא מחכה.',
      'הקלד מהר לפני שהסופה תנתק את הקשר.',
    ],
  },
  {
    id: 'jungle', name: 'ג׳ונגל', icon: '🌿', en: 'JUNGLE',
    image: '/jungle-level.png',
    briefing: [
      'הג׳ונגל חי ונושם סביבך.',
      'רטיבות, רעש, ועצים בכל מקום.',
      'האויב קרוב — אסור לטעות.',
      'שלח את ההודעה בשקט ובמדויק.',
    ],
  },
];

export const RANKS = [
  { min: 1, max: 5, name: 'טירון', en: 'RECRUIT' },
  { min: 6, max: 10, name: 'לוחם', en: 'FIGHTER' },
  { min: 11, max: 15, name: 'סמל', en: 'SERGEANT' },
  { min: 16, max: 20, name: 'מפקד', en: 'COMMANDER' },
];

export function getRank(level) {
  return RANKS.find(r => level >= r.min && level <= r.max) || RANKS[RANKS.length - 1];
}

// 20 mission texts — 5 per biome
// Desert (1-5): Only home row letters: ש ד ג כ ע י ח ל ך ף (a s d f g h j k l ;)
// Forest (6-10): Add top row: / ' ק ר א ט ו ן מ פ
// Arctic (11-15): Add bottom row: ז ס ב ה נ מ צ ת ץ
// Jungle (16-20): All letters, long sentences
export const MISSIONS = [
  // Desert — home row only: ש ד ג כ ע י ח ל ך ף and spaces
  {
    level: 1, biome: 0,
    title: 'משימה ראשונה',
    text: 'שלח ידיים ל שמאל',
  },
  {
    level: 2, biome: 0,
    title: 'סיור בשטח',
    text: 'גשש כל שדה ויער',
  },
  {
    level: 3, biome: 0,
    title: 'דיווח שדה',
    text: 'שלח כל ידע ישיר לשלישי',
  },
  {
    level: 4, biome: 0,
    title: 'אות קשר',
    text: 'שדה ישיר כיל שלח ידי גשש',
  },
  {
    level: 5, biome: 0,
    title: 'חילוץ סוכן',
    text: 'ידי שלח ישיר כל שדה גשש ידע',
  },
  // Forest — add top row chars: ק ר א ט ו ן מ פ and ' /
  {
    level: 6, biome: 1,
    title: 'כניסה ליער',
    text: 'סוכן שטח מדווח מן היער הירוק',
  },
  {
    level: 7, biome: 1,
    title: 'תצפית לילה',
    text: 'ראה את האויב מאחורי עצי האורן',
  },
  {
    level: 8, biome: 1,
    title: 'מארב ביער',
    text: 'הסוכן פרס מארב ליד הנהר הקטן',
  },
  {
    level: 9, biome: 1,
    title: 'קשר רדיו',
    text: 'שלח דיווח מיידי על תנועת האויב ביער',
  },
  {
    level: 10, biome: 1,
    title: 'מפגש סוכנים',
    text: 'הגיע למפגש ביער אחרי שעתיים של הליכה',
  },
  // Arctic — add bottom row: ז ס ב ה נ מ צ ת ץ
  {
    level: 11, biome: 2,
    title: 'קור ארקטי',
    text: 'הסוכן התקדם בשלג הכבד אל עבר הבסיס הסמוי',
  },
  {
    level: 12, biome: 2,
    title: 'סופת שלג',
    text: 'בסופת השלג צריך להישאר צמוד לשותף ולא לאבד כיוון',
  },
  {
    level: 13, biome: 2,
    title: 'בסיס קפוא',
    text: 'נמצא בסיס סמוי מתחת לקרח ובו ציוד חשוב לשליחות',
  },
  {
    level: 14, biome: 2,
    title: 'חילוץ מקפאון',
    text: 'צוות החילוץ הצליח לאתר את הסוכן שנתקע בסערת הקרח',
  },
  {
    level: 15, biome: 2,
    title: 'שדרת הכסף',
    text: 'במסלול הארקטי עברנו דרך שבע נקודות תצפית ויצאנו בשלום',
  },
  // Jungle — full keyboard, long texts
  {
    level: 16, biome: 3,
    title: 'ג׳ונגל עמוק',
    text: 'הסוכן חדר לעומק הג׳ונגל הצפוף ומצא את המחנה הנסתר של האויב אחרי שלושה ימים של מעקב',
  },
  {
    level: 17, biome: 3,
    title: 'מיסיון סודי',
    text: 'המשימה הסודית דרשה חדירה לבסיס ביום ללא כיסוי אווירי ושליפת המסמכים המסווגים',
  },
  {
    level: 18, biome: 3,
    title: 'בריחה מהג׳ונגל',
    text: 'לאחר השלמת המשימה ברח הסוכן דרך שבילי הג׳ונגל הצרים ועלה על סירת החילוץ בנהר',
  },
  {
    level: 19, biome: 3,
    title: 'קרב על הגשר',
    text: 'על הגשר הרעוע ניצב הסוכן לבדו מול שלושה לוחמים אויב וניצח בזכות אימון קשה ורצון ברזל',
  },
  {
    level: 20, biome: 3,
    title: 'שליחות אחרונה',
    text: 'השליחות האחרונה הצליחה בזכות צוות מקצועי אמיץ ומסור שלא ויתר גם ברגעים הקשים ביותר של הלחימה',
  },
];

export function getStarCount(accuracy) {
  if (accuracy >= 95) return 3;
  if (accuracy >= 80) return 2;
  if (accuracy >= 65) return 1;
  return 0;
}

export function isBiomeUnlocked(biomeIndex, progress) {
  if (biomeIndex === 0) return true;
  const prevBiome = biomeIndex - 1;
  const prevLevels = MISSIONS.filter(m => m.biome === prevBiome);
  return prevLevels.every(m => {
    const stars = progress[m.level] || 0;
    return stars >= 2;
  });
}
