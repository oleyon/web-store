import React, { useEffect, useState } from "react";
import Orders from "../../components/Orders/Orders";
import OrdersService from "../../services/OrdersService";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";
import "./ProfilePage.less";

const ProfilePage = () => {
  const { dispatch } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(-1);
  const navigate = useNavigate();
  const statuses = ["Все", "В обработке", "Доставлен", "Завершен", "Отменен"];
  const statusStyles = [
    "all",
    "pending",
    "delivered",
    "completed",
    "cancelled",
  ];

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  const loadOrders = (status) => {
    OrdersService.getOrders(status).then((response) => {
      setOrders(response.data);
    });
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleLogOut = (event) => {
    AuthService.logout();
    dispatch({ type: "SET_USER", payload: null });
    navigate("/");
  };

  return (
    <>
      {" "}
      <button className="profile-page__logout" onClick={handleLogOut}>
        Выйти
      </button>
      <div className="profile-page">
        <h1>Заказы</h1>
        <div className="profile-page__status">
          <span>Категории:</span>
          {statuses.map((item, index) => (
            <button
              key={index}
              className={
                "profile-page__status-button" +
                ` profile-page__status--${statusStyles[index]}` +
                `${
                  statusFilter == index - 1
                    ? " profile-page__status--selected"
                    : ""
                }`
              }
              value={index - 1}
              onClick={handleStatusChange}
            >
              {item}
            </button>
          ))}
        </div>
        <Orders orders={orders} />
      </div>
    </>
  );
};

export default ProfilePage;
