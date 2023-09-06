import axios from 'axios';
import authHeader from './auth-header';
// TODO: rm axios, use fetch instead
const API_URL = 'api';

const updateOrder = (id, formData) => axios.put(
  `${API_URL}/order/${id}`,
  formData,
  { headers: authHeader() },
);

const createOrder = (formData) => axios.post(`${API_URL}/order`, formData, { headers: authHeader() });

const OrderService = {
  updateOrder,
  createOrder,
};

export default OrderService;
