import './job.style.scss';

export const job = ({url, title, company, country, city}) => {
  const job = document.createElement('div');
  job.classList = 'job';
  job.setAttribute('itemscope','')
  job.setAttribute('itemtype','https://schema.org/JobPosting')

  job.innerHTML = `
      <a class="job__url" itemprop="url" href="http://${url}">${url}</a>
      <div class="job__title" itemprop="title">${title}</div>
      <div class="job__description">
        <span itemprop="hiringOrganization" itemscope itemtype="https://schema.org/Organization">
          <span itemprop="name">${company} | </span>
        </span>

        <span itemprop="jobLocation" itemscope itemtype="https://schema.org/Place">
          <span itemprop="location">${country}, ${city}</span>
        </span>
      </div>
  `

  return job;
}
