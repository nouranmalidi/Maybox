// Ici, nous créons nottre application EpressJS

// J'importe le framework ExpressJS
//const console = require('console'); La console est native dans Node.js 
const express = require ('express');

// J'importe le pilote Mysql2 utlisé pour intorroger la BDD MySQL
const mysql2 = require('mysql2');

// J'importe le pilote express-myconnexion utilisé pour se connecter à la BDD
const myConnection = require('express-myconnection');

// J'initialise une application express
const app = express();

// Pour lire le JSON (si tu envoies du JSON via Postman ou un Fetch)
app.use(express.json()); 

// Pour lire les données d'un formulaire standard (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Je configure les éléments attendus pour me connecter à MySQL 
const optionsConnectionBaseDeDonnees = {
  host: "localhost",
  user: "root",
  password: "Sardines123@",
  database: "maygourmet",
  port: "3306"
};

// Middleware pour se connecter à la BDD MySQL, "pool" est une stratégie de connection à la BDD MySQL
app.use(myConnection(mysql2, optionsConnectionBaseDeDonnees, "pool"));

// Je précise que les vues sont dans le dossier views
app.set('views', './views'); 


// Je précise que nous utilisons le moteur EJS pour les vues
app.set('view engine', 'ejs');


// Je précise que j'utilise le dossier 'public' qui contient les fichiers statics
app.use(express.static('public'));