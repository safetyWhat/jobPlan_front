import React from "react";
import { Row, Col } from "react-bootstrap";

const JobBoardJobRow = ({
	job,
	dates,
	isJobScheduledForDate,
	getScheduledDateDetails,
	getJobColor,
	formatOperatorType,
}) => {
	// Helper function to convert identifiers to abbreviations
	const getIdentifierAbbreviation = (identifier) => {
		const abbreviations = {
			TIME_AND_MATERIALS: "TM",
			TEN_DAY: "10D",
			GRINDING: "G",
		};

		return abbreviations[identifier] || identifier.replace("_", " ");
	};

	return (
		<div className="d-flex">
			{dates.map((date, index) => (
				<div
					key={index}
					className="text-center border-start border-top"
					style={{
						minWidth: "100px",
						width: "100px", // Added fixed width for consistency
						height: "50px",
						borderRight: "1px solid #dee2e6",
					}}
				>
					{isJobScheduledForDate(job, date) && (
						<div
							className={`m-1 p-1 rounded ${getJobColor(
								getScheduledDateDetails(job, date),
							)}`}
							style={{
								fontSize: "0.8rem",
							}}
						>
							<div>
								{getScheduledDateDetails(job, date)
									?.crewSize && (
									<div>
										Crew:{" "}
										{
											getScheduledDateDetails(job, date)
												.crewSize
										}
									</div>
								)}
								{getScheduledDateDetails(job, date)?.operator
									?.count > 0 && (
									<div>
										{formatOperatorType(
											getScheduledDateDetails(job, date)
												.operator.type,
										)}
										:{" "}
										{
											getScheduledDateDetails(job, date)
												.operator.count
										}
									</div>
								)}
								{getScheduledDateDetails(
									job,
									date,
								)?.otherIdentifier?.map(
									(identifier, idx) =>
										identifier !== "NONE" && (
											<div
												key={idx}
												className="text-info"
											>
												{getIdentifierAbbreviation(
													identifier,
												)}
											</div>
										),
								)}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default JobBoardJobRow;
