import axios from 'axios';
import authHeader from './auth-header';

const register = (registrationData) => axios.post('/api/auth/signup', registrationData);

const login = (loginData) => axios
  .post('/api/auth/signin', loginData)
  .then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
      const wishList = response.data.wishlist;
      if (wishList) {
        Promise.all(wishList.length > 1 ? wishList?.split(',').map(
          (id) => fetch(`${process.env.REACT_APP_BE_URL}/api/item/${id}`).then(
            (item) => item.json(),
          ),
        ) : [fetch(`${process.env.REACT_APP_BE_URL}/api/item/${wishList}`).then(
          (item) => item.json(),
        )]).then((result) => {
          localStorage.setItem('wishList', JSON.stringify(result.map(({
            id, price, title, image, reducedPrice, isReducedNow,
          }) => ({
            id, price, title, image, reducedPrice, isReducedNow,
          }))));
        });
      } else {
        localStorage.setItem('wishList', '');
      }
    }
    return response.data;
  });

const requestForgotPassword = ({ email }) => axios
  .post('/api/auth/requestResetPass', { email });

const resetPassword = ({ password, token, id }) => axios
  .post('/api/auth/resetPass', { password, token, id });

const logout = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(typeof localStorage.getItem('wishList'));
  const wishList = localStorage.getItem('wishList').length > 0 ? JSON.parse(localStorage.getItem('wishList')) : undefined;
  // update users wishlist on logOut
  axios.put(`/api/user/${user.id}`, { wishList: wishList ? wishList.map((item) => item.id).join(',') : '' }, { headers: authHeader() });
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
