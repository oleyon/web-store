import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import LoginPage from "./pages/LoginPage/LoginPage";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import ProductAddPage from "./pages/ProductAddPage/ProductAddPage";
import { ResponseInterceptor } from "./services/ResponseInterceptors";
import ProductCardPage from "./pages/ProductCardPage/ProductCardPage";
import CartPage from "./pages/CartPage/CartPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProductModifyPage from "./pages/ProductModifyPage/ProductModifyPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <ResponseInterceptor />
        <Header />
        <div className="main-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/add" element={<ProductAddPage />} />
            <Route path="/products/:productId" element={<ProductCardPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/product/modify/:productId"
              element={<ProductModifyPage />}
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
