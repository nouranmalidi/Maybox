CREATE DATABASE Maybox;

CREATE TABLE client (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(155) NOT NULL,
    email VARCHAR(155) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipe (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(155) NOT NULL,
    prenom VARCHAR(155) NOT NULL,
    fonction VARCHAR(155) NOT NULL,
    numero_immatriculation VARCHAR(100) NOT NULL,
    telephone VARCHAR(100) NOT NULL,
    email VARCHAR(155) NOT NULL UNIQUE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE box (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_box VARCHAR(100) NOT NULL,
    prix_mensuel DECIMAL(5,2) NOT NULL, // 5,2 signifie 5 chiffres au total dont 2 après la virgule
    description TEXT
);

// Tables pour gérer les abonnements des clients aux différentes box proposées par Maybox
CREATE TABLE abonnement (   
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    id_box INT NOT NULL,
    date_souscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_client) REFERENCES client(id),
    FOREIGN KEY (id_box) REFERENCES box(id)
);

INSERT INTO box (nom_box, prix_mensuel, description) VALUES
('Box Starter', 19.99, 'Internet Fibre jusqu''à 500 Mb/s'),
('Box Premium', 29.99, 'Internet Fibre jusqu''à 2 Gb/s + Appels illimités'),
('Box Ultra', 39.99, 'Internet Fibre jusqu''à 8 Gb/s + TV + SVOD');

INSERT INTO equipe (nom, prenom, fonction, numero_immatriculation, telephone, email) VALUES
('Mohamed', 'Mabouli', 'Technicien Réseau', '123456789', '0123456789', 'mohamed.mabouli@maybox.fr'),
('Niska', 'pouloulou', 'Responsable Service Client', '987654321', '0987654321', 'niska.pouloulou@maybox.fr'),
('Ibou', 'Sbri', 'Ingénieur Support Technique', '456789123', '0147852369', 'ibou.sbri@maybox.fr'),
('Boubacar', 'Abdou', 'Chargée de Communication', '321654987', '0178965432', 'boubacar.abdou@maybox.fr'),
('Israf', 'Soilihi', 'Responsable Marketing', '654321987', '0198765432', 'israf.soilihi@maybox.fr'),
('Yacine', 'Bouzid', 'Chef de Projet', '789123456', '0167895432', 'yacine.bouzid@maybox.fr');