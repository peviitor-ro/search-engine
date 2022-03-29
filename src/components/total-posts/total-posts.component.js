import './total-posts.component.scss';
import a from '../../axios';


export const totalJobs = () => {
  a.get("total/")
    .then(response => {
      const total = document.querySelector('.total-jobs');
      total.innerText = "avem " + response.data.total.jobs + " oportunități";
    })
};
