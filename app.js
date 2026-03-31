// Ici, nous créons nottre application EpressJS

// J'importe le framework ExpressJS
//const console = require('console'); La console est native dans Node.js 
const express = require ('express');

// J'importe le pilote Mysql2 utlisé pour intorroger la BDD MySQL
const mysql2 = require('mysql2');

// J'importe le module bcrypt pour le hachage des mots de passe
const bcrypt = require('bcrypt');
const saltRounds = 10; // Le niveau de complexité du hachage

// J'importe le pilote express-myconnexion utilisé pour se connecter à la BDD
const myConnection = require('express-myconnection');

const session = require('express-session');


// J'initialise une application express
const app = express();


app.use(session({
  secret: 'ma_cle_secrete_super_secure', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Tu mets 'true' si tu es en HTTPS (pas le cas ici)
}));



// Pour lire le JSON (si tu envoies du JSON via Postman ou un Fetch)
app.use(express.json()); 

// Pour lire les données d'un formulaire standard (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// Je configure les éléments attendus pour me connecter à MySQL 
const optionsConnectionBaseDeDonnees = {
  host: "localhost",
  user: "root",
  password: "Sardines123@",
  database: "Maybox",
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


app.get('/api/accueil', (req, res) => {
  // On passe le nom du client à la vue (s'il existe)
  res.render("accueil", { 
    nomClient: req.session.clientNom || null 
  });
});


// J'ajoute un utilisateur dans la table client avec mot de passe haché
app.post('/api/client', (req, res) => {
  console.log("Corps de la requête : ", req.body);
  const nom_Client = req.body.nom;
  const mot_de_passe_Client = req.body.mot_de_passe;
  const mail_Client = req.body.email;

  const requeteSQL = "INSERT INTO client (nom, email, mot_de_passe) values (?, ?, ?);";

  // 1. On lance le hachage du mot de passe (10 est le "salt rounds", le niveau de sécurité)
  bcrypt.hash(mot_de_passe_Client, 10, (errBcrypt, hash) => {
    
    if (errBcrypt) {
      console.log("Erreur lors du hachage du mot de passe : ", errBcrypt);
      // On arrête tout si le hachage plante
      return res.status(500).send("Erreur interne du serveur."); 
    }

    // 2. On prépare les champs à insérer, en utilisant le 'hash' au lieu du mot de passe en clair !
    const ordreChamps = [nom_Client, mail_Client, hash];

    // 3. Je me connecte à la BDD
    req.getConnection((erreur, connection) => {
      if(erreur) {
        console.log("Erreur de connection à la BDD : ", erreur);
      } else { // Si je réussis à me connecter
        connection.query(requeteSQL, ordreChamps, (err, nouveauClient) => {
          if(err) {
            console.log("Erreur d'inscription (Email peut-être déjà utilisé)", err);
            // Tu pourrais aussi faire un res.send pour prévenir l'utilisateur ici
          } else {
            console.log("Bravo! Nouvel utilisateur ajouté avec un mot de passe sécurisé.");
            // Je redirige vers la page d'accueil
            res.status(302).redirect("/api/accueil");
          }
        });
      }
    });

  }); // Fin de bcrypt.hash
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  req.getConnection((err, connection) => {
    if (err) return res.status(500).send("Erreur de connexion");

    // 1. On cherche l'utilisateur par son email
    connection.query('SELECT * FROM client WHERE email = ?', [email], (errSQL, resultats) => {
      
      if (errSQL || resultats.length === 0) {
        return res.send("Utilisateur non trouvé ou erreur.");
      }

      const utilisateur = resultats[0];

      // 2. On compare le mot de passe tapé avec le HASH de la BDD
      bcrypt.compare(password, utilisateur.mot_de_passe, (errBcrypt, match) => {
        if (match) {
          // 3. SUCCÈS : On crée la session
          req.session.clientId = utilisateur.id;
          req.session.clientNom = utilisateur.nom;

          console.log(`Utilisateur connecté : ${utilisateur.nom}`);
          res.redirect('/api/accueil'); // Redirection vers l'accueil une fois connecté
        } else {
          // ÉCHEC
          res.send("Mot de passe incorrect.");
        }
      });
    });
  });
});


app.post('/api/souscrire', (req, res) => {
  // 1. VÉRIFICATION DE SÉCURITÉ : Le client est-il connecté ?
  if (!req.session.clientId) {
    return res.send("Erreur : Vous devez être connecté pour souscrire à une offre.");
    // Tu pourrais aussi faire : return res.redirect('/api/login');
  }

  // 2. RÉCUPÉRATION DES DONNÉES
  const id_client = req.session.clientId; // Vient de la session (créée lors du login)
  const id_box = req.body.id_box;         // Vient du champ 'hidden' du formulaire

  // 3. REQUÊTE SQL POUR INSÉRER L'ABONNEMENT
  const sql = "INSERT INTO abonnement (id_client, id_box) VALUES (?, ?)";

  req.getConnection((erreur, connection) => {
    if (erreur) {
      console.log("Erreur de connexion BDD : ", erreur);
      return res.status(500).send("Erreur interne du serveur.");
    }

    connection.query(sql, [id_client, id_box], (err, resultat) => {
      if (err) {
        console.log("Erreur lors de la souscription : ", err);
        return res.status(500).send("Erreur lors de l'enregistrement de l'abonnement.");
      }

      console.log(`Le client ID ${id_client} a souscrit à la box ID ${id_box}`);
      
      // 4. RÉPONSE AU CLIENT
      res.send(`Félicitations ${req.session.clientNom} ! Votre souscription est validée pour la box  ${id_box}.`);
      // En vrai, tu ferais plutôt un res.redirect() vers une page "Mon Compte"
    });
  });
});


app.get('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Erreur lors de la déconnexion :", err);
    }
    // Une fois déconnecté, on redirige vers l'accueil
    res.redirect('/api/accueil');
  });
});


module.exports = app;

