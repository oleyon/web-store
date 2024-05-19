import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import http from "./HttpCommon";
import AuthService from "./AuthService";

export const ResponseInterceptor = () => {
  const navigate = useNavigate();
  const interceptorId = useRef(null);
  const isRefreshing = useRef(false);

  useEffect(() => {
    interceptorId.current = http.interceptors.response.use(
      undefined,
      async (error) => {
        if (error.response.status === 401) {
          if (!isRefreshing.current) {
            isRefreshing.current = true;
            try {
              await AuthService.refreshToken();
              return http.request(error.config);
            } catch {
              if (!shouldExcludeRequest(error.config)) {
                navigate("/login");
              }
            } finally {
              isRefreshing.current = false;
            }
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      http.interceptors.response.eject(interceptorId.current);
    };
  }, [navigate]);

  return null;
};

const shouldExcludeRequest = (config) => {
  if (config.url.includes("/getuser")) {
    return true;
  }
  return false;
};
