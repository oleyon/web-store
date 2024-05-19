import { Login, Register } from "../../components/AuthForm/AuthForm";
import { Link, useLocation } from "react-router-dom";
import "./LoginPage.less";

function LoginPage() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div>
      {isLogin ? <Login /> : <Register />}
      <p className="login-text">
        {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
        <Link
          className="login-text__link"
          to={isLogin ? "/register" : "/login"}
        >
          {isLogin ? "Регистрация" : "Вход"}
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
