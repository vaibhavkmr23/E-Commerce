const express = require('express');

const path = require('path');

// const rootDir = require("../utils/path");
// const adminData = require("./admin")
const shopController = require("../controllers/shop");
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get("/products", shopController.getProducts);

// router.get('products/delete')

// Always add specific route above dynamic routes, coz order matters

router.get('/products/:productId', shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);

router.get("/orders" , isAuth, shopController.getOrders);

module.exports = router;
