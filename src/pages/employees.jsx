import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeManagement from "../components/employeeCard";
import EmployeeFilters from "../components/employeeFilters";

function Employees({ searchResults }) {
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [isFiltering, setIsFiltering] = useState(false);
	const [currentFilters, setCurrentFilters] = useState({
		departmentId: "",
		positionId: "",
	});
	const [isFiltersVisible, setIsFiltersVisible] = useState(false);

	const fetchAllEmployees = async () => {
		try {
			setIsFiltering(true);
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/employees`,
			);
			setFilteredEmployees(response.data.data || []);
		} catch (error) {
			console.error("Error fetching all employees:", error);
		} finally {
			setIsFiltering(false);
		}
	};

	// Load all employees when component mounts
	useEffect(() => {
		if (searchResults?.length > 0) {
			setFilteredEmployees(searchResults);
		} else {
			fetchAllEmployees();
		}
	}, [searchResults]);

	const handleFilterChange = async (filters) => {
		try {
			setIsFiltering(true);
			setCurrentFilters(filters);

			// Build query string based on active filters
			const queryParams = [];
			if (filters.departmentId)
				queryParams.push(`departmentId=${filters.departmentId}`);
			if (filters.positionId)
				queryParams.push(`positionId=${filters.positionId}`);

			const queryString =
				queryParams.length > 0
					? `/filter?${queryParams.join("&")}`
					: "";
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/employees${queryString}`,
			);

			setFilteredEmployees(response.data.data || []);
		} catch (error) {
			console.error("Error filtering employees:", error);
		} finally {
			setIsFiltering(false);
		}
	};

	const handleEmployeeChange = () => {
		// Refresh while maintaining current filters
		handleFilterChange(currentFilters);
	};

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
				<EmployeeFilters
					onFilterChange={handleFilterChange}
					onClearFilters={fetchAllEmployees}
				/>
			)}

			{/* Employee Management Component */}
			<EmployeeManagement
				employees={filteredEmployees}
				isFiltering={isFiltering}
				onEmployeeChange={handleEmployeeChange}
			/>
		</div>
	);
}

export default Employees;
