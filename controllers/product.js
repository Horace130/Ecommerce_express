// load the models
const Product = require("../models/product");

// CRUD functions
// get all movies
const getProducts = async (name, price,description,category) => {
  // create a container for filter
  let filter = {};
  // if name exists, pass it to the filter container
 
  if (category) {
    filter.category = category;
  }

  // apply filter in .find()
  const products = await Product.find(filter);
  return products;
};


// get one movie
const getProduct = async (id) => {
  const product = await Product.findById(id);
  return product;
};

// add new movie
const addNewProduct = async (name, description, price, category) => {
  // create new movie
  const newProduct = new Product({
    name,
    description,
    price,
    category,
  });
  // save the new movie into mongodb
  await newProduct.save();
  return newProduct;
};

// update movie
const updateProduct= async (id, name, description, price, category) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name,
      description,
      price,
      category,
    },
    {
      new: true, // return back the updated data
    }
  );
  return updatedProduct;
};

// delete movie
const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// export all the functions
module.exports = {
  getProducts,
  getProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
