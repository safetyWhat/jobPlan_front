import axios from "axios";

export const scheduledJobService = {
	createScheduledJob: async (jobId, dates) => {
		const formattedDates = dates.map((date) => {
			// Convert single operator object to array
			let operatorArray = [];
			if (date.operator) {
				if (!Array.isArray(date.operator)) {
					// If it's a single operator object, convert to array
					operatorArray = [
						{
							type: date.operator.type || "NONE",
							count: date.operator.count || null,
						},
					];
				} else {
					// If it's already an array, format each entry
					operatorArray = date.operator.map((op) => ({
						type: op.type || "NONE",
						count: op.count || null,
					}));
				}
			}

			return {
				date: date.date,
				crewSize: date.crewSize || null,
				otherIdentifier: date.otherIdentifier || ["NONE"],
				operator: operatorArray,
			};
		});

		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs`,
			{
				jobId,
				dates: formattedDates,
			},
		);
		return response.data;
	},

	getScheduledJobs: async (jobId = null) => {
		const params = jobId ? { jobId } : {};
		const response = await axios.get(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs`,
			{
				params,
			},
		);
		return response.data;
	},

	updateScheduledJob: async (id, dates) => {
		const formattedDates = dates.map((date) => {
			// Convert single operator object to array
			let operatorArray = [];
			if (date.operator) {
				if (!Array.isArray(date.operator)) {
					// If it's a single operator object, convert to array
					operatorArray = [
						{
							type: date.operator.type || "NONE",
							count: date.operator.count || null,
						},
					];
				} else {
					// If it's already an array, format each entry
					operatorArray = date.operator.map((op) => ({
						type: op.type || "NONE",
						count: op.count || null,
					}));
				}
			}

			return {
				date: date.date,
				crewSize: date.crewSize || null,
				otherIdentifier: date.otherIdentifier || ["NONE"],
				operator: operatorArray,
			};
		});

		const response = await axios.put(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs/${id}`,
			{
				dates: formattedDates,
			},
		);
		return response.data;
	},

	deleteScheduledJob: async (id) => {
		const response = await axios.delete(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs/${id}`,
		);
		return response.data;
	},
};
