var express = require('express');
var router = express.Router();
var ApiController = require('../controllers/ApiController.js');

router.post('/create_product', ApiController.createProduct);

router.get('/list_products', ApiController.listProducts);

router.delete('/delete_product/:product_id', ApiController.deleteProduct);

router.get('/get_product/:product_id', ApiController.getProduct);

module.exports = router;