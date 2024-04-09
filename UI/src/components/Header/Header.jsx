import React from 'react';
import { Link } from 'react-router-dom';
import './Header.less';
import SearchBar from '../SearchBar/SearchBar';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header__logo">Super shop</Link>
      <SearchBar></SearchBar>
      <nav className="header__nav">
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/login">Кабинет</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;