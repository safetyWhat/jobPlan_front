import React from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import useProjectManagersData from "../hooks/useProjectManagersData";
import useCustomersData from "../hooks/useCustomersData";

const JobFilters = ({ onFilterChange, onClearFilters }) => {
	const [filters, setFilters] = React.useState({
		jobNum: "",
		projectManagerId: "",
		customerId: "",
		active: "",
		driveTime: "",
		prevWage: "",
	});

	const { projectManagers } = useProjectManagersData();
	const { customers } = useCustomersData();

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		const newFilters = {
			...filters,
			[name]: value,
		};
		setFilters(newFilters);
		onFilterChange(newFilters);
	};

	const handleClearFilters = () => {
		const clearedFilters = {
			jobNum: "",
			projectManagerId: "",
			customerId: "",
			active: "",
			driveTime: "",
			prevWage: "",
		};
		setFilters(clearedFilters);
		onClearFilters();
	};

	return (
		<Card className="shadow-sm mb-4">
			<Card.Body>
				<Row>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Job Number</Form.Label>
							<Form.Control
								type="text"
								name="jobNum"
								value={filters.jobNum}
								onChange={handleFilterChange}
								placeholder="Search by job number"
							/>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Project Manager</Form.Label>
							<Form.Select
								name="projectManagerId"
								value={filters.projectManagerId}
								onChange={handleFilterChange}
							>
								<option value="">All Project Managers</option>
								{projectManagers?.map((pm) => (
									<option key={pm.id} value={pm.id}>
										{`${pm.firstName} ${pm.lastName}`}
									</option>
								))}
							</Form.Select>
						</Form.Group>
					</Col>
					<Col md={4}>
						<Form.Group className="mb-3">
							<Form.Label>Customer</Form.Label>
							<Form.Select
								name="customerId"
								value={filters.customerId}
								onChange={handleFilterChange}
							>
								<option value="">All Customers</option>
								{customers?.map((customer) => (
									<option
										key={customer.id}
										value={customer.id}
									>
										{customer.name}
									</option>
								))}
							</Form.Select>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col md={3}>
						<Form.Group className="mb-3">
							<Form.Label>Status</Form.Label>
							<Form.Select
								name="active"
								value={filters.active}
								onChange={handleFilterChange}
							>
								<option value="">All Status</option>
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</Form.Select>
						</Form.Group>
					</Col>
					<Col md={3}>
						<Form.Group className="mb-3">
							<Form.Label>Drive Time</Form.Label>
							<Form.Select
								name="driveTime"
								value={filters.driveTime}
								onChange={handleFilterChange}
							>
								<option value="">All Drive Times</option>
								<option value="none">None</option>
								<option value="standard">Standard</option>
								<option value="plus">Plus</option>
							</Form.Select>
						</Form.Group>
					</Col>
					<Col md={3}>
						<Form.Group className="mb-3">
							<Form.Label>Prevailing Wage</Form.Label>
							<Form.Select
								name="prevWage"
								value={filters.prevWage}
								onChange={handleFilterChange}
							>
								<option value="">All Jobs</option>
								<option value="true">Yes</option>
								<option value="false">No</option>
							</Form.Select>
						</Form.Group>
					</Col>
					<Col md={3} className="d-flex align-items-end">
						<Button
							variant="secondary"
							onClick={handleClearFilters}
							className="mb-3"
						>
							Clear Filters
						</Button>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default JobFilters;
