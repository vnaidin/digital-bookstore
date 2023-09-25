import axios from 'axios';

const register = (registrationData) => axios.post('/api/auth/signup', registrationData);

const login = (loginData) => axios
  .post('/api/auth/signin', loginData)
  .then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });

const requestForgotPassword = ({ email }) => axios
  .post('/api/auth/requestResetPass', { email });

const resetPassword = ({ password, token, id }) => axios
  .post('/api/auth/resetPass', { password, token, id });

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  requestForgotPassword,
  resetPassword,
};

export default AuthService;
