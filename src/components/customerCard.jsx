import { useState, useEffect } from "react";
import CustomerFormModal from "../components/customerEdit";
import axios from "axios";
import { Card, Button, Table, Alert, Spinner } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaRedo, FaPlus } from "react-icons/fa";

const CustomerManagement = () => {
	// State for customers list
	const [customers, setCustomers] = useState([]);
	// State for form data
	const [formData, setFormData] = useState({
		name: "",
		address: "",
		phone: "",
		fax: "",
		email: "",
	});
	// State for edit mode
	const [editMode, setEditMode] = useState(false);
	const [currentCustomerId, setCurrentCustomerId] = useState(null);
	// State for errors
	const [errors, setErrors] = useState({});
	// State for loading status
	const [loading, setLoading] = useState(false);
	// State for modal visibility
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch all customers on component mount
	useEffect(() => {
		fetchCustomers();
	}, []);

	// Function to fetch all customers
	const fetchCustomers = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/customers`,
			);
			// Handle potential undefined or incorrect response structure
			const customerData =
				response.data && response.data.data ? response.data.data : [];
			console.log("Fetched customers:", customerData);
			setCustomers(customerData);
		} catch (error) {
			console.error("Error fetching customers:", error);
			setCustomers([]);
		} finally {
			setLoading(false);
		}
	};

	// Function to fetch a single customer
	const fetchCustomer = async (id) => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/customers/${id}`,
			);
			setFormData(response.data.data);
			setEditMode(true);
			setCurrentCustomerId(id);
			setIsModalOpen(true); // Open modal for editing
		} catch (error) {
			console.error("Error fetching customer:", error);
		} finally {
			setLoading(false);
		}
	};

	// Handle form input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// Clear error for this field if it exists
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: null,
			}));
		}
	};

	// Validate form data
	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Customer name is required";
		}

		if (!formData.address.trim()) {
			newErrors.address = "Address is required";
		}

		if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
			newErrors.email = "Invalid email format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		try {
			if (editMode) {
				await axios.put(
					`${import.meta.env.VITE_API_URL}/customers/${currentCustomerId}`,
					formData,
				);
			} else {
				await axios.post(
					`${import.meta.env.VITE_API_URL}/customers`,
					formData,
				);
			}

			// Reset form, close modal and refresh customer list
			resetForm();
			setIsModalOpen(false);
			fetchCustomers();
		} catch (error) {
			console.error("Error saving customer:", error);
			if (error.response && error.response.data) {
				setErrors((prev) => ({
					...prev,
					submit:
						error.response.data.message ||
						"Failed to save customer",
				}));
			}
		} finally {
			setLoading(false);
		}
	};

	// Handle customer deletion
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this customer?"))
			return;

		setLoading(true);
		try {
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/customers/${id}`,
			);
			fetchCustomers();
		} catch (error) {
			console.error("Error deleting customer:", error);
		} finally {
			setLoading(false);
		}
	};

	// Reset form to initial state
	const resetForm = () => {
		setFormData({
			name: "",
			address: "",
			phone: "",
			fax: "",
			email: "",
		});
		setEditMode(false);
		setCurrentCustomerId(null);
		setErrors({});
	};

	// Open modal for creating a new customer
	const openCreateModal = () => {
		resetForm();
		setIsModalOpen(true);
	};

	// Close modal and reset form
	const closeModal = () => {
		resetForm();
		setIsModalOpen(false);
	};

	return (
		<div className="container mt-4">
			<Card className="shadow-sm">
				<Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Customer Management</h5>
					<div>
						<Button
							variant="light"
							size="sm"
							className="me-2"
							onClick={openCreateModal}
						>
							<FaPlus className="me-1" /> Add Customer
						</Button>
						<Button
							variant="light"
							size="sm"
							onClick={fetchCustomers}
							disabled={loading}
						>
							<FaRedo />
						</Button>
					</div>
				</Card.Header>
				<Card.Body>
					<CustomerFormModal
						isOpen={isModalOpen}
						onClose={closeModal}
						onSubmit={handleSubmit}
						formData={formData}
						onChange={handleChange}
						errors={errors}
						loading={loading}
						isEditMode={editMode}
					/>

					{loading ? (
						<div className="text-center p-3">
							<Spinner animation="border" variant="primary" />
							<p className="mt-2">Loading customers...</p>
						</div>
					) : !customers || customers.length === 0 ? (
						<Alert variant="info">
							No customers found. Create your first customer using
							the button above.
						</Alert>
					) : (
						<Table striped hover responsive>
							<thead>
								<tr>
									<th>Name</th>
									<th>Address</th>
									<th>Contact</th>
									<th className="text-center">Actions</th>
								</tr>
							</thead>
							<tbody>
								{customers.map((customer) => (
									<tr key={customer.id}>
										<td>{customer.name}</td>
										<td>{customer.address}</td>
										<td>
											{customer.phone && (
												<div>
													Phone: {customer.phone}
												</div>
											)}
											{customer.fax && (
												<div>Fax: {customer.fax}</div>
											)}
											{customer.email && (
												<div>
													Email: {customer.email}
												</div>
											)}
										</td>
										<td className="text-center">
											<Button
												variant="outline-primary"
												size="sm"
												className="me-2"
												onClick={() =>
													fetchCustomer(customer.id)
												}
											>
												<FaEdit />
											</Button>
											<Button
												variant="outline-danger"
												size="sm"
												onClick={() =>
													handleDelete(customer.id)
												}
											>
												<FaTrashAlt />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</Card.Body>
			</Card>
		</div>
	);
};

export default CustomerManagement;
