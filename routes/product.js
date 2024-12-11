const express = require("express");
//create a router for movies
const router = express.Router();

// import functions from controller
const {
  getProducts,
  getProduct,
  addNewProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

/* 
  create the routes (CRUD)
  GET /movies - get all the movies
  GET /movies/:id - get one movie by id
  POST /movies - add new movie
  PUT /movies/:id"674ff0ab6f3f9414a02b3579" - update movie
  DELETE /movies/:id - delete movie
*/

// get all the movies. Pointing to /movies
router.get("/", async (req, res) => {
  try {
    const name = req.query.name;
    const price = req.query.price;
    const description = req.query.description;
    const category = req.query.category;
    // use the getMovies from the controller to laod the movies data
    const products = await getProducts(name, price, description,category);
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send({
      error: "Product not found",
    });
  }
});
// router.get("/", async (req, res) => {
//   try {
//     const category = req.query.category;
//     // use the getMovies from the controller to laod the movies data
//     const categories = await getCategories(category);
//     res.status(200).send(categories);
//   } catch (error) {
//     res.status(400).send({
//       error: "Categories not found",
//     });
//   }
// });

// get one movie by id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await getProduct(id);
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send({
      error: "Product not found",
    });
  }
});

// add movie
// POST http://localhost:5555/movies
router.post("/", async (req, res) => {
  try {
    // retrieve the data from req.body
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    

    // check for error
    if (!name || !description || !price || !category) {
      return res.status(400).send({
        error: "Required data is missing",
      });
    }

    // pass in all the data to addNewMovie function
    const newProduct = await addNewProduct(
      name,
      description,
      price,
      category
    );
    res.status(200).send(newProduct);
  } catch (error) {
    // if there is an error, return the error code
    res.status(400).send({
      error: "Product Can't Add",
    });
  }
});

// update movie
// PUT http://localhost:5555/movies/9kdm40ikd93k300dkd3o
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    
    // pass in the data into the updateMovie function
    const updatedProduct = await updateProduct(
      id,
      name,
      description,
      price,
      category
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(400).send({
      error: "Product Couldn't Update",
    });
  }
});

// delete movie
// DELETE http://localhost:5555/movies/9kdm40ikd93k300dkd3o
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // trigger the deleteMovie function
    await deleteProduct(id);
    res.status(200).send({
      message: `Product with the provided id #${id} has been deleted`,
    });
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

module.exports = router;
