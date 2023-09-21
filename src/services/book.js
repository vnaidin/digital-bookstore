import axios from 'axios';
import authHeader from './auth-header';

const deleteBook = (id) => axios.delete(`/api/book/${id}`, { headers: authHeader() });

const editBook = (id, formData) => axios.put(`/api/book/${id}`, formData, { headers: authHeader() });

const createBook = (formData) => axios.post('/api/book', formData, { headers: authHeader(), 'Content-Type': 'multipart/form-data' });

const BookService = {
  deleteBook,
  editBook,
  createBook,
};

export default BookService;
