import { state } from "../state";
import { createNewUrl } from "./createNewUrl";

export const searchOnEnterPress = () => {
  const inputField = document.querySelector('.search')

  inputField.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      const newUrl = createNewUrl(state);

      if (newUrl) {
        window.location.href = newUrl;
      }
    }
  });
}
