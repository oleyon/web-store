import http from "./HttpCommon";

class CartsService {
  getCart() {
    return http.get("/carts", { withCredentials: true });
  }
  addToCart(productId, quantity = 1) {
    return http.post(`/carts/add/${productId}/${quantity}`, {
      withCredentials: true,
    });
  }
  setCartItem(productId, quantity) {
    return http.post(`/carts/set/${productId}/${quantity}`, {
      withCredentials: true,
    });
  }
  removeFromCart(productId) {
    return http.delete(`/carts/remove/${productId}`, {
      withCredentials: true,
    });
  }
}

export default new CartsService();
