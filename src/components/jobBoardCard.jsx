import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { scheduledJobService } from "../services/scheduledJobService";
import ScheduleJobModal from "./ScheduleJobModal";
import JobBoardDateRow from "./jobBoardDateRow";
import JobBoardJobRow from "./jobBoardJobRow";

const JobBoard = () => {
	const [scheduledJobs, setScheduledJobs] = useState([]);
	const [dates, setDates] = useState([]);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchScheduledJobs = async () => {
			try {
				const response = await scheduledJobService.getScheduledJobs();
				setScheduledJobs(response.data);
				console.log("Scheduled Jobs:", response.data);
				console.log("job", response.data[0]?.job.jobName);
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
		// Show confirmation dialog before proceeding with deletion
		const confirmDelete = window.confirm(
			"Are you sure you want to delete ALL scheduled days for this job?",
		);

		if (confirmDelete) {
			try {
				await scheduledJobService.deleteScheduledJob(id);
				setScheduledJobs(scheduledJobs.filter((job) => job.id !== id));
			} catch (error) {
				console.error("Failed to delete job:", error);
			}
		}
	};

	const isJobScheduledForDate = (job, date) => {
		const targetDate = new Date(date).toISOString().split("T")[0];
		const matches = job.scheduledDates.some((scheduledDate) => {
			const schedDate = new Date(scheduledDate.date)
				.toISOString()
				.split("T")[0];
			return schedDate === targetDate;
		});

		return matches;
	};

	const handleShowModal = () => setShowModal(true);
	const handleCloseModal = () => setShowModal(false);

	const handleJobScheduled = (newJob) => {
		// Check if job already exists in the array
		const existingJobIndex = scheduledJobs.findIndex(
			(job) => job.id === newJob.id,
		);

		if (existingJobIndex !== -1) {
			// If job exists, create a new array with the updated job
			const updatedJobs = [...scheduledJobs];
			updatedJobs[existingJobIndex] = newJob;
			setScheduledJobs(updatedJobs);
		} else {
			// If job doesn't exist, add it to the array
			setScheduledJobs([...scheduledJobs, newJob]);
		}

		handleCloseModal();
	};

	const getScheduledDateDetails = (job, date) => {
		// Format both dates to YYYY-MM-DD for consistent comparison
		const targetDate = new Date(date).toISOString().split("T")[0];

		return job.scheduledDates.find((sd) => {
			const scheduledDate = new Date(sd.date).toISOString().split("T")[0];
			const matches = scheduledDate === targetDate;

			return matches;
		});
	};

	const formatOperatorType = (type) => {
		return type
			.split("_")
			.map((word) => word.charAt(0) + word.slice(1).toLowerCase())
			.join(" ");
	};

	const getJobColor = (scheduledDate) => {
		if (!scheduledDate) return "bg-primary";
		if (scheduledDate.otherIdentifier.includes("TIME_AND_MATERIALS"))
			return "bg-warning";
		if (scheduledDate.otherIdentifier.includes("TEN_DAY"))
			return "bg-danger";
		if (scheduledDate.operator?.type !== "NONE") return "bg-success";
		return "bg-primary";
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
								<span>{job.job.jobName}</span>
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
							{/* Dates header row - Now using component */}
							<JobBoardDateRow dates={dates} />

							{/* Job rows - Now using component */}
							{scheduledJobs.map((job) => (
								<JobBoardJobRow
									key={job.id}
									job={job}
									dates={dates}
									isJobScheduledForDate={
										isJobScheduledForDate
									}
									getScheduledDateDetails={
										getScheduledDateDetails
									}
									getJobColor={getJobColor}
									formatOperatorType={formatOperatorType}
								/>
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
