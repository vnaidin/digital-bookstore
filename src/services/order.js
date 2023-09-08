import axios from 'axios';
import authHeader from './auth-header';

const updateOrder = (id, formData) => axios.put(
  `/order/${id}`,
  formData,
  { headers: authHeader() },
);

const createOrder = (formData) => axios.post('/order', formData, { headers: authHeader() });

const OrderService = {
  updateOrder,
  createOrder,
};

export default OrderService;
