import http from "./HttpCommon";

class CategoriesService {
  getCategories() {
    return http.get("/categories", { withCredentials: true });
  }
  getCategory(id) {
    return http.get(`/categories/${id}`, { withCredentials: true });
  }
  postCategory(category) {
    return http.post("/categories", category, { withCredentials: true });
  }
}

export default new CategoriesService();
