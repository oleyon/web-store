import http from "./HttpCommon";

class ProductsService {
  getProducts({ name = "", categoryIds = [], page = 1, pageSize = 10 }) {
    const categoryIdsString = categoryIds.join(",");
    return http.get("/products", {
      params: { name, categoryIds: categoryIdsString, page, pageSize },
    });
  }
  getProduct(id) {
    return http.get(`/products/${id}`, { withCredentials: true });
  }
  postProduct(productForm) {
    return http.post("/products", productForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }
  modifyProduct(productId, productForm) {
    return http.post(`/products/modify/${productId}`, productForm, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
  }
}

export default new ProductsService();
