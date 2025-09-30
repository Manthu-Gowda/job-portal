import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.scss';
import StatusCard from '../../Components/UI/StatusCard/StatusCard';
import SummaryCard from '../../Components/UI/SummaryCard/SummaryCard';
import { getApi } from '../../Utils/apiService';
import { errorToast } from '../../Services/ToastHelper';
import Loader from '../../Components/UI/Loader/Loader';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentApplications: [],
    recentJobs: []
  });
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from session storage or token
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    setUserRole(user.role || 'JOB_SEEKER');
    fetchDashboardData(user.role || 'JOB_SEEKER');
  }, []);

  const fetchDashboardData = async (role) => {
    try {
      setLoading(true);
      let endpoint = '';
      
      if (role === 'JOB_SEEKER') {
        endpoint = '/api/v1/job-seeker/dashboard';
      } else if (role === 'JOB_PROVIDER') {
        endpoint = '/api/v1/job-provider/dashboard';
      } else if (role === 'ADMIN') {
        endpoint = '/api/v1/admin/stats';
      }

      const response = await getApi(endpoint);
      
      if (response.success) {
        setDashboardData(response);
      } else {
        errorToast('Failed to fetch dashboard data');
      }
    } catch (error) {
      errorToast('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderJobSeekerDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Job Seeker Dashboard</h1>
        <p>Track your job applications and discover new opportunities</p>
      </div>

      <div className="stats-grid">
        <SummaryCard 
          title="Total Applications" 
          value={dashboardData.stats?.totalApplications || 0} 
        />
        <SummaryCard 
          title="Active Applications" 
          value={dashboardData.stats?.activeApplications || 0} 
        />
        <SummaryCard 
          title="Interviews" 
          value={dashboardData.stats?.interviews || 0} 
        />
        <SummaryCard 
          title="Job Offers" 
          value={dashboardData.stats?.offers || 0} 
        />
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h3>Profile Completeness</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${dashboardData.stats?.profileCompleteness || 0}%` }}
              ></div>
            </div>
            <span>{dashboardData.stats?.profileCompleteness || 0}%</span>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Recent Applications</h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/applications')}
            >
              View All
            </button>
          </div>
          <div className="recent-items">
            {dashboardData.recentApplications?.length > 0 ? (
              dashboardData.recentApplications.map((application) => (
                <div key={application._id} className="recent-item">
                  <div className="item-info">
                    <h4>{application.jobId?.basicInfo?.title}</h4>
                    <p>{application.jobId?.companyId?.companyInfo?.companyName}</p>
                    <span className={`status ${application.status?.current?.toLowerCase()}`}>
                      {application.status?.current}
                    </span>
                  </div>
                  <div className="item-date">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent applications</p>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => navigate('/jobs/search')}
            >
              Search Jobs
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/profile')}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobProviderDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <p>Manage your job postings and track applications</p>
      </div>

      <div className="stats-grid">
        <SummaryCard 
          title="Total Jobs Posted" 
          value={dashboardData.stats?.totalJobs || 0} 
        />
        <SummaryCard 
          title="Active Jobs" 
          value={dashboardData.stats?.activeJobs || 0} 
        />
        <SummaryCard 
          title="Total Applications" 
          value={dashboardData.stats?.totalApplications || 0} 
        />
        <SummaryCard 
          title="Pending Reviews" 
          value={dashboardData.stats?.pendingApplications || 0} 
        />
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <div className="section-header">
            <h3>Recent Applications</h3>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/applications')}
            >
              View All
            </button>
          </div>
          <div className="recent-items">
            {dashboardData.recentApplications?.length > 0 ? (
              dashboardData.recentApplications.map((application) => (
                <div key={application._id} className="recent-item">
                  <div className="item-info">
                    <h4>{application.jobSeekerId?.fullName}</h4>
                    <p>{application.jobId?.basicInfo?.title}</p>
                    <span className={`status ${application.status?.current?.toLowerCase()}`}>
                      {application.status?.current}
                    </span>
                  </div>
                  <div className="item-date">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent applications</p>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h3>Top Performing Jobs</h3>
          </div>
          <div className="recent-items">
            {dashboardData.topJobs?.length > 0 ? (
              dashboardData.topJobs.map((job) => (
                <div key={job._id} className="recent-item">
                  <div className="item-info">
                    <h4>{job.basicInfo?.title}</h4>
                    <p>{job.stats?.applications} applications • {job.stats?.views} views</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No jobs posted yet</p>
            )}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => navigate('/jobs/create')}
            >
              Post New Job
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/jobs')}
            >
              Manage Jobs
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor platform activity and manage users</p>
      </div>

      <div className="stats-grid">
        <SummaryCard 
          title="Total Users" 
          value={dashboardData.allUsersCount || 0} 
        />
        <SummaryCard 
          title="Job Seekers" 
          value={dashboardData.jobSeekersCount || 0} 
        />
        <SummaryCard 
          title="Job Providers" 
          value={dashboardData.jobProvidersCount || 0} 
        />
        <SummaryCard 
          title="Active Jobs" 
          value={dashboardData.activeJobsCount || 0} 
        />
      </div>

      <div className="quick-actions">
        <h3>Admin Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/admin/jobs')}
          >
            Moderate Jobs
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => navigate('/admin/reports')}
          >
            View Reports
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard">
      {userRole === 'JOB_SEEKER' && renderJobSeekerDashboard()}
      {userRole === 'JOB_PROVIDER' && renderJobProviderDashboard()}
      {userRole === 'ADMIN' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;