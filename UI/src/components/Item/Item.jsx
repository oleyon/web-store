import "./Item.less";
import defaultImage from "/img/empty-img.png";

function Item(props) {
  const handleImageError = (event) => {
    event.preventDefault();
    event.target.src = defaultImage;
  };
  return (
    <div className="item">
      <div className="item__image">
        <img
          src={import.meta.env.VITE_API_BASE_URL + props.item.imageUrl}
          onClick={() => props.onShowItem(props.item)}
          onError={handleImageError}
        />
      </div>

      <div className="item__price">{props.item.price}₽</div>
      <div className="item__name">{props.item.name}</div>
    </div>
  );
}

export default Item;
