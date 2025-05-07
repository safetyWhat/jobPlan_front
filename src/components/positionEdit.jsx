import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';

const PositionFormModal = ({ 
    show, 
    onHide, 
    position, 
    onSuccess, 
    isEditMode = false 
}) => {
    const [formData, setFormData] = useState({
        name: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        if (show) {
            if (isEditMode && position) {
                setFormData({
                    name: position.name || ''
                });
            } else {
                setFormData({
                    name: ''
                });
            }
            setError(null);
            setSuccess(false);
        }
    }, [show, position, isEditMode]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);
    
        try {
            if (isEditMode) {
                await axios.put(`${import.meta.env.VITE_API_URL}/positions/${position.id}`, formData);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/positions`, formData);
            }
            
            setSuccess(true);
            
            if (onSuccess) {
                onSuccess();
            }
            
            // Close modal after short delay to show success message
            setTimeout(() => {
                onHide();
            }, 1500);
            
        } catch (err) {
            console.error('Error saving position:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               `Server error (${err.response?.status}): ${err.response?.statusText}`;
            setError(errorMessage || 'Failed to save position. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? 'Edit Position' : 'Add New Position'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">
                    {isEditMode ? 'Position updated successfully!' : 'Position created successfully!'}
                </Alert>}

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

                    <div className="d-flex justify-content-end gap-2">
                        <Button 
                            variant="secondary" 
                            onClick={onHide}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isLoading || !formData.name}
                        >
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    {isEditMode ? 'Saving...' : 'Creating...'}
                                </>
                            ) : (isEditMode ? 'Save Changes' : 'Create Position')}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PositionFormModal;