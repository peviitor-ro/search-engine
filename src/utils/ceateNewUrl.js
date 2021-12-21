export const ceateNewUrl = (data) => {
  const queryArr = Object.entries(data).filter(x => x[1]);
  if(queryArr.length <= 0) {
    return null;
  }

  const queryString = queryArr.filter(x => x[1]).map(query => query.join('=')).join('&');
  const newUrl = `${window.location.origin}/rezultate${queryString ? '?'+queryString : ''}`;

  return newUrl;
}