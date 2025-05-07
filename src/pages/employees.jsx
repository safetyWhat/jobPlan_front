import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useDepartmentsData from '../hooks/useDepartmentsData';
import usePositionsData from '../hooks/usePositionsData';
import { Card, Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaRedo } from 'react-icons/fa';

const EmployeeManagement = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeToEdit, setEmployeeToEdit] = useState(null);
    
    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    
    // Use the existing hooks to get departments and positions data
    const { departments } = useDepartmentsData();
    const { positions } = usePositionsData();
    
    // Fetch employees list
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
            setEmployees(response.data.data || response.data); // Handle both data structures
            setError(null);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to load employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch employees on component mount
    useEffect(() => {
        fetchEmployees();
    }, []);
    
    // Handle edit employee click
    const handleEditClick = (employee) => {
        setEmployeeToEdit(employee);
        setShowEditModal(true);
    };
    
    // Handle delete employee click
    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
        setDeleteError(null);
    };
    
    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!employeeToDelete) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/employees/${employeeToDelete.id}`);
            
            // Close modal and reset state
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
            
            // Refresh the list
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
            const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error || 
                              `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setDeleteError(errorMessage || 'Failed to delete employee. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Helper functions for display
    const getDepartmentName = (departmentId) => {
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : 'Unknown Department';
    };
    
    const getPositionName = (positionId) => {
        const position = positions.find(p => p.id === positionId);
        return position ? position.name : 'Unknown Position';
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString();
    };
    
    return (
        <div className="container mt-4">
            <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-primary text-white d-flex justify-content-between align-items-center">
                    Employee Management
                    <div>
                        <Button 
                            variant="light"
                            size="sm"
                            onClick={() => setShowCreateModal(true)}
                            title="Add New Employee"
                            aria-label="Add New Employee"
                        >
                            Add Employee
                        </Button>
                        <Button 
                            variant="light" 
                            size="sm" 
                            className="ms-2"
                            onClick={fetchEmployees}
                            disabled={loading}
                            title="Refresh Employees List"
                            aria-label="Refresh Employees List"
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : <FaRedo />}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {loading ? (
                        <div className="text-center p-3">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading employees...</p>
                        </div>
                    ) : employees.length > 0 ? (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Contact</th>
                                    <th>Hired</th>
                                    <th>Wage</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        <td>{employee.id}</td>
                                        <td>{`${employee.firstName} ${employee.lastName}`}</td>
                                        <td>{getDepartmentName(employee.departmentId)}</td>
                                        <td>{getPositionName(employee.positionId)}</td>
                                        <td>
                                            {employee.email && <div>{employee.email}</div>}
                                            {employee.phone && <div>{employee.phone}</div>}
                                        </td>
                                        <td>{formatDate(employee.hiredAt)}</td>
                                        <td>${employee.wage ? employee.wage.toFixed(2) : 'N/A'}/hr</td>
                                        <td className="text-center">
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => handleEditClick(employee)}
                                                title="Edit Employee"
                                                aria-label={`Edit employee ${employee.firstName} ${employee.lastName}`}
                                            >
                                                <FaEdit aria-hidden="true" />
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDeleteClick(employee)}
                                                title="Delete Employee"
                                                aria-label={`Delete employee ${employee.firstName} ${employee.lastName}`}
                                            >
                                                <FaTrashAlt aria-hidden="true" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="info">No employees found. Add your first employee using the button above.</Alert>
                    )}
                </Card.Body>
            </Card>
            
            {/* Employee Creation Modal */}
            <EmployeeCreationModal 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                departments={departments}
                positions={positions}
                onSuccess={fetchEmployees}
            />
            
            {/* Employee Edit Modal */}
            <EmployeeEditModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                employee={employeeToEdit}
                departments={departments}
                positions={positions}
                onSuccess={fetchEmployees}
            />
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    <p>Are you sure you want to delete the employee <strong>{employeeToDelete && `${employeeToDelete.firstName} ${employeeToDelete.lastName}`}</strong>?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        title="Cancel delete employee"
                        aria-label="Cancel delete employee"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        title="Delete employee"
                        aria-label="Delete employee"
                    >
                        {isDeleting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : 'Delete Employee'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

// Employee Creation Modal component
const EmployeeCreationModal = ({ show, onHide, departments, positions, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        departmentId: '',
        positionId: '',
        hiredAt: '',
        wage: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Reset the form when the modal is opened/closed
    useEffect(() => {
        if (show) {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                departmentId: '',
                positionId: '',
                hiredAt: '',
                wage: ''
            });
            setError(null);
            setSuccess(false);
        }
    }, [show]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert departmentId and positionId to numbers, all others remain strings
        const processedValue = (name === 'departmentId' || name === 'positionId') && value 
            ? parseInt(value, 10) 
            : value;
            
        setFormData(prevData => ({
            ...prevData,
            [name]: processedValue
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            // Format wage as a number
            const wageAsNumber = formData.wage ? parseFloat(formData.wage) : null;
            
            // Format the hiredAt date to ISO-8601 if it exists
            const formattedDate = formData.hiredAt 
                ? new Date(formData.hiredAt).toISOString() 
                : null;
            
            const dataToSubmit = {
                ...formData,
                hiredAt: formattedDate,
                wage: wageAsNumber
            };
        
            console.log('Submitting employee data:', dataToSubmit);
            
            await axios.post(`${import.meta.env.VITE_API_URL}/employees`, dataToSubmit);
            setSuccess(true);
            
            // Clear form after successful submission
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                departmentId: '',
                positionId: '',
                hiredAt: '',
                wage: ''
            });
            
            // Call the success callback to refresh the list
            if (onSuccess) {
                onSuccess();
            }
            
            // Close modal after short delay to show success message
            setTimeout(() => {
                onHide();
            }, 1500);
            
        } catch (err) {
            console.error('Error creating employee:', err);
            const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error || 
                              `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setError(errorMessage || 'Failed to create employee. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header>
                <Modal.Title>Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Employee created successfully!</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="positionId"
                                    value={formData.positionId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Position</option>
                                    {positions.map(position => (
                                        <option key={position.id} value={position.id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Hire</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="hiredAt"
                                    value={formData.hiredAt}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Hourly Wage ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="wage"
                                    value={formData.wage}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <Button 
                            variant="secondary" 
                            onClick={onHide}
                            disabled={isLoading}
                            title="Cancel"
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isLoading || !formData.firstName || !formData.lastName || !formData.departmentId || !formData.positionId}
                            title="Create Employee"
                            aria-label="Create Employee"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Creating...
                                </>
                            ) : 'Create Employee'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

// New component for editing employees
const EmployeeEditModal = ({ show, onHide, employee, departments, positions, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        departmentId: '',
        positionId: '',
        hiredAt: '',
        wage: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Populate form when employee data changes or modal opens
    useEffect(() => {
        if (employee && show) {
            // Format date for input (YYYY-MM-DD)
            const formattedDate = employee.hiredAt 
                ? new Date(employee.hiredAt).toISOString().split('T')[0]
                : '';
                
            setFormData({
                firstName: employee.firstName || '',
                lastName: employee.lastName || '',
                phone: employee.phone || '',
                email: employee.email || '',
                departmentId: employee.departmentId || '',
                positionId: employee.positionId || '',
                hiredAt: formattedDate,
                wage: employee.wage ? employee.wage.toString() : ''
            });
            setError(null);
            setSuccess(false);
        }
    }, [employee, show]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Convert departmentId and positionId to numbers, all others remain strings
        const processedValue = (name === 'departmentId' || name === 'positionId') && value 
            ? parseInt(value, 10) 
            : value;
            
        setFormData(prevData => ({
            ...prevData,
            [name]: processedValue
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employee) return;
        
        setIsLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            // Format wage as a number
            const wageAsNumber = formData.wage ? parseFloat(formData.wage) : null;
            
            // Format the hiredAt date to ISO-8601 if it exists
            const formattedDate = formData.hiredAt 
                ? new Date(formData.hiredAt).toISOString() 
                : null;
            
            const dataToSubmit = {
                ...formData,
                hiredAt: formattedDate,
                wage: wageAsNumber
            };
        
            console.log('Updating employee data:', dataToSubmit);
            
            await axios.put(`${import.meta.env.VITE_API_URL}/employees/${employee.id}`, dataToSubmit);
            setSuccess(true);
            
            // Call the success callback to refresh the list
            if (onSuccess) {
                onSuccess();
            }
            
            // Close modal after short delay to show success message
            setTimeout(() => {
                onHide();
            }, 1500);
            
        } catch (err) {
            console.error('Error updating employee:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setError(errorMessage || 'Failed to update employee. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header>
                <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Employee updated successfully!</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Department <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="departmentId"
                                    value={formData.departmentId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="positionId"
                                    value={formData.positionId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Position</option>
                                    {positions.map(position => (
                                        <option key={position.id} value={position.id}>
                                            {position.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Hire</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="hiredAt"
                                    value={formData.hiredAt}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Hourly Wage ($)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="wage"
                                    value={formData.wage}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <Button 
                            variant="secondary" 
                            onClick={onHide}
                            disabled={isLoading}
                            title="Cancel"
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isLoading || !formData.firstName || !formData.lastName || !formData.departmentId || !formData.positionId}
                            title="Save Changes"
                            aria-label="Save Changes"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmployeeManagement;