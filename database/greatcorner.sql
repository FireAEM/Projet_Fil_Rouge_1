CREATE TABLE utilisateur(
   id_utilisateur SERIAL PRIMARY KEY,
   nom VARCHAR(255) NOT NULL,
   prenom VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   mot_de_passe VARCHAR(255) NOT NULL,
   role VARCHAR(255) NOT NULL
);

CREATE TABLE categorie(
   id_categorie SERIAL PRIMARY KEY,
   nom VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE annonce(
   id_annonce SERIAL PRIMARY KEY,
   titre VARCHAR(255) NOT NULL,
   description TEXT NOT NULL,
   prix NUMERIC(10,2) NOT NULL,
   localisation TEXT NOT NULL,
   image_annonce TEXT NOT NULL,
   date_creation TIMESTAMP NOT NULL,
   id_categorie INT NOT NULL,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY(id_categorie) REFERENCES categorie(id_categorie) ON DELETE CASCADE,
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE favori(
   id_favori SERIAL PRIMARY KEY,
   id_annonce INT NOT NULL,
   id_utilisateur INT NOT NULL,
   FOREIGN KEY(id_annonce) REFERENCES annonce(id_annonce) ON DELETE CASCADE,
   FOREIGN KEY(id_utilisateur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

CREATE TABLE message(
   id_message SERIAL PRIMARY KEY,
   contenu TEXT NOT NULL,
   date_envoi TIMESTAMP NOT NULL,
   id_expediteur INT NOT NULL,
   id_recepteur INT NOT NULL,
   FOREIGN KEY(id_expediteur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
   FOREIGN KEY(id_recepteur) REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);
