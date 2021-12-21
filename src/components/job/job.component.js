import './job.style.scss';

export const job = ({url, title, description}) => {
  const job = document.createElement('div');
  job.classList = 'job';

  const jobUrl = document.createElement('a');
  jobUrl.classList = 'job__url';
  jobUrl.innerText = url;
  jobUrl.href = `http://${url}`;
  jobUrl.target = '_blank';
  job.appendChild(jobUrl);

  const jobTitle = document.createElement('div');
  jobTitle.classList = 'job__title';
  jobTitle.innerText = title;
  job.appendChild(jobTitle);

  const jobDescription = document.createElement('div');
  jobDescription.classList = 'job__description';
  jobDescription.innerText = description;
  job.appendChild(jobDescription);

  return job;
}
