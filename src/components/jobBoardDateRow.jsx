import React from "react";

const JobBoardDateRow = ({ dates }) => {
	const formatDate = (date) => {
		const options = { weekday: "short", month: "numeric", day: "numeric" };
		return date.toLocaleDateString(undefined, options);
	};

	const isWeekend = (date) => {
		const day = date.getDay();
		return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
	};

	const isToday = (date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	return (
		<div className="d-flex" style={{ borderBottom: "1px solid #dee2e6" }}>
			{dates.map((date, index) => (
				<div
					key={index}
					className={`p-2 text-center ${
						isWeekend(date) ? "bg-light" : ""
					} ${isToday(date) ? "border border-primary" : ""}`}
					style={{
						minWidth: "120px",
						borderRight: "1px solid #dee2e6",
					}}
				>
					{formatDate(date)}
				</div>
			))}
		</div>
	);
};

export default JobBoardDateRow;
