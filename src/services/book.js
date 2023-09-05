import axios from 'axios';
import authHeader from './auth-header';
// TODO: rm axios, use fetch instead
const API_URL = 'api';

const deleteBook = (id) => axios.delete(`${API_URL}/book/${id}`, { headers: authHeader() });

const editBook = (id, formData) => axios.put(`${API_URL}/book/${id}`, formData, { headers: authHeader() });

const createBook = (formData) => axios.post(`${API_URL}/book`, formData, { headers: authHeader(), 'Content-Type': 'multipart/form-data' });

const BookService = {
  deleteBook,
  editBook,
  createBook,
};

export default BookService;
