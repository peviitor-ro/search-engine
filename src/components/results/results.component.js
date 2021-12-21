import './results.style.scss';
import { job } from '../job/job.component.js';

export const results = () => {
  const results = document.createElement('div');
  results.classList = 'results';
  
  const jobs = [
    {
      url: 'www.google.com',
      title: 'This is a job',
      description: 'the best description',
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      description: 'the best description',
    },
    {
      url: 'www.google.com',
      title: 'This is a job',
      description: 'the best description',
    },
  ]

  jobs.forEach(j => {
    const newJob = job(j);
    results.appendChild(newJob);
  })


  return results;
}