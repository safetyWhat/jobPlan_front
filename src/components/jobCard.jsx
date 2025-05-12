import React, { useState } from "react";
import axios from "axios";
import {
	Card,
	Badge,
	Button,
	Spinner,
	Alert,
	Container,
	Row,
	Col,
	Modal,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaRedo, FaPlus } from "react-icons/fa";
import JobEditModal from "./jobEdit";

const JobManagement = ({ jobs = [], isLoading = true, onJobChange }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedJob, setSelectedJob] = useState(null);
	const [expandedJobId, setExpandedJobId] = useState(null);

	// Delete modal state
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [jobToDelete, setJobToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState(null);

	const fetchJobs = async () => {
		if (onJobChange) {
			onJobChange();
		}
	};

	const handleJobClick = (jobId) => {
		setExpandedJobId(expandedJobId === jobId ? null : jobId);
	};

	const handleEdit = (job) => {
		setSelectedJob(job);
		setShowEditModal(true);
	};

	const handleDelete = (job) => {
		setJobToDelete(job);
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		if (!jobToDelete) return;

		setIsDeleting(true);
		setDeleteError(null);

		try {
			await axios.delete(
				`${import.meta.env.VITE_API_URL}/jobs/${jobToDelete.id}`,
			);
			setShowDeleteModal(false);
			setJobToDelete(null);
			fetchJobs();
		} catch (err) {
			console.error("Error deleting job:", err);
			setDeleteError("Failed to delete job. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Container className="mt-4">
			<Card className="shadow-sm">
				<Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Job Management</h5>
					<div>
						<Button
							variant="light"
							size="sm"
							className="me-2"
							onClick={() => setShowCreateModal(true)}
						>
							<FaPlus className="me-1" /> Add Job
						</Button>
						<Button
							variant="light"
							size="sm"
							onClick={fetchJobs}
							disabled={isLoading}
						>
							<FaRedo />
						</Button>
					</div>
				</Card.Header>
				<Card.Body>
					{isLoading ? (
						<div className="text-center p-3">
							<Spinner animation="border" variant="primary" />
							<p className="mt-2">Loading jobs...</p>
						</div>
					) : jobs.length === 0 ? (
						<Alert variant="info">
							No jobs found. Create your first job using the
							button above.
						</Alert>
					) : (
						jobs.map((job) => (
							<Card
								key={job.id}
								className="mb-3 shadow-sm"
								onClick={() => handleJobClick(job.id)}
								style={{ cursor: "pointer" }}
							>
								<Card.Header className="d-flex justify-content-between align-items-center">
									<div>
										<h6 className="mb-0">{job.jobName}</h6>
										<small className="text-muted">
											{job.jobNum || "No Job Number"}
										</small>
									</div>
								</Card.Header>

								{expandedJobId === job.id && (
									<Card.Body>
										<div className="d-flex justify-content-end mb-3">
											<Button
												variant="outline-primary"
												size="sm"
												className="me-2"
												onClick={(e) => {
													e.stopPropagation();
													handleEdit(job);
												}}
											>
												<FaEdit />
											</Button>
											<Button
												variant="outline-danger"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(job);
												}}
											>
												<FaTrashAlt />
											</Button>
										</div>

										<Row>
											<Col md={6}>
												<Badge
													bg={
														job.active
															? "success"
															: "secondary"
													}
													className="me-1"
												>
													{job.active
														? "Active"
														: "Inactive"}
												</Badge>
												{job.complete && (
													<Badge
														bg="info"
														className="me-1"
													>
														Complete
													</Badge>
												)}
												{job.prevWage && (
													<Badge
														bg="warning"
														className="me-1"
													>
														Prevailing Wage
													</Badge>
												)}
											</Col>
											<Col md={6} className="text-md-end">
												<small className="text-muted">
													Drive Time:{" "}
													{job.driveTime || "None"}
												</small>
											</Col>
										</Row>

										{job.siteAddress && (
											<div className="mt-2">
												<small className="text-muted">
													Site Address:
												</small>
												<br />
												{job.siteAddress}
											</div>
										)}

										<Row className="mt-3">
											<Col md={6}>
												<small className="text-muted">
													Customer:
												</small>
												<br />
												{job.customerName?.name ||
													"Not assigned"}
											</Col>
											<Col md={6}>
												<small className="text-muted">
													Project Manager:
												</small>
												<br />
												{job.projectManager
													? `${job.projectManager.firstName} ${job.projectManager.lastName}`
													: "Not assigned"}
											</Col>
										</Row>
									</Card.Body>
								)}
							</Card>
						))
					)}
				</Card.Body>
			</Card>

			<JobEditModal
				show={showCreateModal}
				onHide={() => setShowCreateModal(false)}
				onSuccess={fetchJobs}
				isEditMode={false}
			/>

			<JobEditModal
				show={showEditModal}
				onHide={() => setShowEditModal(false)}
				job={selectedJob}
				onSuccess={fetchJobs}
				isEditMode={true}
			/>

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
						Are you sure you want to delete the job{" "}
						<strong>{jobToDelete?.jobName}</strong>?
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
							"Delete Job"
						)}
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default JobManagement;
