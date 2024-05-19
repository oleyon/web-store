import React from "react";
import OrderItem from "../OrderItem/OrderItem";

const Orders = ({ orders }) => {
  return (
    <div className="orders">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};

export default Orders;
