import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, Alert, Spinner, Table, Badge, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPencilAlt, FaRedo, FaSave } from 'react-icons/fa';

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
                            aria-label='Create Department'
                            title='Create Department'
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
                            aria-label='Create Position'
                            title='Create Position'
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
    const [editMode, setEditMode] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [editName, setEditName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Handle edit click
    const handleEditClick = (dept) => {
        setEditingDepartment(dept);
        setEditName(dept.name);
        setUpdateError(null);
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!editName.trim()) return;
        
        setIsUpdating(true);
        setUpdateError(null);
        
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/departments/${editingDepartment.id}`, {
                name: editName
            });
            
            // Reset editing state
            setEditingDepartment(null);
            setEditName('');
            
            // Refresh the list
            onRefresh();
        } catch (err) {
            console.error('Error updating department:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setUpdateError(errorMessage || 'Failed to update department. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (dept) => {
        setDepartmentToDelete(dept);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!departmentToDelete) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/departments/${departmentToDelete.id}`);
            
            // Close modal and reset state
            setShowDeleteModal(false);
            setDepartmentToDelete(null);
            
            // Refresh the list
            onRefresh();
        } catch (err) {
            console.error('Error deleting department:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setDeleteError(errorMessage || 'Failed to delete department. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-secondary text-white d-flex justify-content-between align-items-center">
                    Existing Departments
                    <div>
                        <Button 
                            variant="light" 
                            size="sm" 
                            className="me-2"
                            onClick={() => setEditMode(!editMode)}
                            title={editMode ? "Exit Edit Mode" : "Edit Departments"}
                            aria-label={editMode ? "Exit Edit Mode" : "Edit Departments"}
                        >
                            {editMode ? <FaSave /> : <FaPencilAlt />}
                        </Button>
                        <Button 
                            variant="light" 
                            size="sm" 
                            onClick={onRefresh}
                            disabled={loading}
                            aria-label='Refresh Departments'
                            title='Refresh Departments'
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : <FaRedo />}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {updateError && <Alert variant="danger">{updateError}</Alert>}
                    
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
                                    {editMode && <th className="text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {departments.map(dept => (
                                    <tr key={dept.id}>
                                        <td>{dept.id}</td>
                                        <td>
                                            {editingDepartment?.id === dept.id ? (
                                                <Form.Control
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    size="sm"
                                                    autoFocus
                                                />
                                            ) : dept.name}
                                        </td>
                                        {editMode && (
                                            <td className="text-center">
                                                {editingDepartment?.id === dept.id ? (
                                                    <Button 
                                                        variant="success" 
                                                        size="sm"
                                                        onClick={handleSaveEdit}
                                                        disabled={isUpdating || !editName.trim()}
                                                        title='Save Changes'
                                                        aria-label='Save Changes'
                                                    >
                                                        {isUpdating ? <Spinner size="sm" animation="border" /> : <FaSave />}
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => handleEditClick(dept)}
                                                            title="Edit Department"
                                                            aria-label="Edit Department"
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(dept)}
                                                            title="Delete Department"
                                                            aria-label="Delete Department"
                                                        >
                                                            <FaTrashAlt />
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="info">No departments found. Create your first department above.</Alert>
                    )}
                </Card.Body>
            </Card>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    <p>Are you sure you want to delete the department <strong>{departmentToDelete?.name}</strong>?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        title='Cancel delete department'
                        aria-label='Cancel delete department'
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        title='Delete department'
                        aria-label='Delete department'
                    >
                        {isDeleting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : 'Delete Department'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const PositionsList = ({ positions, loading, error, onRefresh }) => {
    const [editMode, setEditMode] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);
    const [editName, setEditName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

    // Modal state for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Handle edit click
    const handleEditClick = (position) => {
        setEditingPosition(position);
        setEditName(position.name);
        setUpdateError(null);
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        if (!editName.trim()) return;
        
        setIsUpdating(true);
        setUpdateError(null);
        
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/positions/${editingPosition.id}`, {
                name: editName
            });
            
            // Reset editing state
            setEditingPosition(null);
            setEditName('');
            
            // Refresh the list
            onRefresh();
        } catch (err) {
            console.error('Error updating position:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setUpdateError(errorMessage || 'Failed to update position. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle delete click
    const handleDeleteClick = (position) => {
        setPositionToDelete(position);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!positionToDelete) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/positions/${positionToDelete.id}`);
            
            // Close modal and reset state
            setShowDeleteModal(false);
            setPositionToDelete(null);
            
            // Refresh the list
            onRefresh();
        } catch (err) {
            console.error('Error deleting position:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setDeleteError(errorMessage || 'Failed to delete position. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-secondary text-white d-flex justify-content-between align-items-center">
                    Existing Positions
                    <div>
                        <Button 
                            variant="light" 
                            size="sm" 
                            className="me-2"
                            onClick={() => setEditMode(!editMode)}
                            title={editMode ? "Exit Edit Mode" : "Edit Positions"}
                            aria-label={editMode ? "Exit Edit Mode" : "Edit Positions"}
                        >
                            {editMode ? <FaSave /> : <FaPencilAlt />}
                        </Button>
                        <Button 
                            variant="light" 
                            size="sm" 
                            onClick={onRefresh}
                            disabled={loading}
                            aria-label='Refresh Positions'
                            title='Refresh Positions'
                        >
                            {loading ? <Spinner size="sm" animation="border" /> : <FaRedo />}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {updateError && <Alert variant="danger">{updateError}</Alert>}
                    
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
                                    {editMode && <th className="text-center">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {positions.map(position => (
                                    <tr key={position.id}>
                                        <td>{position.id}</td>
                                        <td>
                                            {editingPosition?.id === position.id ? (
                                                <Form.Control
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    size="sm"
                                                    autoFocus
                                                />
                                            ) : position.name}
                                        </td>
                                        {editMode && (
                                            <td className="text-center">
                                                {editingPosition?.id === position.id ? (
                                                    <Button 
                                                        variant="success" 
                                                        size="sm"
                                                        onClick={handleSaveEdit}
                                                        disabled={isUpdating || !editName.trim()}
                                                        title='Save Changes'
                                                        aria-label='Save Changes'
                                                    >
                                                        {isUpdating ? <Spinner size="sm" animation="border" /> : <FaSave />}
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => handleEditClick(position)}
                                                            title="Edit Position"
                                                            aria-label="Edit Position"
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(position)}
                                                            title="Delete Position"
                                                            aria-label="Delete Position"
                                                        >
                                                            <FaTrashAlt />
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <Alert variant="info">No positions found. Create your first position above.</Alert>
                    )}
                </Card.Body>
            </Card>
            
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    <p>Are you sure you want to delete the position <strong>{positionToDelete?.name}</strong>?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                        title='Cancel delete position'
                        aria-label='Cancel delete position'
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        title='Delete position'
                        aria-label='Delete position'
                    >
                        {isDeleting ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Deleting...
                            </>
                        ) : 'Delete Position'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

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

// Main component to combine everything
const DeptPosition = () => {
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

export { 
    DeptPosition, 
    DepartmentCreation, 
    PositionCreation, 
    DepartmentsList, 
    PositionsList,
    EmployeeManagement,
    EmployeeCreationModal,
    EmployeeEditModal
};