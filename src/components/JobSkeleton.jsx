import React from "react";
import "../scss/jobSkeleton.scss";

const JobSkeleton = () => {
  return (
    <div className="card skeleton">
      <div className="container-logo">
        <div className="skeleton-logo"></div>
      </div>
      <div className="card-info">
        <div className="skeleton-company-name"></div>
        <div className="skeleton-job-title"></div>
        <div className="skeleton-location"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
};

export default JobSkeleton;
