const express = require('express');

const path = require('path');

// const rootDir = require("../utils/path");
// const adminData = require("./admin")
const shopController = require("../controllers/shop");

const router = express.Router();

// router.get('/', shopController.getIndex);

// router.get("/products", shopController.getProducts);

// router.get('products/delete')

// Always add specific route above dynamic routes, coz order matters

// router.get('/products/:productId', shopController.getProduct);

// router.get("/cart", shopController.getCart);

// router.post('/cart', shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

// router.get("/orders" , shopController.getOrders);

module.exports = router;
