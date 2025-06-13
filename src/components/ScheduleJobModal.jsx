import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { scheduledJobService } from "../services/scheduledJobService";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleJobModal = ({ show, handleClose, onJobScheduled }) => {
	const [jobs, setJobs] = useState([]);
	const [formData, setFormData] = useState({
		jobId: "",
		dates: [
			{
				date: "",
				crewSize: "",
				otherIdentifier: ["NONE"],
				operator: {
					type: "NONE",
					count: "",
				},
			},
		],
	});

	// Reset form data when modal is closed or opened
	useEffect(() => {
		if (show) {
			fetchJobs();
		} else {
			resetFormData();
		}
	}, [show]);

	const resetFormData = () => {
		setFormData({
			jobId: "",
			dates: [
				{
					date: "",
					crewSize: "",
					otherIdentifier: ["NONE"],
					operator: {
						type: "NONE",
						count: "",
					},
				},
			],
		});
	};

	const fetchJobs = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/jobs`,
			);
			setJobs(response.data.data.filter((job) => job.active));
		} catch (error) {
			console.error("Failed to fetch jobs:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Convert Date objects to ISO string format before submitting
			const formattedData = {
				...formData,
				dates: formData.dates.map((date) => ({
					...date,
					date:
						date.date instanceof Date
							? date.date.toISOString().split("T")[0]
							: date.date,
				})),
			};

			const response = await scheduledJobService.createScheduledJob(
				parseInt(formData.jobId),
				formattedData.dates,
			);
			onJobScheduled(response.data);
			resetFormData(); // Reset form data after successful submission
			handleClose();
		} catch (error) {
			console.error("Failed to schedule job:", error);
		}
	};

	const handleDateChange = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.map((date, i) =>
				i === index ? { ...date, [field]: value } : date,
			),
		}));
	};

	const handleOperatorChange = (index, field, value) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.map((date, i) => {
				if (i === index) {
					let fieldValue = value;
					if (field === "count") {
						fieldValue = parseInt(value) || "";
					}

					return {
						...date,
						operator: {
							...date.operator,
							[field]: fieldValue,
						},
					};
				}
				return date;
			}),
		}));
	};

	const addDate = () => {
		setFormData((prev) => ({
			...prev,
			dates: [
				...prev.dates,
				{
					date: "",
					crewSize: "",
					otherIdentifier: ["NONE"],
					operator: {
						type: "NONE",
						count: "",
					},
				},
			],
		}));
	};

	const removeDate = (index) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.filter((_, i) => i !== index),
		}));
	};

	return (
		<Modal show={show} onHide={handleClose} size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Schedule New Job</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Select Job</Form.Label>
						<Form.Select
							value={formData.jobId}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									jobId: e.target.value,
								}))
							}
							required
						>
							<option value="">Select a job...</option>
							{jobs.map((job) => (
								<option key={job.id} value={job.id}>
									{job.jobName}{" "}
									{job.jobNum ? `(${job.jobNum})` : ""}
								</option>
							))}
						</Form.Select>
					</Form.Group>

					{formData.dates.map((date, index) => (
						<div key={index} className="border rounded p-3 mb-3">
							<div className="d-flex justify-content-end mb-2">
								{index > 0 && (
									<Button
										variant="danger"
										size="sm"
										onClick={() => removeDate(index)}
									>
										Remove Date
									</Button>
								)}
							</div>
							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Date</Form.Label>
										<DatePicker
											selected={
												date.date
													? new Date(date.date)
													: null
											}
											onChange={(selectedDate) =>
												handleDateChange(
													index,
													"date",
													selectedDate,
												)
											}
											className="form-control"
											dateFormat="yyyy-MM-dd"
											placeholderText="Select a date"
											required
										/>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Crew Size</Form.Label>
										<Form.Control
											type="number"
											value={date.crewSize}
											onChange={(e) =>
												handleDateChange(
													index,
													"crewSize",
													parseInt(e.target.value) ||
														"",
												)
											}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Row>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Operator Type</Form.Label>
										<Form.Select
											value={date.operator.type}
											onChange={(e) =>
												handleOperatorChange(
													index,
													"type",
													e.target.value,
												)
											}
										>
											<option value="NONE">None</option>
											<option value="FULL">Full</option>
											<option value="BOBCAT">
												Bobcat
											</option>
											<option value="DOZER">Dozer</option>
										</Form.Select>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group className="mb-3">
										<Form.Label>Operator Count</Form.Label>
										<Form.Control
											type="number"
											value={date.operator.count}
											onChange={(e) =>
												handleOperatorChange(
													index,
													"count",
													e.target.value,
												)
											}
											disabled={
												date.operator.type === "NONE"
											}
										/>
									</Form.Group>
								</Col>
							</Row>

							<Form.Group className="mb-3">
								<Form.Label>Other Identifiers</Form.Label>
								<div>
									{[
										"NONE",
										"TIME_AND_MATERIALS",
										"TEN_DAY",
										"GRINDING",
									].map((identifier) => (
										<Form.Check
											key={identifier}
											inline
											type="checkbox"
											label={identifier.replace(
												/_/g,
												" ",
											)}
											checked={date.otherIdentifier.includes(
												identifier,
											)}
											onChange={(e) => {
												let newIdentifiers;

												if (e.target.checked) {
													// When checkbox is checked, add the identifier and remove NONE
													newIdentifiers = [
														...date.otherIdentifier.filter(
															(i) => i !== "NONE",
														),
														identifier,
													];
												} else {
													// When checkbox is unchecked, just remove this identifier
													newIdentifiers =
														date.otherIdentifier.filter(
															(i) =>
																i !==
																identifier,
														);
												}

												handleDateChange(
													index,
													"otherIdentifier",
													newIdentifiers,
												);
											}}
										/>
									))}
								</div>
							</Form.Group>
						</div>
					))}

					<Button
						variant="secondary"
						onClick={addDate}
						className="mb-3"
					>
						Add Another Date
					</Button>

					<div className="d-flex justify-content-end">
						<Button variant="primary" type="submit">
							Schedule Job
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default ScheduleJobModal;
