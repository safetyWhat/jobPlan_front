import axios from "axios";

export const scheduledJobService = {
	createScheduledJob: async (jobId, dates) => {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs`,
			{
				jobId,
				dates,
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
		const response = await axios.put(
			`${import.meta.env.VITE_API_URL}/scheduled-jobs/${id}`,
			{
				dates,
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
