import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobSearch.scss';
import FormInputs from '../../Components/UI/FormInputs/FormInputs';
import SelectInputs from '../../Components/UI/SelectInputs/SelectInputs';
import Buttons from '../../Components/UI/Buttons/Buttons';
import { getApi } from '../../Utils/apiService';
import { errorToast } from '../../Services/ToastHelper';
import Loader from '../../Components/UI/Loader/Loader';

const JobSearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    workMode: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    page: 1,
    limit: 10
  });

  const jobTypeOptions = [
    { value: '', label: 'All Job Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Internship', label: 'Internship' }
  ];

  const workModeOptions = [
    { value: '', label: 'All Work Modes' },
    { value: 'Remote', label: 'Remote' },
    { value: 'On-site', label: 'On-site' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  const experienceLevelOptions = [
    { value: '', label: 'All Experience Levels' },
    { value: 'Entry Level', label: 'Entry Level' },
    { value: 'Mid Level', label: 'Mid Level' },
    { value: 'Senior Level', label: 'Senior Level' },
    { value: 'Executive', label: 'Executive' }
  ];

  useEffect(() => {
    searchJobs();
  }, [filters.page]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const searchJobs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await getApi(`/api/v1/job-seeker/jobs/search?${queryParams}`);
      
      if (response.success) {
        setJobs(response.jobs);
        setPagination(response.pagination);
      } else {
        errorToast('Failed to fetch jobs');
      }
    } catch (error) {
      errorToast('Error searching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
    searchJobs();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatSalary = (min, max, currency = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `${formatter.format(min)}+`;
    }
    return 'Salary not specified';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div className="job-search">
      <div className="job-search-container">
        <div className="search-header">
          <h1>Find Your Dream Job</h1>
          <p>Discover opportunities that match your skills and aspirations</p>
        </div>

        <div className="search-filters">
          <div className="filter-row">
            <div className="filter-group">
              <FormInputs
                title="Keywords"
                type="text"
                placeholder="Job title, skills, or company"
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <FormInputs
                title="Location"
                type="text"
                placeholder="City, state, or country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <SelectInputs
                label="Job Type"
                options={jobTypeOptions}
                value={filters.jobType}
                onChange={(value) => handleFilterChange('jobType', value)}
                placeholder="Select job type"
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <SelectInputs
                label="Work Mode"
                options={workModeOptions}
                value={filters.workMode}
                onChange={(value) => handleFilterChange('workMode', value)}
                placeholder="Select work mode"
              />
            </div>
            <div className="filter-group">
              <SelectInputs
                label="Experience Level"
                options={experienceLevelOptions}
                value={filters.experienceLevel}
                onChange={(value) => handleFilterChange('experienceLevel', value)}
                placeholder="Select experience level"
              />
            </div>
            <div className="filter-group">
              <div className="salary-range">
                <FormInputs
                  title="Min Salary"
                  type="number"
                  placeholder="Minimum salary"
                  value={filters.salaryMin}
                  onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                />
                <FormInputs
                  title="Max Salary"
                  type="number"
                  placeholder="Maximum salary"
                  value={filters.salaryMax}
                  onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="search-actions">
            <Buttons
              variant="primary"
              onClick={handleSearch}
              loading={loading}
            >
              Search Jobs
            </Buttons>
            <Buttons
              variant="default"
              onClick={() => {
                setFilters({
                  keyword: '',
                  location: '',
                  jobType: '',
                  workMode: '',
                  experienceLevel: '',
                  salaryMin: '',
                  salaryMax: '',
                  page: 1,
                  limit: 10
                });
                searchJobs();
              }}
            >
              Clear Filters
            </Buttons>
          </div>
        </div>

        <div className="search-results">
          <div className="results-header">
            <h3>
              {pagination.totalJobs ? `${pagination.totalJobs} jobs found` : 'No jobs found'}
            </h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="jobs-list">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job._id} className="job-card">
                    <div className="job-header">
                      <div className="company-logo">
                        {job.companyId?.companyLogo?.secure_url ? (
                          <img 
                            src={job.companyId.companyLogo.secure_url} 
                            alt={job.companyId.companyInfo?.companyName}
                          />
                        ) : (
                          <div className="logo-placeholder">
                            {job.companyId?.companyInfo?.companyName?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>
                      <div className="job-info">
                        <h4 className="job-title">{job.basicInfo?.title}</h4>
                        <p className="company-name">{job.companyId?.companyInfo?.companyName}</p>
                        <div className="job-meta">
                          <span className="location">
                            📍 {job.location?.city}, {job.location?.state}
                          </span>
                          <span className="job-type">{job.basicInfo?.jobType}</span>
                          <span className="work-mode">{job.basicInfo?.workMode}</span>
                          <span className="posted-date">{getTimeAgo(job.postedAt)}</span>
                        </div>
                      </div>
                      <div className="job-actions">
                        <div className="salary">
                          {formatSalary(
                            job.compensation?.salaryRange?.min,
                            job.compensation?.salaryRange?.max,
                            job.compensation?.salaryRange?.currency
                          )}
                        </div>
                        <Buttons
                          variant="primary"
                          size="middle"
                          onClick={() => navigate(`/jobs/${job._id}`)}
                        >
                          View Details
                        </Buttons>
                      </div>
                    </div>
                    
                    <div className="job-description">
                      <p>{job.description?.overview?.substring(0, 200)}...</p>
                    </div>

                    <div className="job-tags">
                      {job.requirements?.skills?.required?.slice(0, 5).map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>

                    <div className="job-stats">
                      <span>👁️ {job.stats?.views || 0} views</span>
                      <span>📝 {job.stats?.applications || 0} applications</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-jobs">
                  <h3>No jobs found</h3>
                  <p>Try adjusting your search criteria or check back later for new opportunities.</p>
                </div>
              )}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <Buttons
                variant="default"
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </Buttons>
              
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <Buttons
                variant="default"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </Buttons>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;