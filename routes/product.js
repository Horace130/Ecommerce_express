const express = require("express");
const mongoose = require("mongoose");
//create a router for products
const router = express.Router();

const {
  getProducts,
  getProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { isValidUser, isAdmin } = require("../middleware/auth");

// get all the products. Pointing to /products
router.get("/", async (req, res) => {
  try {
    const category = req.query.category;
    const page = req.query.page;
    const per_page = req.query.per_page;
    const products = await getProducts(category, page, per_page);
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// get one product by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const product = await getProduct(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(400).send("Product not Found");
    }
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// add new product
router.post("/", isAdmin, async (req, res) => {
  try {
    // Retrieve the data from req.body
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const image = req.body.image;
    // Check for errors
    if (!name || !price || !category) {
      return res.status(400).send({
        error: "Error: Required product data is missing!",
      });
    }
    // If no errors, pass in all the data to addNewProduct function from controller
    const newProduct = await addNewProduct(
      name,
      description,
      price,
      category,
      image
    );
    res.status(200).send(newProduct);
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// 4
router.put("/:id", isAdmin, async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const image = req.body.image;

    // Pass in the data into the updateProduct function
    const updatedProduct = await updateProduct(
      id,
      name,
      description,
      price,
      category,
      image
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// 5
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    // Retrieve the id from the URL
    const id = req.params.id;
    // Validate the ID format before querying the database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        error: `Invalid ID format: "${id}". A valid MongoDB ObjectId is required.`,
      });
    }
    const product = await getProduct(id);
    // If the product does not exist
    if (!product) {
      /* !product because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a product found with the id "${id}".`,
      });
    }
    // Trigger the deleteProduct function
    const status = await deleteProduct(id);
    res.status(200).send({
      message: `Alert: Movie with the provided id #${id} has been deleted`,
    });
  } catch (error) {
    console.log(error);
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

module.exports = router;
