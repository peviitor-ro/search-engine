export const mapJobsResults = (jobs) => {
  const jobsMapped = [];

  if (jobs.length) {
    jobs.forEach(job => jobsMapped.push({
      company: job.company[0],
      city: job.city[0],
      title: job.job_title[0],
      link: job.job_link[0],
      isNew: false
    }))
  }

  return jobsMapped;
}