import React from 'react';
import './SearchBar.less'; // Подключаем файл стилей

const SearchBar = ({ placeholder, handleChange }) => {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <button className="search-button" type="submit">
        Найти
      </button>
    </div>
  );
};

export default SearchBar;