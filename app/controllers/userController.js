const bcrypt = require('bcrypt');
const emailValidator = require('email-validator');
const { User, Role } = require('../models');

const userController = {
    index: (req, res) => {
        res.render('register');
    },

    register: async (req, res) => {
        try {
            // Je vérifie que les données récupérées sont valides
            const {
                firstname, lastname, email, password, passwordConfirm,
            } = req.body;

            // Je vérifie que aucun des champs n'est vide
            if (!firstname || !lastname || !email || !password || !passwordConfirm) {
                res.render('register', {
                    errorMessage: 'Tous les champs sont obligatoires',
                });
                return;
            }

            // verifier l'email avec le package npm email-validator
            if (!emailValidator.validate(email)) {
                res.render('register', {
                  errorMessage: 'L\'email n\'est pas valide',
                });
                return; // on s'arrête là en cas d'erreur
            }
          
            // Si je suis arrivé ici, c'est que toutes mes données sont valides
            // Mon utilisateur peut avoir déjà un compte
            const userWithSameEmail = await User.findOne({
                where: {
                email,
                },
            });
        
            if (userWithSameEmail) {
                res.render('register', {
                    errorMessage: 'Un utilisateur avec cet email existe déjà',
                });
                return;
            }
            // verifier si password correspond à password confirm
            if (password !== passwordConfirm) {
                res.render('register', {
                    errorMessage: 'Le mot de passe et la confirmation doivent être identiques',
                });
                return;
            }
          
            // hash password
            const passwordHashed = await bcrypt.hash(password, 10);

            // sauvegarder user
            const user = await User.create({
                name: `${firstname} ${lastname}`,
                email,
                password: passwordHashed,
                // role_id: 1, // attribuer un rôle ici, le role customer.
            });
            
            // attribuer un rôle ici, le role customer.
            // https://sequelize.org/docs/v6/core-concepts/assocs/#special-methodsmixins-added-to-instances
            const customerRole = await Role.findByPk(1);
            user.setRole(customerRole);

            res.render('login', {
                message: 'Vous pouvez maintenant vous connecter !',
            });

        } catch (error) {
            console.log(error);
            res.render('register', { error: error.errorMessage });
        }
    },

    show: async (req, res) => {
        res.render('dashboard/dashboard');
    },
};

module.exports = userController;
