import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
	Modal,
	Form,
	Button,
	Alert,
	Spinner,
	InputGroup,
	Row,
	Col,
} from "react-bootstrap";

const JobEditModal = ({ show, onHide, job, onSuccess, isEditMode = false }) => {
	const [formData, setFormData] = useState({
		jobName: "",
		jobNum: "",
		sbId: "",
		siteAddress: "",
		customerId: "",
		customerName: "",
		projectManagerId: "",
		projectManagerName: "",
		prevWage: false,
		driveTime: "none",
		active: true,
		complete: false,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Customer state
	const [customers, setCustomers] = useState([]);
	const [filteredCustomers, setFilteredCustomers] = useState([]);
	const [customerSearchTerm, setCustomerSearchTerm] = useState("");
	const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
	const customerDropdownRef = useRef(null);

	// Project Manager state
	const [projectManagers, setProjectManagers] = useState([]);
	const [filteredProjectManagers, setFilteredProjectManagers] = useState([]);
	const [projectManagerSearchTerm, setProjectManagerSearchTerm] =
		useState("");
	const [showProjectManagerDropdown, setShowProjectManagerDropdown] =
		useState(false);
	const projectManagerDropdownRef = useRef(null);

	// Reset form when modal opens/closes or job changes
	useEffect(() => {
		if (show) {
			if (isEditMode && job) {
				setFormData({
					jobName: job.jobName || "",
					jobNum: job.jobNum || "",
					sbId: job.sbId || "",
					siteAddress: job.siteAddress || "",
					customerId: job.customerId || "",
					customerName: job.customerName?.name || "",
					projectManagerId: job.projectManagerId || "",
					projectManagerName: job.projectManager
						? `${job.projectManager.firstName} ${job.projectManager.lastName}`
						: "",
					prevWage: job.prevWage || false,
					driveTime: job.driveTime || "none",
					active: job.active ?? true,
					complete: job.complete || false,
				});
			} else {
				setFormData({
					jobName: "",
					jobNum: "",
					sbId: "",
					siteAddress: "",
					customerId: "",
					customerName: "",
					projectManagerId: "",
					projectManagerName: "",
					prevWage: false,
					driveTime: "none",
					active: true,
					complete: false,
				});
			}
			setError(null);
			fetchCustomers();
			fetchProjectManagers();
		}
	}, [show, job, isEditMode]);

	// Fetch functions and handlers
	const fetchCustomers = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/customers`,
			);
			setCustomers(response.data.data);
			setFilteredCustomers(response.data.data);
		} catch (err) {
			console.error("Error fetching customers:", err);
		}
	};

	const fetchProjectManagers = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/employees`,
			);
			const pmList = response.data.data.filter(
				(emp) =>
					emp &&
					emp.position &&
					emp.position.name === "Project Manager",
			);
			setProjectManagers(pmList);
			setFilteredProjectManagers(pmList);
		} catch (err) {
			console.error("Error fetching project managers:", err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const url = isEditMode
				? `${import.meta.env.VITE_API_URL}/jobs/${job.id}`
				: `${import.meta.env.VITE_API_URL}/jobs`;

			const method = isEditMode ? "put" : "post";

			await axios[method](url, formData);

			if (onSuccess) {
				onSuccess();
			}
			onHide();
		} catch (err) {
			console.error("Error saving job:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.response?.data?.error ||
				"Failed to save job. Please try again.";
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleCustomerSearch = (e) => {
		const searchTerm = e.target.value;
		setCustomerSearchTerm(searchTerm);
		setFilteredCustomers(
			customers.filter((customer) =>
				customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
			),
		);
	};

	const selectCustomer = (customer) => {
		setFormData((prev) => ({
			...prev,
			customerId: customer.id,
			customerName: customer.name,
		}));
		setCustomerSearchTerm("");
		setShowCustomerDropdown(false);
	};

	const handleProjectManagerSearch = (e) => {
		const searchTerm = e.target.value;
		setProjectManagerSearchTerm(searchTerm);
		setFilteredProjectManagers(
			projectManagers.filter((pm) =>
				`${pm.firstName} ${pm.lastName}`
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
			),
		);
	};

	const selectProjectManager = (pm) => {
		setFormData((prev) => ({
			...prev,
			projectManagerId: pm.id,
			projectManagerName: `${pm.firstName} ${pm.lastName}`,
		}));
		setProjectManagerSearchTerm("");
		setShowProjectManagerDropdown(false);
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					{isEditMode ? "Edit Job" : "Create New Job"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error && <Alert variant="danger">{error}</Alert>}

				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>
							Job Name <span className="text-danger">*</span>
						</Form.Label>
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
										setFormData((prev) => ({
											...prev,
											customerId: "",
											customerName: "",
										}));
										setCustomerSearchTerm("");
									}}
								>
									Clear
								</Button>
							)}
						</InputGroup>
						{showCustomerDropdown && (
							<div
								className="position-absolute bg-white shadow-sm rounded mt-1"
								style={{
									zIndex: 1000,
									width: "95%",
									maxHeight: "200px",
									overflowY: "auto",
								}}
							>
								{filteredCustomers.map((customer) => (
									<div
										key={customer.id}
										className="p-2 hover-bg-light border-bottom"
										onClick={() => selectCustomer(customer)}
										style={{ cursor: "pointer" }}
									>
										{customer.name}
									</div>
								))}
							</div>
						)}
					</Form.Group>

					{/* Project Manager search dropdown */}
					<Form.Group
						className="mb-3"
						ref={projectManagerDropdownRef}
					>
						<Form.Label>Project Manager</Form.Label>
						<InputGroup>
							<Form.Control
								type="text"
								placeholder="Search project managers..."
								value={projectManagerSearchTerm}
								onChange={handleProjectManagerSearch}
								onClick={() =>
									setShowProjectManagerDropdown(true)
								}
								autoComplete="off"
							/>
							{formData.projectManagerId && (
								<Button
									variant="outline-secondary"
									onClick={() => {
										setFormData((prev) => ({
											...prev,
											projectManagerId: "",
											projectManagerName: "",
										}));
										setProjectManagerSearchTerm("");
									}}
								>
									Clear
								</Button>
							)}
						</InputGroup>
						{showProjectManagerDropdown && (
							<div
								className="position-absolute bg-white shadow-sm rounded mt-1"
								style={{
									zIndex: 1000,
									width: "95%",
									maxHeight: "200px",
									overflowY: "auto",
								}}
							>
								{filteredProjectManagers.map((pm) => (
									<div
										key={pm.id}
										className="p-2 hover-bg-light border-bottom"
										onClick={() => selectProjectManager(pm)}
										style={{ cursor: "pointer" }}
									>
										{`${pm.firstName} ${pm.lastName}`}
									</div>
								))}
							</div>
						)}
					</Form.Group>

					<Row>
						<Col md={6}>
							<Form.Check
								type="checkbox"
								id="prevWageCheck"
								label="Prevailing Wage"
								name="prevWage"
								checked={formData.prevWage}
								onChange={handleChange}
							/>
						</Col>

						<Col md={6}>
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
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<Form.Check
								type="checkbox"
								id="activeCheck"
								label="Active"
								name="active"
								checked={formData.active}
								onChange={handleChange}
							/>
						</Col>

						<Col md={6}>
							<Form.Check
								type="checkbox"
								id="completeCheck"
								label="Complete"
								name="complete"
								checked={formData.complete}
								onChange={handleChange}
							/>
						</Col>
					</Row>

					<div className="d-flex justify-content-end gap-2 mt-4">
						<Button variant="secondary" onClick={onHide}>
							Cancel
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={isLoading || !formData.jobName}
						>
							{isLoading ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										className="me-2"
									/>
									{isEditMode ? "Saving..." : "Creating..."}
								</>
							) : isEditMode ? (
								"Save Changes"
							) : (
								"Create Job"
							)}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default JobEditModal;
