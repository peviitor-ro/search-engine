export const createQueryString = (data) => {
  return Object.entries(data).filter(q => q[1]).map(q => q.join('=')).join('&');
};
