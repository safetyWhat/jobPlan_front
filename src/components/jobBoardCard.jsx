import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

const JobBoard = () => {
	// Generate array of 21 dates starting from today
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

	return (
		<Container className="mt-4">
			<Row>
				<Col>
					<h2>Job Board</h2>
				</Col>
				<Col className="text-end">
					<Button
						variant="primary"
						onClick={() =>
							alert(
								"Schedule Job functionality not implemented yet",
							)
						}
					>
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
						<p className="m-3">Job Info</p>
					</div>

					{/* Scrollable Dates Section */}
					<div style={{ overflowX: "auto", flex: 1 }}>
						<Row
							className="mt-3"
							style={{ minWidth: "max-content" }}
						>
							{generateDates().map((date, index) => (
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
					</div>
				</div>
			</Card>
		</Container>
	);
};
export default JobBoard;
