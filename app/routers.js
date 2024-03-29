const express = require('express');
const router = express.Router();
// controllers
const catalogController = require('./controllers/catalogController');
const sessionController = require('./controllers/sessionController');
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const cartController = require('./controllers/cartController');

const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const initCart = require('../middlewares/initCart');
const cartCalculations = require('../middlewares/cartCalculations');

// j'initialise le panier
router.use(initCart, cartCalculations);

// Page d'accueil
router.get('/', catalogController.index);

// page /shop
router.get('/shop', catalogController.productsList);

// Affichage d'une catégorie et des produits associés 
router.get('/category/:id', catalogController.category);

// Page de détail d'un produit
router.get('/product/:id', catalogController.product);

// affichage du panier
router.get('/cart', cartCalculations, cartController.index);
// mettre à jour le panier
router.post('/cart/:productId', cartCalculations, cartController.addOrUpdate);
// elever un élément du panier
router.get('/cart/remove/:productId', cartCalculations, cartController.remove);
// vider le panier
router.get('/cart/destroy', cartController.destroy);

// Affichage page formulaire de login
router.get('/login', sessionController.index);
//!! Démarre une session user si user existe, vous travaillez dans ce controller
router.post('/login', sessionController.login);

// !! Bonus : Logout, vous travaillez dans ce controller
router.get('/logout', sessionController.logout);

// Affichage page formulaire register
router.get('/register', userController.index);
// !! Bonus : Create user, si vous avez le temps, essayez de faire fonctionner ce formulaire.
router.post('/register', userController.register);

// user profile avec middleware
router.get('/profile', auth, userController.show);
// admin avec chained middlewares
router.get('/dashboard', [auth, isAdmin], adminController.index);



module.exports = router;
