const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price description _id')
        .exec()
        .then(docs => {
            if (docs.length === 0) {
                const response = {
                    message: 'Lista de Produtos está vazia',
                    numberOfProducts: docs.length,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                }
                res.status(200).json({
                    response
                });
                
            }
            else {
                const response = {
                    message: 'Executou o metodo GET que pega todos os produtos',
                    numberOfProducts: docs.length,
                    products: 
                        docs.map(doc => {
                            return {
                                name: doc.name,
                                price: doc.price,
                                _id: doc._id,
                                description: doc.description,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:3000/products/' + doc._id
                                }
                            }
                        })
                };
                res.status(200).json({
                    response
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });

        })
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price descirption _id')
        .exec()
        .then(doc => {
            if(doc === null) {
                res.status(400).json({
                    product: doc,
                    message: 'Id inválido',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                })
            } 
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err, message: 'Id inválido' });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Updated',
                url: 'http://localhost:3000/products/' + id
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:300/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});



module.exports = router;