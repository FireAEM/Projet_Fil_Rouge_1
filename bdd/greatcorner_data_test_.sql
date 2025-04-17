INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', 'password', 'admin'),
('Martin', 'Claire', 'claire.martin@example.com', 'password', 'client'),
('Durand', 'Paul', 'paul.durand@example.com', 'password', 'client');

INSERT INTO categorie (nom) VALUES
('Électronique'),
('Mode'),
('Mobilier');

INSERT INTO annonce (titre, description, prix, localisation, image_annonce, date_creation, id_categorie, id_utilisateur) VALUES
('Samsung Galaxy S25', 'Samsung Galaxy S25 en excellent état, vendu avec boîte et accessoires.', 899.99, 'Paris', 'logo.png', NOW(), 1, 1),
('Veste en cuir', 'Veste en cuir noir véritable, taille M, très peu portée.', 129.99, 'Lyon', 'logo.png', NOW(), 2, 2),
('Canapé 3 places', 'Canapé confortable en tissu beige, parfait pour un salon cosy.', 299.99, 'Marseille', 'logo.png', NOW(), 3, 3);

INSERT INTO favori (id_annonce, id_utilisateur) VALUES
(1, 2),
(2, 3),
(3, 1);

INSERT INTO message (contenu, date_envoi, id_expediteur, id_recepteur) VALUES
('Bonjour, est-il possible de négocier le prix ?', NOW(), 2, 1),
('Oui, le prix est légèrement négociable. Quelle est votre offre ?', NOW(), 1, 2),
('Est-ce encore disponible ?', NOW(), 3, 1);