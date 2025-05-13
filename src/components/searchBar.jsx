import React, { useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";

const SearchBar = ({ onSearchResults }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const location = useLocation();
	let page = "";

	const getSearchEndpoint = () => {
		const path = location.pathname;
		if (path.includes("jobs")) {
			page = "jobs";
			return "jobs";
		}
		if (path.includes("employees")) {
			page = "employees";
			return "employees";
		}
		if (path.includes("customers")) {
			page = "customers";
			return "customers";
		}
		return null;
	};

	const handleSearch = async (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		const endpoint = getSearchEndpoint();
		if (!endpoint || value.trim().length < 2) {
			onSearchResults(null);
			return;
		}

		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/${endpoint}/search?query=${value}`,
			);
			console.log("Search results:", response.data.data);
			onSearchResults(response.data.data);
		} catch (error) {
			console.error("Search error:", error);
			onSearchResults(null);
		}
	};

	return getSearchEndpoint() ? (
		<input
			type="search"
			placeholder={"Search " + page + "..."}
			value={searchTerm}
			onChange={handleSearch}
			className="form-control"
			style={{ width: "300px" }}
		/>
	) : null;
};

export default SearchBar;
