import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Table, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaRedo, FaPlus } from 'react-icons/fa';
import EmployeeFormModal from './employeeEdit';
import useDepartmentsData from '../hooks/useDepartmentsData';
import usePositionsData from '../hooks/usePositionsData';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    
    // Use the existing hooks to get departments and positions data
    const { departments } = useDepartmentsData();
    const { positions } = usePositionsData();
    
    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
            setEmployees(response.data.data || response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching employees:', err);
            setError('Failed to load employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setShowEditModal(true);
    };

    const handleDelete = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/employees/${employeeToDelete.id}`);
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
            fetchEmployees();
        } catch (err) {
            console.error('Error deleting employee:', err);
            setDeleteError('Failed to delete employee. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

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
        <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Employee Management</h5>
                <div>
                    <Button
                        variant="light"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaPlus className="me-1" /> Add Employee
                    </Button>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={fetchEmployees}
                        disabled={loading}
                    >
                        <FaRedo />
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
                                            onClick={() => handleEdit(employee)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(employee)}
                                        >
                                            <FaTrashAlt />
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

            {/* Create/Edit Modal */}
            <EmployeeFormModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                departments={departments}
                positions={positions}
                onSuccess={fetchEmployees}
                isEditMode={false}
            />

            <EmployeeFormModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                employee={selectedEmployee}
                departments={departments}
                positions={positions}
                onSuccess={fetchEmployees}
                isEditMode={true}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteError && <Alert variant="danger">{deleteError}</Alert>}
                    <p>Are you sure you want to delete the employee <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>?</p>
                    <p className="text-danger">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="danger"
                        onClick={confirmDelete}
                        disabled={isDeleting}
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
        </Card>
    );
};

export default EmployeeManagement;