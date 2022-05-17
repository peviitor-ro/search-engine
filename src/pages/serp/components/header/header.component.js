import './header.style.scss';

import { logo } from '../../../../components/logo/logo.component';
import { searchComponent } from '../../../../components/search/search.component';

export const header = () => {
    const header = document.createElement('header');

    const logoDiv = logo();
    header.appendChild(logoDiv);

    const search = searchComponent();
    header.appendChild(search);

    return header;
};
