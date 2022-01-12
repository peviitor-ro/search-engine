import './search.style.scss';
import mGlassWhiteImg from '../../images/mglass-white.png';
import a from "../../axios";


export const searchComponent = (animation) => {
  const search = document.createElement('div');
  const form = document.createElement('div');
  form.classList = 'search__wrapper';
  const searchInput = document.createElement('input');

  const mGlass = document.createElement('div');

  a.get("total/")
      .then(response=>{
        const total = document.createElement('label');
        total.innerText="avem " + response.data.total.jobs + " oportunități";
        total.className="totalJobs"
        total.style="text-align: center;display: block;color: #b45f06;font-family: \"Oswald-Extra-Light\",Helvetica,sans-serif;"

        search.appendChild(total);
      })

  search.classList = `search ${animation ? 'search__animation' : ''}`;

  searchInput.id = "search-input";
  searchInput.classList = "search__input";
  searchInput.placeholder = "ce vrei să te faci când vei fi mare?";
  searchInput.autocomplete="off";

  mGlass.classList = 'search__icon'
  mGlass.innerHTML = `<img src=${mGlassWhiteImg} />`;


  form.appendChild(mGlass);
  search.appendChild(form);
  form.appendChild(searchInput);


  return search;
}
