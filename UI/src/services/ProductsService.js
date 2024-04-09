const products = [
  {
    id: 1,
    title: "Холодильник",
    img: "fridge.jpg",
    desc: "Этот уникальный холодильник сочетает в себе стильный дизайн",
    category: "appliances",
    price: "50000",
  },
  {
    id: 2,
    title: "Iphone 14 pro max",
    img: "iphone.jpg",
    desc: "Впечатляет своим качественным и изящным дизайном",
    category: "phones",
    price: "99000",
  },
  {
    id: 3,
    title: "Стиральная машина",
    img: "washingmachine.jpg",
    desc: "Это инновационное устройство",
    category: "appliances",
    price: "30000",
  },
  {
    id: 4,
    title: "Фен",
    img: "dyson.jpg",
    desc: "Идеальный инструмент для создания причесок",
    category: "beauty",
    price: "40000",
  },
  {
    id: 5,
    title: "Робот-пылесос",
    img: "vacuumcleaner.jpg",
    desc: "Инновационное решение для автоматической уборки",
    category: "appliances",
    price: "25000",
  },
  {
    id: 7,
    title: "Samsung Galaxy Z",
    img: "galaxy.jpg",
    desc: "Это смартфон с гибким экраном",
    category: "phones",
    price: "70000",
  },
  {
    id: 8,
    title: "Телевизор",
    img: "tv.jpg",
    desc: "Телевизор оборудован высокоразрешенным дисплеем",
    category: "tv",
    price: "20000",
  },
];

class ProductsService {
  async fetchProducts() {
    return products;
    // try {
    //   const response = await fetch("your-backend-url/products");
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch products");
    //   }
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error("Error fetching products:", error);
    //   throw error;
    // }
  }
}

export default new ProductsService();
