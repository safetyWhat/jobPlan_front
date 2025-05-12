import React, { useState, useEffect } from "react";
import JobManagement from "../components/jobCard";
import JobFilters from "../components/jobFilters";
import axios from "axios";
import { useOutletContext } from "react-router";

function Jobs() {
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

	// Add default value for context
	const context = useOutletContext();
	const searchResults = context?.searchResults;

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
		} else {
			fetchAllJobs();
		}
	}, [searchResults]);

	return (
		<div className="container">
			<JobFilters
				onFilterChange={handleFilterChange}
				onClearFilters={fetchAllJobs}
			/>
			<JobManagement
				jobs={filteredJobs}
				isLoading={isFiltering}
				onJobChange={() => handleFilterChange(currentFilters)}
			/>
		</div>
	);
}

export default Jobs;
