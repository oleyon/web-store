import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CategoriesDropdown from "../CategoriesDropdown/CategoriesDropdown";
import "./SearchBar.less";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");
    const categoryIds = queryParams.get("categoryIds");
    setSearchInput(name || "");
    setSelectedCategories(
      categoryIds ? categoryIds.split(",").map(Number) : []
    );
  }, [location.search]);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    const index = selectedCategories.indexOf(categoryId);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      const updatedCategories = selectedCategories.filter(
        (id) => id !== categoryId
      );
      setSelectedCategories(updatedCategories);
    }
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (searchInput.trim() !== "") {
      query.append("name", searchInput.trim());
    }
    if (selectedCategories.length > 0) {
      query.append("categoryIds", selectedCategories.join(","));
    }
    navigate(`/search?${query.toString()}`);
  };

  return (
    <div className="search-bar">
      <CategoriesDropdown
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
      />
      <input
        className="search-bar__input"
        type="search"
        placeholder="Введите запрос..."
        value={searchInput}
        onChange={handleInputChange}
      />
      <button className="search-bar__button" onClick={handleSearch}>
        Найти
      </button>
    </div>
  );
};

export default SearchBar;
