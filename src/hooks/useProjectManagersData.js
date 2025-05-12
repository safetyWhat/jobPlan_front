import { useState, useEffect } from "react";
import axios from "axios";

const useProjectManagersData = () => {
	const [projectManagers, setProjectManagers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProjectManagers = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/employees`,
				);
				const pmList = response.data.data.filter(
					(emp) =>
						emp &&
						emp.position &&
						emp.position.name === "Project Manager",
				);
				setProjectManagers(pmList);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProjectManagers();
	}, []);

	return { projectManagers, isLoading, error };
};

export default useProjectManagersData;
