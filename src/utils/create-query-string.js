export const createQueryString = (queries) => {
  return Object.entries(queries).filter(q => q[1].length).map(q => q.join('=')).join('&');
}