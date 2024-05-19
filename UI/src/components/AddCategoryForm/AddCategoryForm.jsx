import React, { useState } from "react";
import CategoriesService from "../../services/CategoriesService";
import "./AddCategoryForm.less";

function AddCategoryForm({ onCategoryAdded }) {
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    CategoriesService.postCategory({ Name: name })
      .then((response) => {
        console.log("Category added successfully:", response.data);
        setName("");
        if (onCategoryAdded) {
          onCategoryAdded();
        }
      })
      .catch((error) => {
        console.error("Error adding category:", error);
      });
  };

  return (
    <div className="category-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название категории"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

export default AddCategoryForm;
