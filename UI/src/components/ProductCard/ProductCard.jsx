import React, { useState, useEffect } from "react";
import ProductService from "../../services/ProductsService";
import "./ProductCard.less";
import defaultImage from "/img/empty-img.png";
import CartsService from "../../services/CartsService";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import shoppingCart from "../../assets/shoppingCart.svg";
import itemModify from "../../assets/itemModify.svg";

const ProductCard = ({ productId }) => {
  let navigate = useNavigate();
  const { state } = useUserContext();
  let [product, setProduct] = useState(null);
  const handleImageError = (event) => {
    event.preventDefault();
    event.target.src = defaultImage;
  };
  const handleAddClick = (event) => {
    CartsService.addToCart(product.id);
  };
  const handleModifyClick = (event) => {
    navigate(`/product/modify/${product.id}`);
  };
  useEffect(() => {
    ProductService.getProduct(productId)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [productId]);

  return (
    <div className="product-card">
      {product ? (
        <div>
          <div className="block">
            <div className="product-card__image">
              <img
                src={import.meta.env.VITE_API_BASE_URL + product.imageUrl}
                alt={product.name}
                onError={handleImageError}
              />
            </div>
            <h1 className="product-card__name">{product.name}</h1>
          </div>

          <div>
            <div className="product-card__description block">
              <h2>Описание товара</h2>
              <p>{product.description}</p>
            </div>
            <div>
              <div className="block">
                <div className="product-card__price">{product.price}₽</div>
                <div className="product-card__left">
                  Осталось {product.quantity} шт.
                </div>
              </div>
              {state.user?.role !== "admin" ? (
                <img
                  src={shoppingCart}
                  alt="Добавить в корзину"
                  className="product-card__button"
                  onClick={handleAddClick}
                />
              ) : (
                <img
                  src={itemModify}
                  className="product-card__button product-card__button--modify"
                  onClick={handleModifyClick}
                  Modify
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
};

export default ProductCard;
