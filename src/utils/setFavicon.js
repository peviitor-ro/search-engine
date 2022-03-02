import favicon from '../asset/icons/icon16.png';

export const setFavicon = () => {
  const link = document.querySelector("link[rel~='icon']");
  link.href = favicon;
}