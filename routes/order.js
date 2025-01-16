const express = require("express");
const mongoose = require("mongoose");
// set up the order router
const router = express.Router();
// import all the order functions
const {
  getOrders,
  getOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");

const { isValidUser, isAdmin } = require("../middleware/auth");

/*
    GET /orders
    POST /orders
    PUT /orders/:id
    DELETE /orders/:id
*/

// GET /orders
router.get("/", isValidUser, async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await getOrders(email);
    res.status(200).send(orders);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// POST /orders - create new order
router.post("/", isValidUser, async (req, res) => {
  try {
    // const customerName = req.body.customerName;
    // const customerEmail = req.body.customerEmail;
    // const products = req.body.products;
    // const totalPrice = req.body.totalPrice;
    const {
      customerName = "",
      customerEmail = "",
      products = [],
      totalPrice = 0,
    } = req.body;
    const newOrder = await addNewOrder(
      customerName,
      customerEmail,
      products,
      totalPrice
    );
    res.status(200).send(newOrder);
  } catch (error) {
    res.status(400).send({
      error: error._message,
    });
  }
});

// PUT /orders/:id - update the order status
router.put("/:id", isAdmin, async (req, res) => {
  try {
    // Retrieve id from URL
    const id = req.params.id;
    // Retrieve the data from req.body
    const status = req.body.status;
    // Pass in the data into the updateOrder function
    const updatedOrder = await updateOrder(id, status);
    res.status(200).send(updatedOrder);
  } catch (error) {
    // If there is an error, return the error code
    res.status(400).send({
      error: error._message,
    });
  }
});

// DELETE /orders/:id - delete the order
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
    const order = await getOrder(id);
    // If the order does not exist
    if (!order) {
      /* !order because it is returning either a single object or null */
      return res.status(404).send({
        error: `Error: No match for a order found with the id "${id}".`,
      });
    }
    // Trigger the deleteOrder function
    const status = await deleteOrder(id);
    res.status(200).send({
      status: "success",
      message: `Order with the provided id #${id} has been deleted`,
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
