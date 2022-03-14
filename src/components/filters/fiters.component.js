import './filters.style.scss';
import { filter } from '../filter/filter.component';
import { state } from '../../state';
import { query } from '../../variables/queryVariables';
import axios from "axios";

export const filters = () => {
    const filters = document.createElement('div');
    filters.classList = 'filters';

    const togglerText = document.createElement('div');
    togglerText.innerText = "Romania";
    togglerText.classList = "toggler";

    const toggleButton = document.createElement('div');

    filters.appendChild(togglerText);
    filters.appendChild(toggleButton);

    toggleButton.innerHTML = `
        <label class='switch'>
            <input class="checkbox-romania" type='checkbox'>
            <span class='slider round'></span>
        </label>
    `;

    const checkbox = toggleButton.querySelector('.checkbox-romania');
    checkbox.addEventListener('input', (e) => {
        console.log(e.target.value)
    })

    axios.get("https://api.peviitor.ro/v3/companies/")
        .then(response => {
            const newFilter = filter(response.data, query.company, state[query.company])
            filters.appendChild(newFilter)
        })

    return filters;
};