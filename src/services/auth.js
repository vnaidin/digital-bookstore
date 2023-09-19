import axios from 'axios';

const register = (registrationData) => axios.post('/auth/signup', registrationData);

const login = (loginData) => axios
  .post('/auth/signin', loginData)
  .then((response) => {
    if (response.data.accessToken) {
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  });

const requestForgotPassword = ({ email }) => axios
  .post('/auth/requestResetPass', { email });

const resetPassword = ({ password, token, id }) => axios
  .post('/auth/resetPass', { password, token, id });

const logout = () => {
  sessionStorage.removeItem('user');
};

const getCurrentUser = () => JSON.parse(sessionStorage.getItem('user'));

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  requestForgotPassword,
  resetPassword,
};

export default AuthService;
