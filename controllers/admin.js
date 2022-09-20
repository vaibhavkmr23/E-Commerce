const { validationResult } = require('express-validator/check');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // if(!req.session.isLoggedIn){
    //     return res.redirect('/login');
    // }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: false,
        validationError: []
    });// rendering PUG file for add product page
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()){
        console.log(errors.array())
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                decription: description
            },
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()
        });
    }
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user // Mongoose will find user id from req.user object
    });
    product.save()
        .then(result => {
            // console.log(result);
            console.log("Created Product");
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err);
        })

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product,
                hasError: false,
                errorMessage: null,
                validationError: []
            });// rendering PUG file for add product page
        }).catch(err => {
            console.log(err);
        })

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImgUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImgUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()
        });
    }

    Product.findById(prodId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/login');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImgUrl;
            product._id = prodId;

            return product.save()
                .then(result => {
                    console.log("Upadated Product");
                    res.redirect("/admin/products");
                })
        }).catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then((products) => {
            console.log(products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            }); // Rendering Pug file for Shop page
        }).catch(err => {
            console.log(err);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(result => {
            console.log("Destroyed Product");
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err)
        });

};