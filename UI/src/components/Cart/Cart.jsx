import React from "react";
import CartItem from "../CartItem/CartItem";

const Cart = ({ cartItems, onDelete, onQuantityChange }) => {
  return (
    <div className="cart">
      {cartItems.map((item) => (
        <CartItem
          key={`${item.cartId},${item.productId}`}
          item={item}
          onDelete={onDelete}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
};

export default Cart;
