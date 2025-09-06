import apiClient from "../client/apiClient";
export const endpoints = {
  getData: async (payload?: any) => {
    try {
      const response = await apiClient.post("/default/getQuizes", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postData: async (payload: any) => {
    try {
      const response = await apiClient.post("/your-endpoint", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add other endpoint methods as needed
};