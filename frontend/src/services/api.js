import axios from 'axios';

// Set VITE_API_URL in .env for production, defaults to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const analyzeData = async (imageFile, reportFile, reportText) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  if (reportFile) {
    formData.append('report_file', reportFile);
  } else if (reportText) {
    formData.append('report_text', reportText);
  }

  const response = await axios.post(`${API_URL}/analyze`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
