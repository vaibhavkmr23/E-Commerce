const express = require('express');
const path = require('path');

const router = express.Router();

// const rootDir = require("../utils/path");

const adminController = require('../controllers/admin');


// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// // /admin/product => GET
router.get('/products', adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

// router.post('/delete-product',adminController.postDeleteProduct);

// module.exports = router;

module.exports = router;