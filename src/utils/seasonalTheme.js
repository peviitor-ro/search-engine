export const SEASONS = {
  WINTER: "winter"
};

export const SEASON_THEME_CLASSES = {
  [SEASONS.WINTER]: "winter-theme"
};

const JANUARY = 0;
const FEBRUARY = 1;
const MARCH = 2;
const DECEMBER = 10;

export function getActiveSeason(date = new Date()) {
  const month = date.getMonth();
  if (month === DECEMBER || month === JANUARY || month === FEBRUARY) {
    return SEASONS.WINTER;
  }
  return null;
}

export function isWinterSeason(date = new Date()) {
  return getActiveSeason(date) === SEASONS.WINTER;
}

// Computes ms until the next season boundary (Dec 1 or Mar 1, handling year wrap)
export function getNextSeasonTransitionMs(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();

  let nextBoundary;
  if (month === DECEMBER) {
    nextBoundary = new Date(year + 1, MARCH, 1, 0, 0, 0, 0);
  } else if (month === JANUARY || month === FEBRUARY) {
    nextBoundary = new Date(year, MARCH, 1, 0, 0, 0, 0);
  } else {
    nextBoundary = new Date(year, DECEMBER, 1, 0, 0, 0, 0);
  }

  return Math.max(nextBoundary.getTime() - date.getTime(), 0);
}
