import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { scheduledJobService } from "../services/scheduledJobService";

const ScheduleJobModal = ({ show, handleClose, onJobScheduled }) => {
	const [jobId, setJobId] = useState("");
	const [selectedDates, setSelectedDates] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await scheduledJobService.createScheduledJob(
				parseInt(jobId),
				selectedDates,
			);
			onJobScheduled(response.data);
			handleClose();
		} catch (error) {
			console.error("Failed to schedule job:", error);
		}
	};

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Schedule New Job</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Job ID</Form.Label>
						<Form.Control
							type="number"
							value={jobId}
							onChange={(e) => setJobId(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Select Dates</Form.Label>
						<Form.Control
							type="date"
							multiple
							onChange={(e) => {
								const dates = Array.from(
									e.target.selectedOptions,
								).map((option) => option.value);
								setSelectedDates(dates);
							}}
						/>
					</Form.Group>
					<Button variant="primary" type="submit">
						Schedule Job
					</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ScheduleJobModal;
