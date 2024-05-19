import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.less";
import SearchBar from "../SearchBar/SearchBar";
import { useUserContext } from "../../contexts/UserContext";
import logo from "../../assets/logo.png";

const Header = () => {
  const { state } = useUserContext();
  let [links, setLinks] = useState(null);
  useEffect(() => {
    setLinks(
      state.user ? (
        state.user.role === "admin" ? (
          <>
            <li>
              <Link to="/product/add">Добавить товар</Link>
            </li>
            <li>
              <Link to="/categories">Категории</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/cart">Корзина</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
          </>
        )
      ) : (
        <>
          <li>
            <Link to="/login">Войти</Link>
          </li>
        </>
      )
    );
  }, [state.user]);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        <img src={logo} alt="Super shop" />
        Super Shop
      </Link>
      <SearchBar></SearchBar>
      <nav className="header__nav">
        <ul>{links}</ul>
      </nav>
    </header>
  );
};

export default Header;
