import axios from 'axios';
import authHeader from './auth-header';

const updateOrder = (id, formData) => axios.put(
  `/api/order/${id}`,
  formData,
  { headers: authHeader() },
);

const createOrder = (formData) => axios.post('/api/order', formData, { headers: authHeader() });

const OrderService = {
  updateOrder,
  createOrder,
};

export default OrderService;
