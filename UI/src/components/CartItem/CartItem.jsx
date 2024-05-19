import React from "react";
import defaultImage from "/img/empty-img.png";
import "./CartItem.less";
import deleteButton from "../../assets/delete.svg";

const CartItem = ({ item, onDelete, onQuantityChange }) => {
  const handleQuantityChange = (delta) => {
    const newQuantity = item.quantity + delta;
    onQuantityChange(item.productId, newQuantity);
  };
  const handleImageError = (event) => {
    event.preventDefault();
    event.target.src = defaultImage;
  };

  return (
    <div className="cart-item">
      <div className="cart-item__image">
        <img
          src={import.meta.env.VITE_API_BASE_URL + item.product.imageUrl}
          alt={item.product.name}
          onError={handleImageError}
        />
      </div>
      <div>
        <h2 className="cart-item__name">{item.product.name}</h2>
      </div>
      <div>
        <div className="cart-item__quantity">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        <div className="cart-item__price">
          {item.product.price * item.quantity}₽
        </div>

        <button
          className="cart-item__button"
          onClick={() => onDelete(item.productId)}
        >
          <img src={deleteButton} alt="delete" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
