import React, { useState, useEffect } from 'react';
import './Profile.scss';
import FormInputs from '../../Components/UI/FormInputs/FormInputs';
import SelectInputs from '../../Components/UI/SelectInputs/SelectInputs';
import MultiSelectInput from '../../Components/UI/MultiSelectInput/MultiSelectInput';
import Buttons from '../../Components/UI/Buttons/Buttons';
import { getApi, postApi } from '../../Utils/apiService';
import { errorToast, successToast } from '../../Services/ToastHelper';
import Loader from '../../Components/UI/Loader/Loader';

const JobSeekerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      location: {
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      dateOfBirth: '',
      gender: ''
    },
    professionalInfo: {
      currentJobTitle: '',
      experience: 0,
      expectedSalary: {
        min: '',
        max: '',
        currency: 'USD'
      },
      skills: [],
      industries: [],
      jobTypes: [],
      workPreference: ''
    },
    workExperience: [],
    education: [],
    portfolio: {
      website: '',
      linkedin: '',
      github: '',
      other: []
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [currentExperience, setCurrentExperience] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrentJob: false,
    description: '',
    location: ''
  });
  const [currentEducation, setCurrentEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: ''
  });

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  const jobTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Internship', label: 'Internship' }
  ];

  const workPreferenceOptions = [
    { value: 'Remote', label: 'Remote' },
    { value: 'On-site', label: 'On-site' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  const skillOptions = [
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'Python', label: 'Python' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Java', label: 'Java' },
    { value: 'SQL', label: 'SQL' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Marketing', label: 'Marketing' }
  ];

  const industryOptions = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Consulting', label: 'Consulting' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getApi('/api/v1/job-seeker/profile');
      
      if (response.success) {
        setProfile(response.profile);
      }
    } catch (error) {
      // Profile might not exist yet, which is fine
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addWorkExperience = () => {
    if (currentExperience.company && currentExperience.position) {
      setProfile(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, currentExperience]
      }));
      setCurrentExperience({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrentJob: false,
        description: '',
        location: ''
      });
    }
  };

  const removeWorkExperience = (index) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      setProfile(prev => ({
        ...prev,
        education: [...prev.education, currentEducation]
      }));
      setCurrentEducation({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        grade: ''
      });
    }
  };

  const removeEducation = (index) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('profileData', JSON.stringify(profile));
      
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      const response = await postApi('/api/v1/job-seeker/profile', formData);
      
      if (response.success) {
        successToast('Profile updated successfully');
        fetchProfile();
      } else {
        errorToast(response.message || 'Failed to update profile');
      }
    } catch (error) {
      errorToast('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Job Seeker Profile</h1>
          <p>Complete your profile to get better job recommendations</p>
        </div>

        <div className="profile-form">
          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <FormInputs
                title="First Name"
                type="text"
                value={profile.personalInfo?.firstName || ''}
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                placeholder="Enter your first name"
              />
              <FormInputs
                title="Last Name"
                type="text"
                value={profile.personalInfo?.lastName || ''}
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                placeholder="Enter your last name"
              />
              <FormInputs
                title="Phone"
                type="tel"
                value={profile.personalInfo?.phone || ''}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                placeholder="Enter your phone number"
              />
              <SelectInputs
                label="Gender"
                options={genderOptions}
                value={profile.personalInfo?.gender || ''}
                onChange={(value) => handleInputChange('personalInfo', 'gender', value)}
                placeholder="Select gender"
              />
            </div>

            <div className="form-grid">
              <FormInputs
                title="City"
                type="text"
                value={profile.personalInfo?.location?.city || ''}
                onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'city', e.target.value)}
                placeholder="Enter your city"
              />
              <FormInputs
                title="State"
                type="text"
                value={profile.personalInfo?.location?.state || ''}
                onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'state', e.target.value)}
                placeholder="Enter your state"
              />
              <FormInputs
                title="Country"
                type="text"
                value={profile.personalInfo?.location?.country || ''}
                onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'country', e.target.value)}
                placeholder="Enter your country"
              />
              <FormInputs
                title="Zip Code"
                type="text"
                value={profile.personalInfo?.location?.zipCode || ''}
                onChange={(e) => handleNestedInputChange('personalInfo', 'location', 'zipCode', e.target.value)}
                placeholder="Enter your zip code"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="form-section">
            <h3>Professional Information</h3>
            <div className="form-grid">
              <FormInputs
                title="Current Job Title"
                type="text"
                value={profile.professionalInfo?.currentJobTitle || ''}
                onChange={(e) => handleInputChange('professionalInfo', 'currentJobTitle', e.target.value)}
                placeholder="Enter your current job title"
              />
              <FormInputs
                title="Years of Experience"
                type="number"
                value={profile.professionalInfo?.experience || ''}
                onChange={(e) => handleInputChange('professionalInfo', 'experience', parseInt(e.target.value) || 0)}
                placeholder="Enter years of experience"
              />
              <SelectInputs
                label="Work Preference"
                options={workPreferenceOptions}
                value={profile.professionalInfo?.workPreference || ''}
                onChange={(value) => handleInputChange('professionalInfo', 'workPreference', value)}
                placeholder="Select work preference"
              />
            </div>

            <div className="form-grid">
              <FormInputs
                title="Expected Salary (Min)"
                type="number"
                value={profile.professionalInfo?.expectedSalary?.min || ''}
                onChange={(e) => handleNestedInputChange('professionalInfo', 'expectedSalary', 'min', parseInt(e.target.value) || '')}
                placeholder="Minimum expected salary"
              />
              <FormInputs
                title="Expected Salary (Max)"
                type="number"
                value={profile.professionalInfo?.expectedSalary?.max || ''}
                onChange={(e) => handleNestedInputChange('professionalInfo', 'expectedSalary', 'max', parseInt(e.target.value) || '')}
                placeholder="Maximum expected salary"
              />
            </div>

            <div className="form-grid">
              <MultiSelectInput
                label="Skills"
                options={skillOptions}
                value={profile.professionalInfo?.skills || []}
                onChange={(value) => handleArrayInputChange('professionalInfo', 'skills', value)}
                placeholder="Select your skills"
              />
              <MultiSelectInput
                label="Industries"
                options={industryOptions}
                value={profile.professionalInfo?.industries || []}
                onChange={(value) => handleArrayInputChange('professionalInfo', 'industries', value)}
                placeholder="Select preferred industries"
              />
              <MultiSelectInput
                label="Job Types"
                options={jobTypeOptions}
                value={profile.professionalInfo?.jobTypes || []}
                onChange={(value) => handleArrayInputChange('professionalInfo', 'jobTypes', value)}
                placeholder="Select preferred job types"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div className="form-section">
            <h3>Resume</h3>
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="file-upload-label">
                {resumeFile ? resumeFile.name : 'Choose Resume File'}
              </label>
              {profile.resume?.secure_url && (
                <div className="current-resume">
                  <p>Current Resume: 
                    <a href={profile.resume.secure_url} target="_blank" rel="noopener noreferrer">
                      View Resume
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="form-section">
            <h3>Work Experience</h3>
            
            {/* Add New Experience */}
            <div className="add-experience">
              <h4>Add Work Experience</h4>
              <div className="form-grid">
                <FormInputs
                  title="Company"
                  type="text"
                  value={currentExperience.company}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
                <FormInputs
                  title="Position"
                  type="text"
                  value={currentExperience.position}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Job position"
                />
                <FormInputs
                  title="Start Date"
                  type="date"
                  value={currentExperience.startDate}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <FormInputs
                  title="End Date"
                  type="date"
                  value={currentExperience.endDate}
                  onChange={(e) => setCurrentExperience(prev => ({ ...prev, endDate: e.target.value }))}
                  disabled={currentExperience.isCurrentJob}
                />
              </div>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={currentExperience.isCurrentJob}
                    onChange={(e) => setCurrentExperience(prev => ({ 
                      ...prev, 
                      isCurrentJob: e.target.checked,
                      endDate: e.target.checked ? '' : prev.endDate
                    }))}
                  />
                  This is my current job
                </label>
              </div>
              <Buttons variant="secondary" onClick={addWorkExperience}>
                Add Experience
              </Buttons>
            </div>

            {/* Display Added Experiences */}
            <div className="experience-list">
              {profile.workExperience?.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h4>{exp.position} at {exp.company}</h4>
                    <Buttons 
                      variant="danger" 
                      size="small"
                      onClick={() => removeWorkExperience(index)}
                    >
                      Remove
                    </Buttons>
                  </div>
                  <p>{exp.startDate} - {exp.isCurrentJob ? 'Present' : exp.endDate}</p>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="form-section">
            <h3>Education</h3>
            
            {/* Add New Education */}
            <div className="add-education">
              <h4>Add Education</h4>
              <div className="form-grid">
                <FormInputs
                  title="Institution"
                  type="text"
                  value={currentEducation.institution}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="Institution name"
                />
                <FormInputs
                  title="Degree"
                  type="text"
                  value={currentEducation.degree}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="Degree"
                />
                <FormInputs
                  title="Field of Study"
                  type="text"
                  value={currentEducation.fieldOfStudy}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                  placeholder="Field of study"
                />
                <FormInputs
                  title="Grade/GPA"
                  type="text"
                  value={currentEducation.grade}
                  onChange={(e) => setCurrentEducation(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="Grade or GPA"
                />
              </div>
              <Buttons variant="secondary" onClick={addEducation}>
                Add Education
              </Buttons>
            </div>

            {/* Display Added Education */}
            <div className="education-list">
              {profile.education?.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <h4>{edu.degree} in {edu.fieldOfStudy}</h4>
                    <Buttons 
                      variant="danger" 
                      size="small"
                      onClick={() => removeEducation(index)}
                    >
                      Remove
                    </Buttons>
                  </div>
                  <p>{edu.institution}</p>
                  {edu.grade && <p>Grade: {edu.grade}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="form-section">
            <h3>Portfolio & Links</h3>
            <div className="form-grid">
              <FormInputs
                title="Website"
                type="url"
                value={profile.portfolio?.website || ''}
                onChange={(e) => handleInputChange('portfolio', 'website', e.target.value)}
                placeholder="Your website URL"
              />
              <FormInputs
                title="LinkedIn"
                type="url"
                value={profile.portfolio?.linkedin || ''}
                onChange={(e) => handleInputChange('portfolio', 'linkedin', e.target.value)}
                placeholder="LinkedIn profile URL"
              />
              <FormInputs
                title="GitHub"
                type="url"
                value={profile.portfolio?.github || ''}
                onChange={(e) => handleInputChange('portfolio', 'github', e.target.value)}
                placeholder="GitHub profile URL"
              />
            </div>
          </div>

          <div className="form-actions">
            <Buttons
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{ width: '200px' }}
            >
              Save Profile
            </Buttons>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;