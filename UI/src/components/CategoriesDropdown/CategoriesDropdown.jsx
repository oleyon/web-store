import React, { useEffect, useState } from "react";
import CategoriesService from "../../services/CategoriesService";
import "./CategoriesDropdown.less";
import menuIcon from "../../assets/menuIcon.svg";

const CategoriesDropdown = ({ selectedCategories, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoriesService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="categories-dropdown">
      <img src={menuIcon} alt="menu" className="categories-dropdown__icon" />
      <ul className="categories-dropdown__list">
        {categories.map((category) => (
          <li key={category.id}>
            <input
              className="categories-dropdown__list__checkbox"
              type="checkbox"
              id={category.id}
              checked={selectedCategories.includes(category.id)}
              onChange={() => onCategoryChange(category.id)}
            />
            <label htmlFor={category.id}>{category.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesDropdown;
