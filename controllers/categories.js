const Product = require("../models/product");

const getCategories = async () => {
  const products = await Product.find();
  let categories = [];

  products.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });


  return categories;
};

module.exports = {
  getCategories,
};
