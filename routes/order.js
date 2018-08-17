const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was Created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
            res.status(200).json({
            message: 'Order Details',
            orderId: req.params.orderId
        });
});


router.delete('/:ordertId', (req, res, next) => {
        res.status(200).json({
            message: 'order Delected!'
       });
});



module.exports = router;