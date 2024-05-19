import { useState, useEffect } from "react";
import ProductsService from "../../services/ProductsService";
import Item from "../Item/Item";
import "./Items.less";

function Items(props) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(props.currentPage) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 16;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ProductsService.getProducts({
          name: props.searchTerm,
          categoryIds: props.selectedCategories,
          page: currentPage,
          pageSize: pageSize,
        });
        setItems(response.data.items);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [props.searchTerm, props.selectedCategories, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        props.updatePageInQuery(nextPage);
        return nextPage;
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => {
        const prevPageNum = prevPage - 1;
        props.updatePageInQuery(prevPageNum);
        return prevPageNum;
      });
    }
  };

  return (
    <div>
      <div className="items">
        {items.map((el) => (
          <Item
            key={el.id}
            item={el}
            onShowItem={props.onShowItem}
            onAdd={props.onAdd}
          />
        ))}
      </div>
      <div className="items__pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Назад
        </button>
        <span>
          Страница {currentPage} из {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Вперед
        </button>
      </div>
    </div>
  );
}

export default Items;
