// Ici je vais coder mon serveur
// require ressemble a import pour importer un module. 
// Le module HTTP est stocké dans la variable http.

const http = require('http') // C'est http qui va créer un serveur

// J'importe l'application express app.js qui nous permet de créer les routes
const app = require('./app');

// Stockage du port en dur pour éviter la saisie en dur
const numeroPort = 3003;

// Je configure le numéro de port utiliser dans le serveur
app.set('port',numeroPort);


// Création du serveur en utilisant express (app) en paramètre de la fonction createServer
const serveur = http.createServer(app);

serveur.listen(numeroPort, ()=> {
    console.log("Le serveur de Maybox est à l'écoute sur le port", numeroPort);
});