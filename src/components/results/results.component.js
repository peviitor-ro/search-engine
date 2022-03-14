import './results.style.scss';
import { job } from '../job/job.component.js';
import axios from "../../axios";
import { generateQueryString } from '../../utils/generateQueryString';

export const results = () => {
  const results = document.createElement('div');
  results.classList = 'results';

  const url_string = window.location.href
  const url = new URL(url_string);
  const q = url.searchParams.get("q");

  function search() {
    axios.get(`search/?q=${generateQueryString()}`)
      .then(response => {
        const data = response.data.response.docs;
        const jobs = data.map((job) => ({
          url: job.job_link[0],
          title: job.job_title[0],
          company: job.company[0],
          country: job.country[0],
          city: job.city[0]
        }))

        jobs.forEach(j => {
          const newJob = job(j);
          results.appendChild(newJob);
        });
      })
  }

  search();

  return results;
}