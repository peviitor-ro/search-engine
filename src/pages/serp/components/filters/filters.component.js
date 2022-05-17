import './filter.style.scss';

export const filtersComponent = () => {
    const filters = document.createElement('aside');
    filters.classList = 'filters';
    filters.innerText = 'filters';

    return filters
}