"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import ClassifiedUser from "./components/ClassifiedUser";
import ClassifiedInformations from "./components/ClassifiedInformations";
import LinkButton from "@/app/components/LinkButton";

export default function Annonce() {
    const { id } = useParams();
    const router = useRouter();
    
    // État qui contiendra les données de l'annonce
    const [annonce, setAnnonce] = useState<any>(null);
    // État pour gérer l'affichage si l'annonce est favorite ou non
    const [isFavorite, setIsFavorite] = useState(false);

    // Simulation d'une vérification de connexion (sera remplacée par la gestion de session ultérieure)
    const isLoggedIn = false; // Pour l'instant, on simule que l'utilisateur n'est pas connecté

    // Fonction pour récupérer les données de l'annonce (et compléter avec la catégorie et l'utilisateur)
    useEffect(() => {
        const fetchAnnonce = async () => {
            try {
                const res = await fetch(`http://localhost:3000/annonce/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    // Récupérer le nom de la catégorie
                    const resCat = await fetch(`http://localhost:3000/categorie/${data.id_categorie}`);
                    const categoryData = resCat.ok ? await resCat.json() : null;
                    // Récupérer les informations de l'utilisateur
                    const resUser = await fetch(`http://localhost:3000/utilisateur/${data.id_utilisateur}`);
                    const userData = resUser.ok ? await resUser.json() : null;

                    setAnnonce({
                        ...data,
                        categorie: categoryData ? categoryData.nom : "Catégorie inconnue",
                        utilisateur: userData || { id_utilisateur: 0, prenom: "Prénom", nom: "Nom" },
                    });
                } else {
                    console.error("Erreur lors de la récupération de l'annonce");
                }
            } catch (error) {
                console.error("Erreur lors du fetch de l'annonce :", error);
            }
        };

        if (id) {
            fetchAnnonce();
        }
    }, [id]);

    // Gestion du clic sur le bouton Favori
    const handleFavoriteClick = async () => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }
        // Ici, vous appellerez l'endpoint pour ajouter/supprimer le favori en base
        // Pour la démonstration, nous basculons simplement l'état local
        setIsFavorite(!isFavorite);
    };

    if (!annonce) return <div>Chargement...</div>;

    return (
        <div className={styles.annonce}>
            {/* Affichage de l'image du produit */}
            <div className={styles.annonceImageContainer}>
                <Image
                    src={`/images/${annonce.image_annonce}`}
                    alt={annonce.titre}
                    width={600}
                    height={400}
                    className={styles.annonceImage}
                />
            </div>

            <div className={styles.annonceInformationsContainer}>
                {/* Affichage des informations de l'utilisateur ayant posté l'annonce */}
                <ClassifiedUser 
                    id={annonce.utilisateur.id_utilisateur}
                    lastName={annonce.utilisateur.nom}
                    firstName={annonce.utilisateur.prenom}
                    link={`/message?seller=${annonce.utilisateur.id_utilisateur}`}
                />
                {/* Affichage des informations de l'annonce */}
                <ClassifiedInformations
                    title={annonce.titre}
                    category={annonce.categorie}
                    location={annonce.localisation}
                    price={parseFloat(annonce.prix)}
                    description={annonce.description}
                />
                {/* Bouton Favori */}
                <LinkButton
                    onClick={handleFavoriteClick}
                    className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ""}`}
                    text={isFavorite ? "❤️ Favori" : "🤍 Ajouter aux favoris"}
                />
            </div>
        </div>
    );
}
