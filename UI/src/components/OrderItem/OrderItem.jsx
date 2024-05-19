import React, { useState } from "react";
import defaultImage from "/img/empty-img.png";
import { useUserContext } from "../../contexts/UserContext";
import OrdersService from "../../services/OrdersService";
import "./OrderItem.less";

const OrderItem = ({ order }) => {
  const { state } = useUserContext();
  const statuses = ["В обработке", "Доставлен", "Завершен", "Отменен"];
  const statusStyles = ["pending", "delivered", "completed", "cancelled"];
  const [status, setStatus] = useState(order.status);
  const handleImageError = (event) => {
    event.preventDefault();
    event.target.src = defaultImage;
  };
  const handleChangeStatus = (event) => {
    const newStatus = Number(event.target.value);
    OrdersService.modifyOrderStatus(order.id, newStatus).then((response) => {
      setStatus(newStatus);
    });
  };
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="order-item">
      <div className="order-item__image">
        <img
          src={import.meta.env.VITE_API_BASE_URL + order.product.imageUrl}
          alt={order.product.name}
          onError={handleImageError}
        />
      </div>
      <div>
        <h2 className="order-item__name">{order.product.name}</h2>
      </div>
      {state.user?.role === "admin" && (
        <div className="order-item__username">{order.user.userName}</div>
      )}
      <div className="order-item__date">{formatDate(order.date)}</div>
      <div className="order-item__quantity">
        <b>{order.quantity}</b> шт.
      </div>
      <div className="order-item__price">{order.price}₽</div>
      {state.user?.role === "admin" ? (
        <div className="order-item__status">
          <select
            value={status}
            onChange={handleChangeStatus}
            className={`order-item__status--${statusStyles[status]}`}
          >
            {statuses.map((item, index) => (
              <option
                className={`order-item__status--${statusStyles[index]}`}
                key={index}
                value={index}
              >
                {item}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div
          className={
            "order-item__status" +
            ` order-item__status--${statusStyles[order.status]}`
          }
        >
          {statuses[order.status]}
        </div>
      )}
    </div>
  );
};

export default OrderItem;
