import "./pagination.style.scss";

import { state } from "../../state";
import { query } from "../../variables/queryVariables";
import { updateStatePage } from "../../state/updateStatePage";
import { createNewUrl } from "../../utils/createNewUrl";

export const pagination = (totalResults) => {
    const pagination = document.createElement('div');
    pagination.className = "pagination";

    const step = 10;
    const pages = Math.ceil(totalResults / step);

    for (let i = 1; i <= pages; i++) {
        const page = document.createElement('div');
        const selected = state[query.page] === i.toString() ? 'selected' : '';
        page.className = `page ${selected}`;
        page.innerText = i;
        page.addEventListener('click', () => {
            updateStatePage(i);
            const newUrl = createNewUrl(state);
            window.location.href = newUrl;
        });
        pagination.appendChild(page);
    }

    return pagination;
};