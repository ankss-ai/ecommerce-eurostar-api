// In-memory product catalog seeded with 3 products.
const products = [
  { id: 1, name: 'Wireless Mouse', price: 25.0 },
  { id: 2, name: 'Mechanical Keyboard', price: 80.0 },
  { id: 3, name: 'USB-C Hub', price: 45.0 },
];

function findById(id) {
  return products.find((product) => product.id === Number(id));
}

module.exports = { products, findById };
