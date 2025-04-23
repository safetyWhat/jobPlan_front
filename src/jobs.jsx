import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Individual Job Card Component
const JobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className="h-100 shadow-sm mb-3">
      <Card.Header 
        className="d-flex justify-content-between align-items-center cursor-pointer"
        onClick={toggleExpand}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <h5 className="mb-0">{job.jobName}</h5>
          <small className="text-muted">{job.jobNum || 'No Job Number'}</small>
        </div>
        <div className="d-flex align-items-center">
          {job.active && <Badge bg="success" className="me-2">Active</Badge>}
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </Card.Header>
      
      {expanded && (
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <h6>Status</h6>
              <div>
                {job.active ? (
                  <Badge bg="success" className="me-1">Active</Badge>
                ) : (
                  <Badge bg="secondary" className="me-1">Inactive</Badge>
                )}
                {job.complete && <Badge bg="info" className="me-1">Complete</Badge>}
                {job.prevWage && <Badge bg="warning" className="me-1">Prevailing Wage</Badge>}
              </div>
            </Col>
          </Row>

          {job.siteAddress && (
            <Row className="mb-3">
              <Col>
                <h6>Site Address</h6>
                <p>{job.siteAddress}</p>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col md={6}>
              <h6>Customer</h6>
              <p>{job.customerName?.name || 'Not assigned'}</p>
            </Col>
            <Col md={6}>
              <h6>Project Manager</h6>
              <p>
                {job.projectManager 
                  ? `${job.projectManager.firstName} ${job.projectManager.lastName}`
                  : 'Not assigned'}
              </p>
            </Col>
          </Row>

          {(job.driveTime || job.driveTimeType) && (
            <Row className="mb-3">
              <Col>
                <h6>Drive Time</h6>
                <p>
                  {job.driveTime ? `${job.driveTime} ${job.driveTimeType?.name || ''}` : 'Not specified'}
                </p>
              </Col>
            </Row>
          )}
          
          <Row>
            <Col>
              <h6>Date Information</h6>
              <p className="mb-1">Created: {formatDate(job.createdAt)}</p>
              <p className="mb-0">Last Updated: {formatDate(job.updatedAt)}</p>
            </Col>
          </Row>
        </Card.Body>
      )}
    </Card>
  );
};

// Main Jobs Component
const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
        
        if (response.data && response.data.success) {
          setJobs(response.data.data);
        } else {
          throw new Error('Failed to fetch jobs data');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            'Failed to load jobs. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (jobs.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          No jobs found. Create a new job to get started.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Jobs</h1>
        <span className="text-muted">
          {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} found
        </span>
      </div>
      
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </Container>
  );
};

export default Jobs;