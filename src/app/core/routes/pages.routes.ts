export const PAGES_ROUTES = {
  AUTH: {
    DEFAULT: 'auth',
    LOGIN: 'login',
    SIGNUP: 'sign-up',
    FORGOTPASSWORD: 'forgot-password',
  },
  DASHBOARD: {
    DEFAULT: '',
    DASHBOARD: 'dashboard',
    USUARIOS: {
      DEFAULT: 'usuarios',
      LISTA: 'lista-usuarios',
      GRUPOS: 'grupos',
      PERMISOS: 'permisos',
    },
    CONFIGURACION: {
      DEFAULT: 'configuracion',
      GENERAL: 'configuracion',
      SEGURIDAD: 'seguridad',
    },
    TABLAS: {
      DEFAULT: 'tablas',
      BUSCAR_TABLA: 'buscar-tablas',
    },
    REGISTRADORES:{
      DEFAULT: 'registradores',
      PANEL: 'panel',
      TIPOS: 'tipos',
    }

  },
};
export default PAGES_ROUTES;
