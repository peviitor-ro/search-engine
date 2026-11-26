export const SEASONS = {
  WINTER: "winter"
};

export const SEASON_THEME_CLASSES = {
  [SEASONS.WINTER]: "winter-theme"
};

const JANUARY = 0;
const DECEMBER = 11;

// For testing purposes, force santa sleigh season (TRUE = JOB SANTA) !!!
const FORCE_SANTA_SLEIGH = false;

export function isSantaSleighSeason(date = new Date()) {
  if (FORCE_SANTA_SLEIGH) return true;
  const month = date.getMonth();
  const day = date.getDate();
  return month === DECEMBER || (month === JANUARY && day <= 1);
}

export function getActiveSeason(date = new Date()) {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === DECEMBER || (month === JANUARY && day <= 8)) {
    return SEASONS.WINTER;
  }
  return null;
}

export function isWinterSeason(date = new Date()) {
  return getActiveSeason(date) === SEASONS.WINTER;
}

// Computes ms until the next seasonal boundary (Dec 1, Jan 2, or Jan 9)
export function getNextSeasonTransitionMs(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  let nextBoundary;
  if (month === DECEMBER) {
    nextBoundary = new Date(year + 1, JANUARY, 2, 0, 0, 0, 0);
  } else if (month === JANUARY && day <= 1) {
    nextBoundary = new Date(year, JANUARY, 2, 0, 0, 0, 0);
  } else if (month === JANUARY && day <= 8) {
    nextBoundary = new Date(year, JANUARY, 9, 0, 0, 0, 0);
  } else {
    nextBoundary = new Date(year, DECEMBER, 1, 0, 0, 0, 0);
  }

  return Math.max(nextBoundary.getTime() - date.getTime(), 0);
}
