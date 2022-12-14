const fileHelper = require('../utils/file');

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
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    // console.log(image);

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            product: {
                title: title,
                price: price,
                decription: description
            },
            hasError: true,
            errorMessage: 'Attached File is not an image!!',
            validationError: []
        });
    }

    const imageUrl = image.path;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            product: {
                title: title,
                price: price,
                decription: description
            },
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()
        });
    }
    const product = new Product({
        // _id: new mongoose.Types.ObjectId('6329882fee31c8c97e1617ac'),
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
            // console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            product: {
                title: updatedTitle,
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
            if (image) {
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = image.path;
            }
            product._id = prodId;

            return product.save()
                .then(result => {
                    console.log("Upadated Product");
                    res.redirect("/admin/products");
                })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return next(new Error('Product Not Found'));
            }
            fileHelper.deleteFile(product.imageUrl);
            return Product.deleteOne({ _id: prodId, userId: req.user._id })
        })
        .then(result => {
            console.log("Destroyed Product");
            res.status(200).json({ message: "Success!!" })
        }).catch(err => {
            res.status(500).json({ message: "Deleteing Products Failed" });
        })

};