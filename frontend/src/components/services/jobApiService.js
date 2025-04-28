import axios from 'axios';

// Base API URL - use empty string for relative URLs
const API_BASE_URL = 'http://localhost:8080';

/**
 * Service for handling job posting API calls
 */
const jobApiService = {
    /**
     * Fetch jobs for a specific user
     * @param {string} userId - The user ID
     * @returns {Promise<Array>} - Array of job postings
     */
    getJobsForUser: async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/job-postings/user/${userId}`);
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    /**
     * Fetch a specific job by ID
     * @param {string} jobId - The job ID
     * @returns {Promise<Object>} - Job posting object
     */
    getJobById: async (jobId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/job-postings/${jobId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job details:', error);
            throw error;
        }
    },

    /**
     * Create a new job posting
     * @param {Object} jobData - Job data to be created
     * @returns {Promise<Object>} - Response with created job ID
     */
    createJob: async (jobData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/job-postings`, jobData);
            return response.data;
        } catch (error) {
            console.error('Error creating job:', error);
            throw error;
        }
    },

    /**
     * Update an existing job posting
     * @param {string} jobId - The job ID to update
     * @param {Object} jobData - Job data to update
     * @returns {Promise<Object>} - Response data
     */
    updateJob: async (jobId, jobData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/job-postings/${jobId}`, jobData);
            return response.data;
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    },

    /**
     * Delete a job posting
     * @param {string} jobId - The job ID to delete
     * @returns {Promise<Object>} - Response data
     */
    deleteJob: async (jobId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/job-postings/${jobId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting job:', error);
            throw error;
        }
    },

    /**
     * Get CV matches for a job
     * @param {string} jobId - The job ID
     * @returns {Promise<Array>} - Array of CV matches
     */
    getJobMatches: async (jobId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/job-postings/${jobId}/matches`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job matches:', error);
            throw error;
        }
    }
};

export default jobApiService;