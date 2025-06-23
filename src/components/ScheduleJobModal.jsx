import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { scheduledJobService } from "../services/scheduledJobService";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleJobModal = ({ show, handleClose, onJobScheduled }) => {
	const [jobs, setJobs] = useState([]);
	const [isDateRange, setIsDateRange] = useState(false);
	const [dateRange, setDateRange] = useState({
		startDate: null,
		endDate: null,
	});
	const [includeSaturday, setIncludeSaturday] = useState(false);
	const [includeSunday, setIncludeSunday] = useState(false);
	const [formData, setFormData] = useState({
		jobId: "",
		dates: [
			{
				date: "",
				crewSize: "",
				otherIdentifier: ["NONE"],
				operator: [
					{
						type: "NONE",
						count: "",
					},
				],
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
					operator: [
						{
							type: "NONE",
							count: "",
						},
					],
				},
			],
		});
		setIsDateRange(false);
		setDateRange({
			startDate: null,
			endDate: null,
		});
		setIncludeSaturday(false);
		setIncludeSunday(false);
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

	// Generate array of dates between startDate and endDate, excluding weekends as configured
	const generateDatesBetween = (start, end) => {
		const dates = [];
		const currentDate = new Date(start);
		const endDate = new Date(end);

		while (currentDate <= endDate) {
			const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday

			// Check if we should include this day
			if (
				(dayOfWeek !== 0 && dayOfWeek !== 6) || // Weekdays
				(dayOfWeek === 6 && includeSaturday) || // Saturday if included
				(dayOfWeek === 0 && includeSunday) // Sunday if included
			) {
				dates.push(new Date(currentDate));
			}
			currentDate.setDate(currentDate.getDate() + 1);
		}
		return dates;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let datesForSubmission = [...formData.dates];

			// If using date range, replace the dates array with generated dates
			if (isDateRange && dateRange.startDate && dateRange.endDate) {
				const dateTemplate = formData.dates[0];
				const datesBetween = generateDatesBetween(
					dateRange.startDate,
					dateRange.endDate,
				);

				datesForSubmission = datesBetween.map((date) => ({
					...dateTemplate,
					date: date,
				}));
			}

			// Convert Date objects to ISO string format before submitting
			const formattedData = {
				...formData,
				dates: datesForSubmission.map((date) => ({
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

	const handleOperatorChange = (dateIndex, operatorIndex, field, value) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.map((date, i) => {
				if (i === dateIndex) {
					const updatedOperators = [...date.operator];

					if (field === "count") {
						value = parseInt(value) || "";
					}

					updatedOperators[operatorIndex] = {
						...updatedOperators[operatorIndex],
						[field]: value,
					};

					return {
						...date,
						operator: updatedOperators,
					};
				}
				return date;
			}),
		}));
	};

	const addOperator = (dateIndex) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.map((date, i) => {
				if (i === dateIndex) {
					return {
						...date,
						operator: [
							...date.operator,
							{
								type: "NONE",
								count: "",
							},
						],
					};
				}
				return date;
			}),
		}));
	};

	const removeOperator = (dateIndex, operatorIndex) => {
		setFormData((prev) => ({
			...prev,
			dates: prev.dates.map((date, i) => {
				if (i === dateIndex && date.operator.length > 1) {
					return {
						...date,
						operator: date.operator.filter(
							(_, j) => j !== operatorIndex,
						),
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
					operator: [
						{
							type: "NONE",
							count: "",
						},
					],
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

	const getSelectedDate = (dateValue) => {
		if (dateValue) {
			return new Date(dateValue);
		}
		return null;
	};

	// Update the render part for operators in the date range section
	const renderOperatorsSection = (dateIndex) => {
		return (
			<>
				{formData.dates[dateIndex].operator.map((op, opIndex) => (
					<Row key={opIndex} className="mb-2">
						<Col md={5}>
							<Form.Group className="mb-2">
								<Form.Label>
									{opIndex === 0 ? "Operator Type" : ""}
								</Form.Label>
								<Form.Select
									value={op.type}
									onChange={(e) =>
										handleOperatorChange(
											dateIndex,
											opIndex,
											"type",
											e.target.value,
										)
									}
								>
									<option value="NONE">None</option>
									<option value="FULL">Full</option>
									<option value="BOBCAT">Bobcat</option>
									<option value="DOZER">Dozer</option>
								</Form.Select>
							</Form.Group>
						</Col>
						<Col md={5}>
							<Form.Group className="mb-2">
								<Form.Label>
									{opIndex === 0 ? "Operator Count" : ""}
								</Form.Label>
								<Form.Control
									type="number"
									value={op.count}
									onChange={(e) =>
										handleOperatorChange(
											dateIndex,
											opIndex,
											"count",
											e.target.value,
										)
									}
									disabled={op.type === "NONE"}
								/>
							</Form.Group>
						</Col>
						<Col
							md={2}
							className={`${opIndex === 0 ? "d-flex align-items-end" : ""} mb-2`}
						>
							{formData.dates[dateIndex].operator.length > 1 && (
								<Button
									variant="danger"
									size="sm"
									onClick={() =>
										removeOperator(dateIndex, opIndex)
									}
								>
									Remove
								</Button>
							)}
						</Col>
					</Row>
				))}
				<Button
					variant="secondary"
					size="sm"
					onClick={() => addOperator(dateIndex)}
					className="mb-3"
				>
					Add Operator
				</Button>
			</>
		);
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

					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							id="date-range-toggle"
							label="Schedule multiple days using date range"
							checked={isDateRange}
							onChange={() => setIsDateRange(!isDateRange)}
						/>
					</Form.Group>

					{isDateRange ? (
						<>
							<Row className="mb-3">
								<Col md={6}>
									<Form.Group>
										<Form.Label>Start Date</Form.Label>
										<DatePicker
											selected={dateRange.startDate}
											onChange={(date) =>
												setDateRange((prev) => ({
													...prev,
													startDate: date,
												}))
											}
											className="form-control"
											dateFormat="yyyy-MM-dd"
											placeholderText="Select start date"
											required
										/>
									</Form.Group>
								</Col>
								<Col md={6}>
									<Form.Group>
										<Form.Label>End Date</Form.Label>
										<DatePicker
											selected={dateRange.endDate}
											onChange={(date) =>
												setDateRange((prev) => ({
													...prev,
													endDate: date,
												}))
											}
											className="form-control"
											dateFormat="yyyy-MM-dd"
											placeholderText="Select end date"
											minDate={dateRange.startDate}
											required
										/>
									</Form.Group>
								</Col>
							</Row>
							<Row className="mb-3">
								<Col>
									<Form.Check
										type="checkbox"
										id="include-saturday"
										label="Include Saturdays"
										checked={includeSaturday}
										onChange={() =>
											setIncludeSaturday(!includeSaturday)
										}
									/>
									<Form.Check
										type="checkbox"
										id="include-sunday"
										label="Include Sundays"
										checked={includeSunday}
										onChange={() =>
											setIncludeSunday(!includeSunday)
										}
									/>
								</Col>
							</Row>
							<div className="border rounded p-3 mb-3">
								<h5 className="mb-3">
									Date Information (applies to all selected
									dates)
								</h5>
								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>Crew Size</Form.Label>
											<Form.Control
												type="number"
												value={
													formData.dates[0].crewSize
												}
												onChange={(e) =>
													handleDateChange(
														0,
														"crewSize",
														parseInt(
															e.target.value,
														) || "",
													)
												}
											/>
										</Form.Group>
									</Col>
								</Row>

								{renderOperatorsSection(0)}

								<Row>
									<Col md={6}>
										<Form.Group className="mb-3">
											<Form.Label>
												Other Identifiers
											</Form.Label>
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
														checked={formData.dates[0].otherIdentifier.includes(
															identifier,
														)}
														onChange={(e) => {
															let newIdentifiers;

															if (
																e.target.checked
															) {
																// When checkbox is checked, add the identifier and remove NONE
																newIdentifiers =
																	[
																		...formData.dates[0].otherIdentifier.filter(
																			(
																				i,
																			) =>
																				i !==
																				"NONE",
																		),
																		identifier,
																	];
															} else {
																// When checkbox is unchecked, just remove this identifier
																newIdentifiers =
																	formData.dates[0].otherIdentifier.filter(
																		(i) =>
																			i !==
																			identifier,
																	);
															}

															handleDateChange(
																0,
																"otherIdentifier",
																newIdentifiers,
															);
														}}
													/>
												))}
											</div>
										</Form.Group>
									</Col>
								</Row>
							</div>
							{dateRange.startDate && dateRange.endDate && (
								<div className="alert alert-info">
									This will schedule the job for{" "}
									{
										generateDatesBetween(
											dateRange.startDate,
											dateRange.endDate,
										).length
									}{" "}
									days between{" "}
									{dateRange.startDate.toLocaleDateString()}{" "}
									and {dateRange.endDate.toLocaleDateString()}
									.
								</div>
							)}
						</>
					) : (
						<>
							{formData.dates.map((date, index) => (
								<div
									key={index}
									className="border rounded p-3 mb-3"
								>
									<div className="d-flex justify-content-end mb-2">
										{index > 0 && (
											<Button
												variant="danger"
												size="sm"
												onClick={() =>
													removeDate(index)
												}
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
													selected={getSelectedDate(
														date.date,
													)}
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
												<Form.Label>
													Crew Size
												</Form.Label>
												<Form.Control
													type="number"
													value={date.crewSize}
													onChange={(e) =>
														handleDateChange(
															index,
															"crewSize",
															parseInt(
																e.target.value,
															) || "",
														)
													}
												/>
											</Form.Group>
										</Col>
									</Row>

									{renderOperatorsSection(index)}

									<Form.Group className="mb-3">
										<Form.Label>
											Other Identifiers
										</Form.Label>
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
																	(i) =>
																		i !==
																		"NONE",
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
						</>
					)}

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
