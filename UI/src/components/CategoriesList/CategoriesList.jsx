import React, { useEffect, useState } from "react";
import CategoriesService from "../../services/CategoriesService";
import "./CategoriesList.less";

function CategoriesList({ categoriesUpdated }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoriesService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, [categoriesUpdated]);

  return (
    <div className="categories-list">
      <ul>
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesList;
