import React, { useState, useEffect } from "react";
import CategoriesService from "../../services/CategoriesService";
import ProductsService from "../../services/ProductsService";
import { useNavigate } from "react-router-dom";

function ProductModifyForm({ productId }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
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
    ProductsService.getProduct(productId).then((response) => {
      const product = response.data;
      setName(product.name);
      setDescription(product.description);
      setQuantity(product.quantity);
      setPrice(product.price);
      console.log(product);
      setSelectedCategories(product.categories);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("price", price);

    selectedCategories.forEach((category) => {
      formData.append("categoryIds", category.id);
    });

    try {
      const response = await ProductsService.modifyProduct(productId, formData);
      navigate(`/products/${productId}`);
    } catch (error) {
      console.error("Error modifying product:", error);
    }
  };

  return (
    <div>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex">
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
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
        <button type="submit">Изменить</button>
      </form>
    </div>
  );
}

export default ProductModifyForm;
