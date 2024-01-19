const session = require('express-session');
const pgSession = require('connect-pg-simple')(session); // il a besoin que savoir ce qu'on utilise en session 

const { Client } = require('pg');
const pgClient = new Client(process.env.PG_URL);
pgClient.connect();

const middlewareSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false, // si pas de notif dans la session, on ne sauvegarde pas 
  saveUninitialized: true, // si l'utilisateur n'a pas encore de session, on lui en crée une vide et on la sauvegarde quand même
  cookie: { secure: false}, // si on est HTTPS il faut mettre false 

  store: new pgSession({
    pool: pgClient, // obligé de mettre le pool pour pouvoir se connecter à la bdd 
    // le but de notre session est d'être persistante, donc on va la stocker en bdd
    // grce à store, on va créer un endroit dans la bdd pour stocker les élément de la session
    createTableIfMissing: true, // on crée une table si elle n'existe pas 
    tableName: 'user_sessions',
    ttl: 60 * 60, // temps de vie de la session dans la bdd
    pruneSessionRandomizedInterval: false,
    pruneSessionInterval: 60,
  })
});

module.exports = middlewareSession;