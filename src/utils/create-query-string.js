export const createQueryString = (queries) => {
  return Object.entries(queries).filter(q => String(q[1]).length).map(([key, value]) => ([key, encodeURIComponent(value)])).map(q => q.join('=')).join('&');
}