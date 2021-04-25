const ProductModel = require('../models/ProductModel.js');

const config = require('../../config');
const uuid = require('node-uuid');
const ip = require('ip');
const host = process.env.HOST_IP || ip.address();

const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
    clientId: 'order-product-group',
    brokers: [`${host}:9092`, `${host}:9093`]
});

const consumer = kafka.consumer({ groupId: 'order-product-group' });

let runConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'order_events', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value.toString(),
            });

            let deleteproduct = await ProductModel.findOneAndUpdate({product_id: message.value.toString()}, {$inc: {quantity: -1}}).exec();
            if(deleteproduct) console.log("Unable to update product.");
        },
    })
};

runConsumer().catch(error => console.log("error: ", error));

module.exports = {

    createProduct: async function(req, res) {

        if( !req.body.name || !req.body.quantity || !req.body.price) return res.status(400).json({status: 400, message: "Your request cannot be processed. Supply missing fields."});

        var new_product = new ProductModel({
            name: req.body.name,
            price: req.body.price,
            quantity: req.body.quantity,
            product_id: uuid.v4().split('').splice(0, 20).join('').toUpperCase()
        });

        new_product.save((err) => {
            if(err) return res.status(500).json({status: 500, message: 'Unable to process your request.', error: error});

            return res.status(200).json({status: 200, message: "Product added."});
        });
    },

    deleteProduct: async function(req, res) {

        try {

            let deleteproduct = await ProductModel.deleteOne({product_id: req.params.product_id}).exec();

            if(!deleteproduct.deletedCount) {
                return res.status(500).json({message: "Unable to delete product. Ensure product ID exists.", status: 500});
            }

            return res.status(200).json({message: "Product successfully removed.", status: 200});

        } catch (error) {
            return res.status(500).json({status: 500, message: error.message});
        }
    },

    getProduct: async function(req, res) {
        try {

            let product = await ProductModel.findOne({product_id: req.params.product_id}).exec();
            if(!product) return res.status(404).json({message: "Product not found.", status: 404});

            return res.status(200).json({data: product, status: 200});

        } catch (error) {
            return res.status(500).json({status: 500, message: error.message});
        }
    },

    listProducts: async function(req, res) {

        try {

            let products = await ProductModel.find({}).exec();

            return res.status(200).json({data: products, status: 200});

        } catch (error) {
            return res.status(500).json({status: 500, message: error.message});
        }
    }
}