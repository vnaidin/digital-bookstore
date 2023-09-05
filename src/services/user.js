import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'api';

const deleteUser = (id) => axios.delete(`${API_URL}/user/${id}`, { headers: authHeader() });

const editUser = (id, formData) => axios.put(`${API_URL}/user/${id}`, formData, { headers: authHeader() });

const UserService = {
  deleteUser,
  editUser,
};

export default UserService;
