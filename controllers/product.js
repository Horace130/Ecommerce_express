const Product = require("../models/product");

/*
CRUD:
 1. Add a new product: `POST /products`
 2. List all products: `GET /products`
 3. Get specific product details by its ID: `GET /products/:id`
 4. Update a product by its ID: `PUT /products/:id`
 5. Delete a product by its ID: `DELETE /products/:id`
*/

const getProducts = async (category, page = 1, per_page = 6) => {
  // create a container for filter
  let filter = {};
  // if name exists, pass it to the filter container
  if (category && category !== "all") {
    filter.category = category;
  }

  // apply filter in .find()
  const products = await Product.find(filter)
    .populate("category")
    .limit(per_page)
    .skip((page - 1) * per_page)
    .sort({ _id: -1 });
  return products;
};

// get one product
const getProduct = async (id) => {
  const product = await Product.findById(id);
  return product;
};

// add new product
const addNewProduct = async (name, description, price, category, image) => {
  // create new product
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    image,
  });
  // save the new product into mongodb
  await newProduct.save();
  return newProduct;
};

// update product
const updateProduct = async (id, name, description, price, category) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { name, description, price, category },
    // return back the new data
    { new: true }
  );
  return updatedProduct;
};

// delete product
const deleteProduct = async (id) => {
  // find by id to retrieve the image path
  // fs.unlink(path)
  // delete the product
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  getProducts,
  getProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
};
