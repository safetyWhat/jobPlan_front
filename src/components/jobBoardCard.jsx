import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { scheduledJobService } from "../services/scheduledJobService";
import ScheduleJobModal from "./ScheduleJobModal";

const JobBoard = () => {
	const [scheduledJobs, setScheduledJobs] = useState([]);
	const [dates, setDates] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchScheduledJobs = async () => {
			try {
				const response = await scheduledJobService.getScheduledJobs();
				setScheduledJobs(response.data);
			} catch (error) {
				console.error("Failed to fetch scheduled jobs:", error);
			}
		};

		setDates(generateDates());
		fetchScheduledJobs();
	}, []);

	// Generate array of 21 dates starting from today. Will need to change to display from selected date.
	const generateDates = () => {
		const dates = [];
		const today = new Date();
		for (let i = 0; i < 21; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const handleDeleteJob = async (id) => {
		try {
			await scheduledJobService.deleteScheduledJob(id);
			setScheduledJobs(scheduledJobs.filter((job) => job.id !== id));
		} catch (error) {
			console.error("Failed to delete job:", error);
		}
	};

	const isJobScheduledForDate = (job, date) => {
		return job.scheduledDates.some(
			(scheduledDate) =>
				new Date(scheduledDate.date).toDateString() ===
				date.toDateString(),
		);
	};

	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleJobScheduled = (newJob) => {
		setScheduledJobs([...scheduledJobs, newJob]);
		handleCloseModal();
	};

	return (
		<Container className="mt-4">
			<Row>
				<Col>
					<h2>Job Board</h2>
				</Col>
				<Col className="text-end">
					<Button variant="primary" onClick={handleShowModal}>
						<FaPlus /> Schedule Job
					</Button>
				</Col>
			</Row>
			<Card className="mt-3">
				<div style={{ display: "flex" }}>
					{/* Fixed Job Info Column */}
					<div
						style={{
							minWidth: "200px",
							borderRight: "1px solid #dee2e6",
							backgroundColor: "#fff",
							zIndex: 1,
						}}
					>
						<p className="m-3 fw-bold">Job Info</p>
						{scheduledJobs.map((job) => (
							<div
								key={job.id}
								className="m-3 d-flex justify-content-between align-items-center"
							>
								<span>{job.job.name}</span>
								<Button
									variant="danger"
									size="sm"
									onClick={() => handleDeleteJob(job.id)}
								>
									<FaTrash />
								</Button>
							</div>
						))}
					</div>

					{/* Scrollable Dates Section */}
					<div style={{ overflowX: "auto", flex: 1 }}>
						<div style={{ minWidth: "max-content" }}>
							{/* Dates header row */}
							<Row className="mt-3">
								{dates.map((date, index) => (
									<Col
										key={index}
										className="text-center border-start"
										style={{ minWidth: "100px" }}
									>
										<small>
											{date.toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</small>
									</Col>
								))}
							</Row>

							{/* Job rows */}
							{scheduledJobs.map((job) => (
								<Row key={job.id}>
									{dates.map((date, index) => (
										<Col
											key={index}
											className="text-center border-start border-top"
											style={{
												minWidth: "100px",
												height: "50px",
											}}
										>
											{isJobScheduledForDate(
												job,
												date,
											) && (
												<div
													className="bg-primary text-white m-1 p-1 rounded"
													style={{
														fontSize: "0.8rem",
													}}
												>
													Scheduled
												</div>
											)}
										</Col>
									))}
								</Row>
							))}
						</div>
					</div>
				</div>
			</Card>

			<ScheduleJobModal
				show={showModal}
				handleClose={handleCloseModal}
				onJobScheduled={handleJobScheduled}
			/>
		</Container>
	);
};

export default JobBoard;
