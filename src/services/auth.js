import axios from 'axios';
// TODO: rm axios, use fetch instead
const API_URL = 'api';

const register = (registrationData) => axios.post(`${API_URL}/auth/signup`, registrationData);

const login = (loginData) => axios
  .post(`${API_URL}/auth/signin`, loginData)
  .then((response) => {
    if (response.data.accessToken) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });

const logout = () => {
  sessionStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(sessionStorage.getItem('user'));

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
