import { useState, useEffect } from "react";
import ProductsService from "../../services/ProductsService";
import Item from "../Item/Item";
import './Items.less'

function Items(props) {
  let [items, setItems] = useState([])
  
  useEffect(() => {
    ProductsService.fetchProducts()
    .then(((data) => {
      setItems(data)
    }))
  },[])

  return (
    <div className="items">
      {items.map(el => (
        <Item key={el.id} item={el} onShowItem={props.onShowItem} onAdd={props.onAdd} />
      ))}
    </div>
  )
}

export default Items;