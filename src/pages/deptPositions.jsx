import React, { useState } from 'react';
import axios from 'axios';
import useDepartmentsData from '../hooks/useDepartmentsData';
import usePositionsData from '../hooks/usePositionsData';
import { Card, Form, Button, Alert, Spinner, Table, Badge, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPencilAlt, FaRedo, FaSave } from 'react-icons/fa';

function DeptPositions() {
  return (
    <div>
      <h1>Department Positions</h1>
      <p>This is the department & positions page.</p>
    </div>
  );
}
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

export default DeptPositions;