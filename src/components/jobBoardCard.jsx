import React, { useState, useEffect } from "react";
import {
	Card,
	Button,
	Row,
	Col,
	Container,
	Overlay,
	Popover,
} from "react-bootstrap";
import { FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { scheduledJobService } from "../services/scheduledJobService";
import ScheduleJobModal from "./ScheduleJobModal";
import JobBoardDateRow from "./jobBoardDateRow";
import JobBoardJobRow from "./jobBoardJobRow";
import "../styles/calendar.css";

const JobBoard = () => {
	const [scheduledJobs, setScheduledJobs] = useState([]);
	const [dates, setDates] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [showCalendar, setShowCalendar] = useState(false);
	const [calendarTarget, setCalendarTarget] = useState(null);

	useEffect(() => {
		const fetchScheduledJobs = async () => {
			try {
				const response = await scheduledJobService.getScheduledJobs();
				setScheduledJobs(response.data);
			} catch (error) {
				console.error("Failed to fetch scheduled jobs:", error);
			}
		};

		setDates(generateDates(startDate));
		fetchScheduledJobs();
	}, [startDate]);

	// Generate array of 21 dates starting from selected start date
	const generateDates = (start) => {
		const dates = [];
		for (let i = 0; i < 21; i++) {
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const handleDateChange = (date) => {
		setStartDate(date);
	};

	const handleCalendarToggle = (event) => {
		setCalendarTarget(event.target);
		setShowCalendar(!showCalendar);
	};

	const formatDateRange = () => {
		const endDate = new Date(startDate);
		endDate.setDate(startDate.getDate() + 20);

		const formatOptions = { month: "short", day: "numeric" };
		const startStr = startDate.toLocaleDateString(undefined, formatOptions);
		const endStr = endDate.toLocaleDateString(undefined, formatOptions);

		return `${startStr} - ${endStr}`;
	};

	const highlightWithRanges = () => {
		const dateRange = [];
		for (let i = 0; i < 21; i++) {
			const day = new Date(startDate);
			day.setDate(startDate.getDate() + i);
			dateRange.push(new Date(day));
		}

		return [
			{
				"react-datepicker__day--highlighted-custom-range": dateRange,
			},
		];
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
		console.log("Scheduled operator:", scheduledDate.operator);
		if (!scheduledDate) return "bg-primary";
		if (scheduledDate.otherIdentifier.includes("TIME_AND_MATERIALS"))
			return "bg-warning";
		if (scheduledDate.otherIdentifier.includes("TEN_DAY"))
			return "bg-danger";
		if (scheduledDate.operator[0].type !== "NONE") {
			return "bg-success";
		}
		return "bg-primary";
	};

	return (
		<Container className="mt-4">
			<Row>
				<Col>
					<h2>Job Board</h2>
				</Col>
				<Col className="d-flex align-items-center justify-content-center">
					<Button
						variant="outline-secondary"
						onClick={handleCalendarToggle}
						className="d-flex align-items-center"
					>
						<FaCalendarAlt className="me-2" />
						<span>{formatDateRange()}</span>
					</Button>

					<Overlay
						show={showCalendar}
						target={calendarTarget}
						placement="bottom"
						container={document.body}
						rootClose
						onHide={() => setShowCalendar(false)}
					>
						<Popover
							id="calendar-popover"
							style={{ minWidth: "300px" }}
						>
							<Popover.Header as="h3">
								Select Start Date
							</Popover.Header>
							<Popover.Body>
								<div className="custom-calendar-container">
									<DatePicker
										selected={startDate}
										onChange={handleDateChange}
										inline
										highlightDates={highlightWithRanges()}
										dayClassName={(date) => {
											// Get date without time
											const currentDate = new Date(
												date.setHours(0, 0, 0, 0),
											);
											const selectedStartDate = new Date(
												startDate.setHours(0, 0, 0, 0),
											);

											// Check if date is within the 21-day range
											const endDate = new Date(
												selectedStartDate,
											);
											endDate.setDate(
												selectedStartDate.getDate() +
													20,
											);

											if (
												currentDate >=
													selectedStartDate &&
												currentDate <= endDate
											) {
												return "highlighted-date-range";
											}
											return null;
										}}
									/>
									<div className="text-muted small mb-2 mt-2">
										Showing 21 days starting from selected
										date
									</div>
									<div className="d-flex justify-content-end mt-3">
										<Button
											variant="primary"
											size="sm"
											onClick={() =>
												setShowCalendar(false)
											}
										>
											Apply
										</Button>
									</div>
								</div>
							</Popover.Body>
						</Popover>
					</Overlay>
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
