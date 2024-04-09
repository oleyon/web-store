import React from 'react';
import Items from '../../components/Items/Items';

const Home = () => {
  function onShowItem() {

  }
  function onAdd() {

  }

  return (
    <main>
      <h1>Супер товары по супер ценам</h1>
      <Items onShowItem={onShowItem} onAdd={onAdd}></Items>
    </main>
  );
};

export default Home;