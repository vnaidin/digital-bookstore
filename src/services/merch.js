import axios from 'axios';
import authHeader from './auth-header';

const deleteMerch = (id) => axios.delete(`/api/merch/${id}`, { headers: authHeader() });

const editMerch = (id, formData) => axios.put(`/api/merch/${id}`, formData, { headers: authHeader() });

const createMerch = (formData) => axios.post('/api/merch', formData, { headers: authHeader(), 'Content-Type': 'multipart/form-data' });

const MerchService = {
  deleteMerch,
  editMerch,
  createMerch,
};

export default MerchService;
