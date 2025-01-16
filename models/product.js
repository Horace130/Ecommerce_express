// schema for movies collection
const { Schema, model } = require("mongoose");

// setup the schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  // linkage between the products and categories (Similar to SQL foreign key)
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  image: String,
});

// convert the schema to a model
const Product = model("Product", productSchema);

module.exports = Product;
