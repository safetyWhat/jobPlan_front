import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Table, Alert, Spinner, Modal } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaPlus, FaRedo } from "react-icons/fa";
import DepartmentFormModal from "./deptEdit";

const DepartmentManagement = () => {
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState(null);

	// Delete modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [departmentToDelete, setDepartmentToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);

	const fetchDepartments = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/departments`,
			);
			setDepartments(response.data.data || []);
		} catch (err) {
			console.error("Error fetching departments:", err);
			setError("Failed to load departments. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDepartments();
	}, []);

	const handleEdit = (department) => {
		setSelectedDepartment(department);
		setShowEditModal(true);
	};

	const handleDelete = (department) => {
		setDepartmentToDelete(department);
		setShowDeleteModal(true);
		setDeleteError(null);
	};

	const confirmDelete = async () => {
		if (!departmentToDelete) return;

		setIsDeleting(true);
		setDeleteError(null);

		try {
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/departments/${departmentToDelete.id}`,
			);
			setShowDeleteModal(false);
			setDepartmentToDelete(null);
			fetchDepartments();
		} catch (err) {
			console.error("Error deleting department:", err);
			setDeleteError("Failed to delete department. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card className="shadow-sm mb-4">
			<Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
				<h5 className="mb-0">Department Management</h5>
				<div>
					<Button
						variant="light"
						size="sm"
						className="me-2"
						onClick={() => setShowCreateModal(true)}
					>
						<FaPlus className="me-1" /> Add Dept
					</Button>
					<Button
						variant="light"
						size="sm"
						onClick={fetchDepartments}
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
						<p className="mt-2">Loading departments...</p>
					</div>
				) : departments.length > 0 ? (
					<Table striped hover responsive>
						<thead>
							<tr>
								<th>ID</th>
								<th>Department Name</th>
								<th className="text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{departments.map((dept) => (
								<tr key={dept.id}>
									<td>{dept.id}</td>
									<td>{dept.name}</td>
									<td className="text-center">
										<Button
											variant="outline-primary"
											size="sm"
											className="me-2"
											onClick={() => handleEdit(dept)}
										>
											<FaEdit />
										</Button>
										<Button
											variant="outline-danger"
											size="sm"
											onClick={() => handleDelete(dept)}
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
						No departments found. Create your first department using
						the button above.
					</Alert>
				)}
			</Card.Body>

			{/* Create/Edit Modal */}
			<DepartmentFormModal
				show={showCreateModal}
				onHide={() => setShowCreateModal(false)}
				onSuccess={fetchDepartments}
				isEditMode={false}
			/>

			<DepartmentFormModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				department={selectedDepartment}
				onSuccess={fetchDepartments}
				isEditMode={true}
			/>

			{/* Delete Confirmation Modal */}
			<Modal
				show={showDeleteModal}
				onHide={() => setShowDeleteModal(false)}
			>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Delete</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{deleteError && (
						<Alert variant="danger">{deleteError}</Alert>
					)}
					<p>
						Are you sure you want to delete the department{" "}
						<strong>{departmentToDelete?.name}</strong>?
					</p>
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
								<Spinner
									as="span"
									animation="border"
									size="sm"
									className="me-2"
								/>
								Deleting...
							</>
						) : (
							"Delete Department"
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</Card>
	);
};

export default DepartmentManagement;
