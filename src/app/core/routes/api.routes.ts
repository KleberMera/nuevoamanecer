import { environment } from '../../../environments/environment.development';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
  },
};
export default API_ROUTES;
