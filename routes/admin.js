const express = require('express');
const path = require('path');

const router = express.Router();

const { body } = require("express-validator/check")

// const rootDir = require("../utils/path");

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');


// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/product => GET
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl'),
    body('price')
        .isFloat(),
    body('description')
        .isString()
        .isLength({ min: 5, max: 400 })
        .trim()
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl'),
    body('price')
        .isFloat(),
    body('description')
        .isString()
        .isLength({ min: 5, max: 400 })
        .trim()
], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

// module.exports = router;

module.exports = router;