// schema for movies collection
const { Schema, model } = require("mongoose");

// setup the schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

// convert the schema to a model
const Product = model("Product", productSchema);

module.exports = Product; // equal to "export default Movie" in React
