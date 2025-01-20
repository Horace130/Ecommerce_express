const axios = require("axios");
// import the Order model
const Order = require("../models/order");

// get all the orders
const getOrders = async (email, role) => {
  let filter = {};
  // if is admin, no need to filter by customerEmail
  if (role !== "admin") {
    filter.customerEmail = email;
  }
  return await Order.find(filter).sort({ _id: -1 });
};

// get on order
const getOrder = async (_id) => {
  const order = await Order.findById(_id);
  return order;
};

// add new order
const addNewOrder = async (
  customerName,
  customerEmail,
  products,
  totalPrice
) => {
  // 1. create a bill in billplz
  const billplzResponse = await axios.post(
    "https://www.billplz-sandbox.com/api/v3/bills",
    {
      collection_id: process.env.BILLPLZ_COLLECTION_ID,
      description: "Payment for My Store",
      name: customerName,
      email: customerEmail,
      amount: parseFloat(totalPrice) * 100, // parseFloat will convert string to float number
      // callback_url:
      //   "https://opulent-space-system-q64rvpjvcwgw-3000.app.github.dev/verify-payment",
      // redirect_url:
      //   "https://opulent-space-system-q64rvpjvcwgw-3000.app.github.dev/verify-payment",
      callback_url: process.env.FRONTEND_URL + "/verify-payment",
      redirect_url: process.env.FRONTEND_URL + "/verify-payment",
    },
    {
      auth: {
        username: process.env.BILLPLZ_SECRET_KEY,
        password: "",
      },
    }
  );
  // 2. retrieve the billplz_url and billplz_id
  const billplz_id = billplzResponse.data.id;
  const billplz_url = billplzResponse.data.url;

  // 3. create a new order (put in the billplz_id into the order)
  const newOrder = new Order({
    customerName,
    customerEmail,
    products,
    totalPrice,
    billplz_id,
  });
  await newOrder.save();

  // 4. return the new order with the billplz_url
  return {
    ...newOrder,
    billplz_url,
  };
};

// update order
const updateOrder = async (_id, status) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    _id,
    { status },
    // return back the new data
    { new: true }
  );
  return updatedOrder;
};

// delete order
const deleteOrder = async (_id) => {
  return await Order.findByIdAndDelete(_id);
};

module.exports = {
  getOrders,
  getOrder,
  addNewOrder,
  updateOrder,
  deleteOrder,
};
