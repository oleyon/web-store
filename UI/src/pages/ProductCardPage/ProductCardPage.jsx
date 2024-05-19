import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductCardPage.less";

function ProductCardPage() {
  const { productId } = useParams();

  return (
    <div className="product-card-page">
      <h1>Информация о товаре</h1>
      <ProductCard productId={productId} />
    </div>
  );
}

export default ProductCardPage;
