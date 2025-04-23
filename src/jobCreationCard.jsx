import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const JobCreationCard = () => {
  const [formData, setFormData] = useState({
    jobName: '',
    jobNum: '',
    siteAddress: '',
    active: true,
    prevWage: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Only include required fields and ensure they aren't undefined
      const dataToSubmit = {
        jobName: formData.jobName,
        jobNum: formData.jobNum || null,
        siteAddress: formData.siteAddress || null,
        active: formData.active,
        prevWage: formData.prevWage,
        // Leave off fields that will get added later
        // sbId: null,
        // customerId: null,
        // projectManagerId: null,
        // driveTime: null,
        // driveTimeTypeId: null
      };

      console.log('Submitting data:', dataToSubmit);
      console.log('API URL:', import.meta.env.VITE_API_URL);

      await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, dataToSubmit);
      setSuccess(true);
      setFormData({
        jobName: '',
        jobNum: '',
        siteAddress: '',
        active: true,
        prevWage: false,
      });
    } catch (err) {
      console.error('Error creating job:', err);
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           `Server error (${err.response?.status}): ${err.response?.statusText}`;
      setError(errorMessage || 'Failed to create job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header as="h5" className="bg-primary text-white">Add New Job</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Job created successfully!</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Job Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="jobName"
              value={formData.jobName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Job Number</Form.Label>
            <Form.Control
              type="text"
              name="jobNum"
              value={formData.jobNum}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Site Address</Form.Label>
            <Form.Control
              type="text"
              name="siteAddress"
              value={formData.siteAddress}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Check
                type="checkbox"
                id="activeCheck"
                label="Active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Check
                type="checkbox"
                id="prevWageCheck"
                label="Prevailing Wage"
                name="prevWage"
                checked={formData.prevWage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              className="mt-3"
              disabled={isLoading || !formData.jobName}
            >
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : 'Create Job'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default JobCreationCard;