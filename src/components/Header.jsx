import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>SGNA - Sistema de Gestión Nuevo Amanecer</h1>
      <div className="buttons">
        <button className="login-button ali">Iniciar Sesión</button>
        <button className="register-button">Registrarse</button>
      </div>
    </header>
  );
};

export default Header;
