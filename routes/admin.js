const express = require('express');
const path = require('path');

const router = express.Router();

// const rootDir = require("../utils/path");

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/product => GET
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// module.exports = router;

module.exports = router;