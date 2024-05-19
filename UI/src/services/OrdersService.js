import http from "./HttpCommon";

class OrdersService {
  createOrders() {
    return http.post(
      `/orders/checkout/`,
      {},
      {
        withCredentials: true,
      }
    );
  }
  getOrders(status) {
    const params = status && status >= 0 ? { status } : {};
    return http.get(
      "/orders",
      { params },
      {
        withCredentials: true,
      }
    );
  }
  modifyOrderStatus(orderId, status) {
    return http.post("/orders/modifystatus", { id: orderId, status });
  }
}

export default new OrdersService();
