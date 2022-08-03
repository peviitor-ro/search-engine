export const mapJobsResults = (jobs) => {
  const jobsMapped = [];

  if (jobs.length) {
    jobs.forEach(job => jobsMapped.push({
      company: job.company ? job.company[0] : 'nespecificat',
      city: job.city ? job.city[0] : 'nespecificat',
      title: job.job_title ? job.job_title[0] : 'nespecificat',
      link: job.job_link ? job.job_link[0] : 'nespecificat',
      isNew: false
    }))
  }

  return jobsMapped;
}