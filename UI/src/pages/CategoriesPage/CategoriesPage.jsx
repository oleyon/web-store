import React, { useState } from "react";
import CategoriesList from "../../components/CategoriesList/CategoriesList";
import AddCategoryForm from "../../components/AddCategoryForm/AddCategoryForm";

function Categories() {
  const [categoriesUpdated, setCategoriesUpdated] = useState(false);

  const handleCategoryAdded = () => {
    setCategoriesUpdated(!categoriesUpdated);
  };

  return (
    <div>
      <h1>Список категорий</h1>
      <CategoriesList categoriesUpdated={categoriesUpdated} />
      <h1>Добавить новую категорию</h1>
      <AddCategoryForm onCategoryAdded={handleCategoryAdded} />
    </div>
  );
}

export default Categories;
