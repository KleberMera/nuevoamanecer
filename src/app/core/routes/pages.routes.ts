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
    GESTIOM: 'gestion-usuarios',
    //GRUPOS: 'grupos',
    //  PERMISOS: 'permisos',
  },
  ACCION: {
    DEFAULT: 'acciones',
    //REGISTRO: 'registro',
    HISTORIAL: 'historial',
    HISTORIAL_USUARIO: 'usuario',
  },
  PRESTAMO: {
    DEFAULT: 'prestamos',
    GESTIOM: 'registro',
    CONTROL: 'control',
    USUARIO: 'usuario',
    SIMULADOR: 'simulador',
  }
};
export default PAGES_ROUTES;
