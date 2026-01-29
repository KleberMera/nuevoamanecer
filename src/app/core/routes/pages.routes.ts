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

    // CONFIGURACION: {
    //   DEFAULT: 'configuracion',
    //   GENERAL: 'configuracion',
    //   SEGURIDAD: 'seguridad',
    // },
    // TABLAS: {
    //   DEFAULT: 'tablas',
    //   BUSCAR_TABLA: 'buscar-tablas',
    // },
    // REGISTRADORES:{
    //   DEFAULT: 'registradores',
    //   PANEL: 'panel',
    //   TIPOS: 'tipos',
    // }
  },
  USUARIOS: {
    DEFAULT: 'usuarios',
    LISTA: 'lista-usuarios',
    //GRUPOS: 'grupos',
    //  PERMISOS: 'permisos',
  },
  ACCION: {
    DEFAULT: 'acciones',
    REGISTRO: 'registro',
    HISTORIAL: 'historial',
    HISTORIAL_USUARIO: 'usuario',
  },
  PRESTAMO: {
    DEFAULT: 'prestamos',
    LISTA: 'lista-prestamos',
    SIMULADOR: 'simulador',
  }
};
export default PAGES_ROUTES;
