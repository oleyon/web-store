import React, { useEffect, useState } from "react";
import Items from "../../components/Items/Items";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.less";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  function onShowItem(item) {
    navigate(`/products/${item.id}`);
  }

  function onAdd() {}

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");
    const categoryIds = queryParams.get("categoryIds");
    const page = queryParams.get("page");

    setSearchTerm(name || "");
    setSelectedCategories(
      categoryIds ? categoryIds.split(",").map(Number) : []
    );
    setCurrentPage(page ? parseInt(page) : 1);
  }, [location.search]);

  const updatePageInQuery = (page) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    navigate(`?${queryParams.toString()}`);
  };

  return (
    <main className="home">
      <h1 className="home__caption">Супер товары по супер ценам</h1>
      <Items
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        currentPage={currentPage}
        updatePageInQuery={updatePageInQuery}
        onShowItem={onShowItem}
        onAdd={onAdd}
      />
    </main>
  );
};

export default Home;
