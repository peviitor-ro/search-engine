import './results.style.scss';
import { job } from '../job/job.component.js';

export const results = (allJobs) => {
  const results = document.createElement('div');
  results.classList = 'results';
  const jobs = allJobs.map((job) => ({
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

  return results;
}