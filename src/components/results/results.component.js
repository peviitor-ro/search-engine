import './results.style.scss';
import { job } from '../job/job.component.js';

export const results = () => {
  const results = document.createElement('div');
  results.classList = 'results';
  
  const jobs = [
    {
      url: 'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      company: 'Endava',
      country: 'Romania',
      city: 'Cluj'
    },
  ]

  jobs.forEach(j => {
    const newJob = job(j);
    results.appendChild(newJob);
  })


  return results;
}