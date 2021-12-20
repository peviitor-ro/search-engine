import './logo.style.scss';

export const logo = () => {
  const logo = document.createElement('div')
  logo.classList = 'logo';
  logo.innerText = 'pe viitor';

  return logo;
}