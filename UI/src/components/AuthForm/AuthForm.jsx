import React, { useState } from "react";
import "./AuthForm.less";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useUserContext();
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    AuthService.login({
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: "SET_USER", payload: response.data });
          navigate("/");
        } else {
          setPasswordError(error.status);
        }
      })
      .catch((error) => {
        setPasswordError("Неправильный логин или пароль");
      });
  };

  return (
    <div className="auth-form">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && (
          <p className="auth-form__error-message">{passwordError}</p>
        )}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

function Register(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Пароль должен содержать как минимум одну заглавную букву, одну цифру, один неалфавитно-цифровой символ и быть длиной не менее 6 символов."
      );
      return;
    }
    AuthService.register({
      username: username,
      email: email,
      password: password,
    }).then((response) => {
      if (response.status === 200) {
        navigate("/");
      }
    });
  };

  return (
    <div className="auth-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && (
          <p className="auth-form__error-message">{passwordError}</p>
        )}
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export { Login, Register };
