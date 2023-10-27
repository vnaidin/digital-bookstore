import axios from 'axios';
import authHeader from './auth-header';

const deletePromo = (name) => axios.delete(`/api/promo/${name}`, { headers: authHeader() });

const PromoCodeService = {
  deletePromo,
};

export default PromoCodeService;
