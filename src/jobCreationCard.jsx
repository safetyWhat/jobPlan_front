import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';

const JobCreationCard = () => {
  const [formData, setFormData] = useState({
    jobName: '',
    jobNum: '',
    sbId: '',
    siteAddress: '',
    customerId: '',
    customerName: '',
    projectManagerId: '',
    projectManagerName: '', // Added to store selected project manager name
    prevWage: false,
    driveTime: 'none',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Customer state
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const customerDropdownRef = useRef(null);
  
  // Project Manager state
  const [projectManagers, setProjectManagers] = useState([]);
  const [filteredProjectManagers, setFilteredProjectManagers] = useState([]);
  const [projectManagerSearchTerm, setProjectManagerSearchTerm] = useState('');
  const [showProjectManagerDropdown, setShowProjectManagerDropdown] = useState(false);
  const projectManagerDropdownRef = useRef(null);

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/customers`);
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch project managers on component mount
  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
        console.log('Employees response:', response.data);
        
        // Add more detailed logging to debug the employee structure
        if (response.data.data && response.data.data.length > 0) {
          console.log('First employee sample:', response.data.data[0]);
        }
        
        // More robust filtering with proper null checks
        const pmList = response.data.data.filter(emp => 
          emp && emp.position && emp.position.name === "Project Manager"
        );
        
        console.log('Filtered project managers:', pmList);
        setProjectManagers(pmList);
        setFilteredProjectManagers(pmList);
      } catch (err) {
        console.error('Error fetching project managers:', err);
      }
    };

    fetchProjectManagers();
  }, []);

  // Close customer dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close project manager dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (projectManagerDropdownRef.current && !projectManagerDropdownRef.current.contains(event.target)) {
        setShowProjectManagerDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle filtering customers when search term changes
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerSearchTerm, customers]);

  // Handle filtering project managers when search term changes
  useEffect(() => {
    if (projectManagerSearchTerm) {
      const filtered = projectManagers.filter(pm => {
        // Check for firstName and lastName instead of name
        const fullName = `${pm.firstName} ${pm.lastName}`.toLowerCase();
        return fullName.includes(projectManagerSearchTerm.toLowerCase());
      });
      setFilteredProjectManagers(filtered);
    } else {
      setFilteredProjectManagers(projectManagers);
    }
  }, [projectManagerSearchTerm, projectManagers]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCustomerSearch = (e) => {
    setCustomerSearchTerm(e.target.value);
    setShowCustomerDropdown(true);
  };

  const selectCustomer = (customer) => {
    setFormData(prevData => ({
      ...prevData,
      customerId: customer.id,
      customerName: customer.name
    }));
    setCustomerSearchTerm(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleProjectManagerSearch = (e) => {
    setProjectManagerSearchTerm(e.target.value);
    setShowProjectManagerDropdown(true);
  };

  // Update selectProjectManager function to use firstName and lastName
  const selectProjectManager = (pm) => {
    const fullName = `${pm.firstName} ${pm.lastName}`;
    setFormData(prevData => ({
      ...prevData,
      projectManagerId: pm.id,
      projectManagerName: fullName
    }));
    setProjectManagerSearchTerm(fullName);
    setShowProjectManagerDropdown(false);
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
        sbId: formData.sbId || null,
        siteAddress: formData.siteAddress || null,
        customerId: formData.customerId || null,
        projectManagerId: formData.projectManagerId || null,
        prevWage: formData.prevWage,
        driveTime: formData.driveTime,
        active: true,
        complete: false,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, dataToSubmit);
      setSuccess(true);
      setFormData({
        jobName: '',
        jobNum: '',
        sbId: '',
        siteAddress: '',
        customerId: '',
        customerName: '',
        projectManagerId: '',
        projectManagerName: '',
        prevWage: false,
        driveTime: 'none',
      });
      setCustomerSearchTerm('');
      setProjectManagerSearchTerm('');
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
            <Form.Label>SB ID</Form.Label>
            <Form.Control
              type="text"
              name="sbId"
              value={formData.sbId}
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

          {/* Customer search dropdown */}
          <Form.Group className="mb-3" ref={customerDropdownRef}>
            <Form.Label>Customer</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search customers..."
                value={customerSearchTerm}
                onChange={handleCustomerSearch}
                onClick={() => setShowCustomerDropdown(true)}
                autoComplete="off"
              />
              {formData.customerId && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, customerId: '', customerName: '' }));
                    setCustomerSearchTerm('');
                  }}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
            {showCustomerDropdown && (
              <div className="position-absolute w-100 bg-white shadow-sm rounded mt-1 z-index-1000" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className="p-2 cursor-pointer hover-bg-light border-bottom"
                      onClick={() => selectCustomer(customer)}
                      style={{ cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      {customer.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-muted">No customers found</div>
                )}
              </div>
            )}
            {formData.customerId && (
              <Form.Text className="text-success">
                Selected: {formData.customerName} (ID: {formData.customerId})
              </Form.Text>
            )}
          </Form.Group>

          {/* Project Manager search dropdown */}
          <Form.Group className="mb-3" ref={projectManagerDropdownRef}>
            <Form.Label>Project Manager</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search project managers..."
                value={projectManagerSearchTerm}
                onChange={handleProjectManagerSearch}
                onClick={() => setShowProjectManagerDropdown(true)}
                autoComplete="off"
              />
              {formData.projectManagerId && (
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, projectManagerId: '', projectManagerName: '' }));
                    setProjectManagerSearchTerm('');
                  }}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
            {showProjectManagerDropdown && (
              <div className="position-absolute w-100 bg-white shadow-sm rounded mt-1 z-index-1000" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                {filteredProjectManagers.length > 0 ? (
                  filteredProjectManagers.map(pm => (
                    <div
                      key={pm.id}
                      className="p-2 cursor-pointer hover-bg-light border-bottom"
                      onClick={() => selectProjectManager(pm)}
                      style={{ cursor: 'pointer' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
                    >
                      {`${pm.firstName} ${pm.lastName}`}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-muted">No project managers found</div>
                )}
              </div>
            )}
            {formData.projectManagerId && (
              <Form.Text className="text-success">
                Selected: {formData.projectManagerName} (ID: {formData.projectManagerId})
              </Form.Text>
            )}
          </Form.Group>

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
            
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Drive Time</Form.Label>
                <Form.Select
                  name="driveTime"
                  value={formData.driveTime}
                  onChange={handleChange}
                >
                  <option value="none">None</option>
                  <option value="standard">Standard</option>
                  <option value="plus">Plus</option>
                </Form.Select>
              </Form.Group>
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