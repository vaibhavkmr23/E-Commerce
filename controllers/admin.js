const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // console.log("IN the middleware!");
    // res.sendFile(path.join(rootDir, 'views' , 'add-product.html'));
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    });// rendering PUG file for add product page
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
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

    // const product = new Product(null, title, imageUrl, description, price);
    // product.save().then(() => {
    //     res.redirect('/');
    // }).catch(err => {
    //     console.log(err);
    // });

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
                editing: editMode,
                product: product
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

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImgUrl;
            return product.save();
        }).then(result => {
            console.log("Upadated Product");
            res.redirect("/admin/products");
        }).catch(err => {
            console.log(err);
        })
};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId')// if you want to populated data related to userId
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
    Product.findByIdAndRemove(prodId)
        .then(result => {
            console.log("Destroyed Product");
            res.redirect('/admin/products');
        }).catch(err => {
            console.log(err)
        });

};