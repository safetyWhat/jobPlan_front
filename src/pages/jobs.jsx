import React, { useState, useEffect } from "react";
import JobManagement from "../components/jobCard";
import JobFilters from "../components/jobFilters";
import axios from "axios";
//import { useOutletContext } from "react-router";

function Jobs({ searchResults }) {
	const [filteredJobs, setFilteredJobs] = useState([]);
	const [isFiltering, setIsFiltering] = useState(false);
	const [currentFilters, setCurrentFilters] = useState({
		jobNum: "",
		projectManagerId: "",
		customerId: "",
		active: "",
		driveTime: "",
		prevWage: "",
	});
	const [isFiltersVisible, setIsFiltersVisible] = useState(false);

	const fetchAllJobs = async () => {
		try {
			setIsFiltering(true);
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/jobs`,
			);
			setFilteredJobs(response.data.data || []);
		} catch (error) {
			console.error("Error fetching all jobs:", error);
		} finally {
			setIsFiltering(false);
		}
	};

	const handleFilterChange = async (filters) => {
		try {
			setIsFiltering(true);
			setCurrentFilters(filters);

			// Build query string based on active filters
			const queryParams = Object.entries(filters)
				.filter(([, value]) => value !== "")
				.map(([key, value]) => `${key}=${value}`)
				.join("&");

			const url = queryParams
				? `${import.meta.env.VITE_API_URL}/jobs/filter?${queryParams}`
				: `${import.meta.env.VITE_API_URL}/jobs`;

			const response = await axios.get(url);
			setFilteredJobs(response.data.data || []);
		} catch (error) {
			console.error("Error filtering jobs:", error);
		} finally {
			setIsFiltering(false);
		}
	};

	// Fetch jobs on component mount or when searchResults change
	useEffect(() => {
		if (searchResults?.length > 0) {
			setFilteredJobs(searchResults);
			console.log("New filtered jobs:", searchResults);
		} else {
			fetchAllJobs();
		}
	}, [searchResults]);

	return (
		<div className="container">
			<div
				className="filters-header"
				onClick={() => setIsFiltersVisible(!isFiltersVisible)}
				style={{
					padding: ".25rem",
					backgroundColor: "#f5f5f5",
					borderRadius: "4px",
					cursor: "pointer",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "1rem",
				}}
			>
				<span>Filters {isFiltersVisible ? "▼" : "▶"}</span>
			</div>

			{isFiltersVisible && (
				<JobFilters
					onFilterChange={handleFilterChange}
					onClearFilters={fetchAllJobs}
				/>
			)}

			<JobManagement
				jobs={filteredJobs}
				isLoading={isFiltering}
				onJobChange={() => handleFilterChange(currentFilters)}
			/>
		</div>
	);
}

export default Jobs;
