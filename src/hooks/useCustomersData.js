import { useState, useEffect } from "react";
import axios from "axios";

const useCustomersData = () => {
	const [customers, setCustomers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/customers`,
				);
				setCustomers(response.data.data || []);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCustomers();
	}, []);

	return { customers, isLoading, error };
};

export default useCustomersData;
