import { useEffect, useState } from "react";
import ProductModifyForm from "../../components/ProductModifyForm/ProductModifyForm";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function ProductModifyPage() {
  const { productId } = useParams();
  return (
    <>
      <h1>Изменить товар</h1>
      <ProductModifyForm productId={productId} />
    </>
  );
}
