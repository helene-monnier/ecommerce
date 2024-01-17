const { Category, Product } = require('../models');

const catalogController = {
    index: async (req, res) => {
        res.render('index');
    },

    productsList: async (req, res) => {
        try {
            // todo, ici il faudra les vrais produits et catégories de la db
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
        // todo, il faut récupérer la catégorie en fonction de l'id présent dans l'url et la passer à la vue
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
        // todo, récupérer le produit demandé en base de données.
        res.render('product');
    },

    cart: (req, res) => {
        res.render('cart');
    },
};

module.exports = catalogController;
