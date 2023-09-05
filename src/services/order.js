import axios from 'axios';
import authHeader from './auth-header';
// TODO: rm axios, use fetch instead
const API_URL = 'api';

/* const deleteBook = (id) => axios.delete(`${API_URL}/book/${id}`, { headers: authHeader() });

const editBook = (id, formData) => axios.put(`${API_URL}/book/${id}`,
 formData, { headers: authHeader() }); */

const createOrder = (formData) => axios.post(`${API_URL}/order`, formData, { headers: authHeader() });

const OrderService = {
  /*  deleteBook,
  editBook, */
  createOrder,
};

export default OrderService;
