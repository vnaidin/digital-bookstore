import axios from 'axios';
import authHeader from './auth-header';

const deleteUser = (id) => axios.delete(`/user/${id}`, { headers: authHeader() });

const editUser = (id, formData) => axios.put(`/user/${id}`, formData, { headers: authHeader() });

const UserService = {
  deleteUser,
  editUser,
};

export default UserService;
