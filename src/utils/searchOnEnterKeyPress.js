import { ceateNewUrl } from "./ceateNewUrl";
import { getUserQueryData } from "./getUserQueryData";

export const searchOnEnterPress = () => {
  const inputField = document.querySelector('.search')

  inputField.addEventListener('keydown', (e) => {
    if(e.code === 'Enter') {
      const queryData = getUserQueryData();
      const newUrl = ceateNewUrl(queryData);

      if(newUrl) {
        window.location.href = newUrl;
      }
    }
  });
}
