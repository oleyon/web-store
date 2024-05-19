import http from "./HttpCommon";

class UserDataService {
  register(data) {
    return http.post("/auth/register", data, { withCredentials: true });
  }
  login(data) {
    return http.post("/auth/login", data, { withCredentials: true });
  }
  test() {
    http.get("/sec", { withCredentials: true });
  }
  logout() {
    return http.post("/auth/logout", {}, { withCredentials: true });
  }
  refreshToken() {
    return http.post("/auth/refresh", {}, { withCredentials: true });
  }
  getUser() {
    return http.get("/auth/getuser", { withCredentials: true });
  }
}

export default new UserDataService();
