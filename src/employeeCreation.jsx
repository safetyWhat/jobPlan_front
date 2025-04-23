import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner, Table, Badge } from 'react-bootstrap';

// Create a custom hook for departments data management
const useDepartmentsData = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDepartments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/departments`);
            setDepartments(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to load departments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return { departments, loading, error, fetchDepartments };
};

// Create a custom hook for positions data management
const usePositionsData = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/positions`);
            setPositions(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching positions:', err);
            setError('Failed to load positions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    return { positions, loading, error, fetchPositions };
};

const DepartmentCreation = ({ onDepartmentCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
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
            const dataToSubmit = {
                name: formData.name
            };
        
            console.log('Submitting data:', dataToSubmit);
            console.log('API URL:', import.meta.env.VITE_API_URL);
        
            await axios.post(`${import.meta.env.VITE_API_URL}/departments`, dataToSubmit);
            setSuccess(true);
            setFormData({
                name: ''
            });
            
            // Call the callback to trigger a refresh of the departments list
            if (onDepartmentCreated) {
                onDepartmentCreated();
            }
        } catch (err) {
            console.error('Error submitting data:', err);
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setError(errorMessage || 'Failed to create department. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="bg-primary text-white">Add New Department</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Department created successfully!</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Department Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                            disabled={isLoading || !formData.name}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Creating...
                                </>
                            ) : 'Create Department'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const PositionCreation = ({ onPositionCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
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
            const dataToSubmit = {
                name: formData.name
            };
        
            console.log('Submitting data:', dataToSubmit);
            console.log('API URL:', import.meta.env.VITE_API_URL);
        
            await axios.post(`${import.meta.env.VITE_API_URL}/positions`, dataToSubmit);
            setSuccess(true);
            setFormData({
                name: ''
            });
            
            // Call the callback to trigger a refresh of the positions list
            if (onPositionCreated) {
                onPositionCreated();
            }
        } catch (err) {
            console.error('Error submitting data:', err);
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setError(errorMessage || 'Failed to create position. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="bg-primary text-white">Add New Position</Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Position created successfully!</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Position Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                            disabled={isLoading || !formData.name}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Creating...
                                </>
                            ) : 'Create Position'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const DepartmentsList = ({ departments, loading, error, onRefresh }) => {
    return (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="bg-secondary text-white d-flex justify-content-between align-items-center">
                Existing Departments
                <Button 
                    variant="light" 
                    size="sm" 
                    onClick={onRefresh}
                    disabled={loading}
                >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Refresh'}
                </Button>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                {loading ? (
                    <div className="text-center p-3">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading departments...</p>
                    </div>
                ) : departments.length > 0 ? (
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Department Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map(dept => (
                                <tr key={dept.id}>
                                    <td>{dept.id}</td>
                                    <td>{dept.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No departments found. Create your first department above.</Alert>
                )}
            </Card.Body>
        </Card>
    );
};

const PositionsList = ({ positions, loading, error, onRefresh }) => {
    return (
        <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="bg-secondary text-white d-flex justify-content-between align-items-center">
                Existing Positions
                <Button 
                    variant="light" 
                    size="sm" 
                    onClick={onRefresh}
                    disabled={loading}
                >
                    {loading ? <Spinner size="sm" animation="border" /> : 'Refresh'}
                </Button>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                {loading ? (
                    <div className="text-center p-3">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading positions...</p>
                    </div>
                ) : positions.length > 0 ? (
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Position Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map(position => (
                                <tr key={position.id}>
                                    <td>{position.id}</td>
                                    <td>{position.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">No positions found. Create your first position above.</Alert>
                )}
            </Card.Body>
        </Card>
    );
};

// Main component to combine everything
const AdminPage = () => {
    // Use the custom hooks to manage data
    const { departments, loading: deptLoading, error: deptError, fetchDepartments } = useDepartmentsData();
    const { positions, loading: posLoading, error: posError, fetchPositions } = usePositionsData();

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-md-6">
                    <DepartmentsList 
                        departments={departments}
                        loading={deptLoading}
                        error={deptError}
                        onRefresh={fetchDepartments}
                    />
                    <DepartmentCreation onDepartmentCreated={fetchDepartments} />
                </div>
                <div className="col-md-6">
                    <PositionsList 
                        positions={positions}
                        loading={posLoading}
                        error={posError}
                        onRefresh={fetchPositions}
                    />
                    <PositionCreation onPositionCreated={fetchPositions} />
                </div>
            </div>
        </div>
    );
};

export { AdminPage, DepartmentCreation, PositionCreation, DepartmentsList, PositionsList };