import './moto.style.scss';

export const motoComponent = () => {
  const moto = document.createElement('div');
  const title = document.createElement('div');
  const subTitle = document.createElement('div');

  moto.classList = 'moto';

  title.classList = 'moto__title';
  title.innerText = 'motor de căutare';

  subTitle.classList = 'moto__subtitle';
  subTitle.innerText = 'locuri de muncă';

  moto.appendChild(title);
  moto.appendChild(subTitle);
  return moto;
}
