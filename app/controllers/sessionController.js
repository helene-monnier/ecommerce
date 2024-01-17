const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

const sessionController = {
    index: (req, res) => {
        res.render('login');
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // !! Votre code à partir d'ici

            // est-ce que l'user existe en bdd ? 
            const userFounded = await User.findOne({
                where: {
                    email, // Sélectionner user avec email
                },
                include: [{
                    association: 'role', // inclure son role
                }]
            });

            if (!userFounded) { // si on ne trouve pas
                res.render('login', { 
                    errorMessage: "Utilisateur ou mot de passe incorrect",
                }); //on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur
                return; // sinon on continue
            }

            // Le mot de passe est il correct ?
            const isSamePassword = await bcrypt.compare(password, userFounded.password);// On compare le mots de passe du formulaire avec celui de l'utilisateur
            
            if(!isSamePassword) {//      Si le mot de passe est incorrect :
                //on envoie un message d'erreur dans un objet:  {error: "Utilisateur ou mot de passe incorrect"} et on render `login` en lui passant l'erreur
                res.render('login', { 
                    errorMessage: 'Email ou mot de passe incorrect',
                });
                return; // sinon on continue
            }
             
            // On ajoute user a la session
            req.session.user = userFounded;
            console.log(req.session.userId)
            console.log(userFounded)
            

            // On enlève le mot de passe de la session => je n'ai conservé que l'id

            // !! Ne pas modifier cette ligne
            res.redirect('/');
        } catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');
        }
    },

    logout: (req, res) => {
        // !! Votre code ici
        // Je détruis la session
        req.session.destroy();
        res.redirect('/');
    },
};

module.exports = sessionController;
