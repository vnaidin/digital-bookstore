import axios from 'axios';
import authHeader from './auth-header';

const deleteNews = (id) => axios.delete(`/api/news/${id}`, { headers: authHeader() });

const editNews = (id, formData) => axios.put(`/api/news/${id}`, formData, { headers: authHeader() });

const createNews = (formData) => axios.post('/api/news', formData, { headers: authHeader(), 'Content-Type': 'multipart/form-data' });

const NewsService = {
  deleteNews,
  editNews,
  createNews,
};

export default NewsService;
