export const mapApiData = (jobs) => {
  return jobs.map((job) => ({
    jobTitle: job.job_title?.[0] ? job.job_title[0] : 'nespecificat',
    company: job.company?.[0] ? job.company[0] : 'nespecificat',
    location: job.country?.[0] ? job.country[0] : 'nespecificat',
    city: job.city?.[0] ? job.city : 'nespecificat',
    county: job.county?.[0] ? job.county : 'nespecificat',
    country: job.country?.[0] ? job.country[0] : 'nespecificat',
    remote: job.remote?.[0] ? job.remote[0] : 'nespecificat',
    link: job.job_link?.[0] ? job.job_link[0] : 'nespecificat'
  }));
};
