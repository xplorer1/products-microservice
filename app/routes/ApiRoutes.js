var express = require('express');
var router = express.Router();
var ApiController = require('../controllers/ApiController.js');

var middlewares = require("../utils/middleware.js");

router.post('/auth/login', ApiController.logIn);

router.post('/admin/create_item', middlewares.checkToken, ApiController.createItem);

router.post('/customer/add_to_cart', middlewares.checkToken, ApiController.addItemToCart);

router.post('/customer/remove_from_cart', middlewares.checkToken, ApiController.removeItemFromCart);

router.use(function(req, res) {
    return res.status(404).send({ message: 'The url you visited does not exist.' });
});

module.exports = router;