import React, { useState, useEffect } from "react";
import CategoriesService from "../../services/CategoriesService";
import ProductsService from "../../services/ProductsService";
import "./ProductAddForm.less";

function ProductAddForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    CategoriesService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("image", image);

    selectedCategories.forEach((category) => {
      formData.append("categoryIds", category.id);
    });

    try {
      const response = await ProductsService.postProduct(formData);
      setName("");
      setDescription("");
      setQuantity("");
      setPrice("");
      setImage(null);
      setSelectedCategories([]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Название"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Описание"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex">
          <input
            type="number"
            placeholder="Количество"
            value={quantity}
            required
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Цена"
            value={price}
            required
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <input type="file" onChange={handleImageChange} />
        <h3>Выберите категории:</h3>
        {categories.map((category) => (
          <label className="product-form__categories" key={category.id}>
            <input
              className="product-form__checkbox"
              type="checkbox"
              value={category.id}
              checked={selectedCategories.some(
                (selected) => selected.id === category.id
              )}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCategories([...selectedCategories, category]);
                } else {
                  setSelectedCategories(
                    selectedCategories.filter(
                      (selected) => selected.id !== category.id
                    )
                  );
                }
              }}
            />
            {category.name}
          </label>
        ))}

        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

export default ProductAddForm;
