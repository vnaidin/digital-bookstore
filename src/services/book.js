import axios from 'axios';
import authHeader from './auth-header';

const deleteBook = (id) => axios.delete(`/book/${id}`, { headers: authHeader() });

const editBook = (id, formData) => axios.put(`/book/${id}`, formData, { headers: authHeader() });

const createBook = (formData) => axios.post('/book', formData, { headers: authHeader(), 'Content-Type': 'multipart/form-data' });

const BookService = {
  deleteBook,
  editBook,
  createBook,
};

export default BookService;
