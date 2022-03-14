import './total-posts.component.scss';
import a from '../../axios';


export const totalJobs = () => {
  a.get("total/")
    .then(response => {
      const search = document.querySelector('.search');

      const total = document.createElement('label');
      total.innerText = "avem " + response.data.total.jobs + " oportunități";
      total.className = "total-jobs"

      search.appendChild(total);
    })
};
