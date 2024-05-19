import React, { useEffect, useState } from "react";
import Cart from "../../components/Cart/Cart";
import CartsService from "../../services/CartsService";
import OrdersService from "../../services/OrdersService";
import "./CartPage.less";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    CartsService.getCart().then((response) => {
      setCartItems(response.data);
    });
  }, [trigger]);

  const handleDelete = async (productId) => {
    await CartsService.removeFromCart(productId);
    setTrigger(!trigger);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    await CartsService.setCartItem(productId, newQuantity);
    setTrigger(!trigger);
  };

  const handleBuy = async () => {
    await OrdersService.createOrders();
    setTrigger(!trigger);
  };

  return (
    <>
      <h1>Корзина</h1>
      <div className="cart-page">
        <Cart
          cartItems={cartItems}
          onDelete={handleDelete}
          onQuantityChange={handleQuantityChange}
        />
        <div className="cart-page__summary">
          <div>
            Общее количество:{" "}
            <p>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</p>
            &nbsp;шт.
          </div>
          <div>
            Общая стоимость:{" "}
            <p>
              {cartItems.reduce(
                (acc, item) => acc + item.product.price * item.quantity,
                0
              )}
              ₽
            </p>
          </div>
          <button onClick={handleBuy}>Оформить заказ</button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
