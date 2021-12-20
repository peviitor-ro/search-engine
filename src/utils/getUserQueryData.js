export const getUserQueryData = () => {
  const input = document.querySelector('#search-input');

  return {
    q: input.value
  }
}