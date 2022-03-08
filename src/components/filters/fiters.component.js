import './filters.style.scss';
import {filter} from '../filter/filter.component';
import {state} from '../../state';
import {query} from '../../variables/queryVariables';
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


    toggleButton.innerHTML = "<label class='switch'>" +
        "<input type='checkbox'>" +
        "<span class='slider round'></span>" +
        "</label>";


    axios.get("https://api.peviitor.ro/v3/companies/")
        .then(response => {
            const filter2 = filter(response.data, query.company, state[query.company])
//             filter2.onchange=function (){
//                 let qs = new URLSearchParams(window.location.search);
//                 const current = qs.get("page");
//                 const getQ=qs.get("q");
//                 const url=window.location.href=`rezultate?q=${getQ}&page=${current}&company=${event.target.value}`;
//                 console.log(url)
// console.log(event.target.value)
//             }
            filters.appendChild(filter2)
        })


    return filters;
}
