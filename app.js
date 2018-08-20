const express = require('express');
const app = express();
const morgan = require('morgan');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(
    "mongodb+srv://node-shop:" +
     process.env.MONGO_ATLAS_PW + 
    "@node-rest-shop-pstoz.mongodb.net/test?retryWrites=true",
    { useNewUrlParser: true
            
     } 
);
mongoose.connection.on('connected', function () {  
    console.log('Mongoose conectado com sucesso' );
  }); 

mongoose.connection.on('error',function (err) {  
    console.log('Mongoose deu falha de execução' + err);
  }); 

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/order', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;