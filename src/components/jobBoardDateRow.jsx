import React from "react";
import { Row, Col } from "react-bootstrap";

const JobBoardDateRow = ({ dates }) => {
	return (
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
	);
};

export default JobBoardDateRow;
