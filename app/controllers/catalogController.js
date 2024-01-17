const { Category, Product } = require('../models');
const Sequelize = require("sequelize");

const catalogController = {
    index: async (req, res) => {
        const productsRandom = await Product.findAll({
            order: Sequelize.literal('RANDOM()'),
        });
        res.render('index', { productsRandom});
    },

    productsList: async (req, res) => {
        try {
            const products = await Product.findAll();
            const categories = await Category.findAll();

            res.render('shop', { 
                categories,
                products 
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    },

    category: async (req, res) => {
        // Je suis sur une route paramètre avec un paramètre id
        // Je le récupère depuis req.params
        const { id } = req.params;
        
        try {
            const category = await Category.findByPk(id, {
                include : [{
                    association: 'products',
                }],
            });

            res.render('category', { 
                category,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    },

    product: async (req, res) => {
        // Je suis sur une route paramètre avec un paramètre id
        // Je le récupère depuis req.params
        const { id } = req.params;

        try {
            const product = await Product.findByPk(id)

            res.render('product', { 
                product,
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Server Error');
        }
    },

    cart: (req, res) => {
        res.render('cart');
    },
};

module.exports = catalogController;
