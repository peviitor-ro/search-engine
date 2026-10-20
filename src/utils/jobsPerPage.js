// Card sizes measured on the results grid (see Results.jsx / Job.jsx).
// From md up the card is laid out as a row and is shorter.
const CARD_HEIGHT_MOBILE = 301;
const CARD_HEIGHT_DESKTOP = 203;
const GRID_GAP = 24;
const MD_BREAKPOINT = 768;
const LG_BREAKPOINT = 1024;

const MIN_JOBS_PER_PAGE = 4;
const MAX_JOBS_PER_PAGE = 50;
export const DEFAULT_JOBS_PER_PAGE = 12;

// Number of job tiles needed to fill one screen at the current resolution.
export function getJobsPerPage() {
  if (typeof window === "undefined") return DEFAULT_JOBS_PER_PAGE;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const columns = width >= LG_BREAKPOINT ? 2 : 1;
  const cardHeight =
    width >= MD_BREAKPOINT ? CARD_HEIGHT_DESKTOP : CARD_HEIGHT_MOBILE;
  const rows = Math.ceil(height / (cardHeight + GRID_GAP));

  const jobsPerPage = Math.min(
    MAX_JOBS_PER_PAGE,
    Math.max(MIN_JOBS_PER_PAGE, rows * columns)
  );

  // keep full rows on the 2-column grid
  return jobsPerPage - (jobsPerPage % columns);
}

// Page that contains the first job of `page` once the page size changes.
export function convertPage(page, oldPageSize, newPageSize) {
  return Math.floor(((page - 1) * oldPageSize) / newPageSize) + 1;
}
