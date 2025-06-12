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
	return (
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
												className="text-warning"
											>
												{identifier.replace("_", " ")}
											</div>
										),
								)}
							</div>
						</div>
					)}
				</Col>
			))}
		</Row>
	);
};

export default JobBoardJobRow;
