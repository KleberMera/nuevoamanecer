import { environment } from '../../../environments/environment.development';

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${environment.apiUrl}/autenticacion/login`,
    REGISTER: `${environment.apiUrl}/autenticacion/register`,
  },
};
export default API_ROUTES;
