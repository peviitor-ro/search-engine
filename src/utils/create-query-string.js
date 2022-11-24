export const createQueryString = (queries) => {
  return Object.entries(queries).filter(q => String(q[1]).length).map(q => q.join('=')).join('&');
}