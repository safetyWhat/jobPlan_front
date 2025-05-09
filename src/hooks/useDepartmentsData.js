import React, { useEffect, useState } from "react";
import axios from "axios";

const useDepartmentsData = () => {
	const [departments, setDepartments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchDepartments = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/departments`,
			);
			setDepartments(response.data.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching departments:", err);
			setError("Failed to load departments. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDepartments();
	}, []);

	return { departments, loading, error, fetchDepartments };
};

export default useDepartmentsData;
