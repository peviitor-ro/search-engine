import './results.style.scss';

export const resultsComponent = () => {
    const results = document.createElement('section');
    results.classList = 'results';
    results.innerText = 'Results';

    return results;
}