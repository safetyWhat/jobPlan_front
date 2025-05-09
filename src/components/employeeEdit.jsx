import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";

const EmployeeFormModal = ({
	show,
	onHide,
	employee,
	departments,
	positions,
	onSuccess,
	isEditMode = false,
}) => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		email: "",
		departmentId: "",
		positionId: "",
		hiredAt: "",
		wage: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (show) {
			if (isEditMode && employee) {
				const formattedDate = employee.hiredAt
					? new Date(employee.hiredAt).toISOString().split("T")[0]
					: "";

				setFormData({
					firstName: employee.firstName || "",
					lastName: employee.lastName || "",
					phone: employee.phone || "",
					email: employee.email || "",
					departmentId: employee.departmentId || "",
					positionId: employee.positionId || "",
					hiredAt: formattedDate,
					wage: employee.wage ? employee.wage.toString() : "",
				});
			} else {
				setFormData({
					firstName: "",
					lastName: "",
					phone: "",
					email: "",
					departmentId: "",
					positionId: "",
					hiredAt: "",
					wage: "",
				});
			}
			setError(null);
			setSuccess(false);
		}
	}, [show, employee, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const processedValue =
			(name === "departmentId" || name === "positionId") && value
				? parseInt(value, 10)
				: value;

		setFormData((prev) => ({
			...prev,
			[name]: processedValue,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const wageAsNumber = formData.wage
				? parseFloat(formData.wage)
				: null;
			const formattedDate = formData.hiredAt
				? new Date(formData.hiredAt).toISOString()
				: null;

			const dataToSubmit = {
				...formData,
				hiredAt: formattedDate,
				wage: wageAsNumber,
			};

			if (isEditMode) {
				await axios.put(
					`${import.meta.env.VITE_API_URL}/employees/${employee.id}`,
					dataToSubmit,
				);
			} else {
				await axios.post(
					`${import.meta.env.VITE_API_URL}/employees`,
					dataToSubmit,
				);
			}

			setSuccess(true);
			if (onSuccess) onSuccess();

			setTimeout(() => {
				onHide();
			}, 1500);
		} catch (err) {
			console.error("Error saving employee:", err);
			const errorMessage =
				err.response?.data?.message ||
				err.response?.data?.error ||
				`Server error (${err.response?.status}): ${err.response?.statusText}`;
			setError(
				errorMessage || "Failed to save employee. Please try again.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					{isEditMode ? "Edit Employee" : "Add New Employee"}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{error && <Alert variant="danger">{error}</Alert>}
				{success && (
					<Alert variant="success">
						{isEditMode
							? "Employee updated successfully!"
							: "Employee created successfully!"}
					</Alert>
				)}

				<Form onSubmit={handleSubmit}>
					<div className="row">
						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									First Name{" "}
									<span className="text-danger">*</span>
								</Form.Label>
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
								<Form.Label>
									Last Name{" "}
									<span className="text-danger">*</span>
								</Form.Label>
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
								<Form.Label>
									Department{" "}
									<span className="text-danger">*</span>
								</Form.Label>
								<Form.Select
									name="departmentId"
									value={formData.departmentId}
									onChange={handleChange}
									required
								>
									<option value="">Select Department</option>
									{departments.map((dept) => (
										<option key={dept.id} value={dept.id}>
											{dept.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</div>

						<div className="col-md-6">
							<Form.Group className="mb-3">
								<Form.Label>
									Position{" "}
									<span className="text-danger">*</span>
								</Form.Label>
								<Form.Select
									name="positionId"
									value={formData.positionId}
									onChange={handleChange}
									required
								>
									<option value="">Select Position</option>
									{positions.map((position) => (
										<option
											key={position.id}
											value={position.id}
										>
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
						>
							Cancel
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={
								isLoading ||
								!formData.firstName ||
								!formData.lastName ||
								!formData.departmentId ||
								!formData.positionId
							}
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
								"Create Employee"
							)}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EmployeeFormModal;
