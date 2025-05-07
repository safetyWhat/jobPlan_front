import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus, FaRedo } from 'react-icons/fa';
import PositionFormModal from './positionEdit';

const PositionManagement = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    
    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [positionToDelete, setPositionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const fetchPositions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/positions`);
            setPositions(response.data.data || []);
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

    const handleEdit = (position) => {
        setSelectedPosition(position);
        setShowEditModal(true);
    };

    const handleDelete = (position) => {
        setPositionToDelete(position);
        setShowDeleteModal(true);
        setDeleteError(null);
    };

    const confirmDelete = async () => {
        if (!positionToDelete) return;
        
        setIsDeleting(true);
        setDeleteError(null);
        
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/positions/${positionToDelete.id}`);
            setShowDeleteModal(false);
            setPositionToDelete(null);
            fetchPositions();
        } catch (err) {
            console.error('Error deleting position:', err);
            setDeleteError('Failed to delete position. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Position Management</h5>
                <div>
                    <Button
                        variant="light"
                        size="sm"
                        className="me-2"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaPlus className="me-1" /> Add Position
                    </Button>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={fetchPositions}
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
                        <p className="mt-2">Loading positions...</p>
                    </div>
                ) : positions.length > 0 ? (
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Position Name</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map(pos => (
                                <tr key={pos.id}>
                                    <td>{pos.id}</td>
                                    <td>{pos.name}</td>
                                    <td className="text-center">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEdit(pos)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => handleDelete(pos)}
                                        >
                                            <FaTrashAlt />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info">
                        No positions found. Create your first position using the button above.
                    </Alert>
                )}
            </Card.Body>

            {/* Create/Edit Modal */}
            <PositionFormModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={fetchPositions}
                isEditMode={false}
            />

            <PositionFormModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                position={selectedPosition}
                onSuccess={fetchPositions}
                isEditMode={true}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
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
                        ) : 'Delete Position'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

export default PositionManagement;