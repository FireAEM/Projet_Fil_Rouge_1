"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import ClassifiedUser from "./components/ClassifiedUser";
import ClassifiedInformations from "./components/ClassifiedInformations";
import LinkButton from "@/app/components/LinkButton";
import { AuthContext } from "@/app/context/AuthContext";

export default function Annonce() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useContext(AuthContext);

    // Contiendra les données de l'annonce
    const [annonce, setAnnonce] = useState<any>(null);
    // Pour suivre si l'annonce est favorite, nous stockons l'id_du favori (s'il existe) sinon null
    const [favoriteId, setFavoriteId] = useState<number | null>(null);

    // Récupération de l'annonce et compléments (catégorie, utilisateur)
    useEffect(() => {
        const fetchAnnonce = async () => {
            try {
                const res = await fetch(`http://localhost:3000/annonce/${id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Récupérer la catégorie
                    const resCat = await fetch(
                        `http://localhost:3000/categorie/${data.id_categorie}`
                    );
                    const categoryData = resCat.ok ? await resCat.json() : null;

                    // Récupérer les informations de l'utilisateur
                    const resUser = await fetch(
                        `http://localhost:3000/utilisateur/${data.id_utilisateur}`
                    );
                    const userData = resUser.ok ? await resUser.json() : null;

                    setAnnonce({
                        ...data,
                        categorie: categoryData ? categoryData.nom : "Catégorie inconnue",
                        utilisateur:
                        userData || { id_utilisateur: 0, prenom: "Prénom", nom: "Nom" },
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

    // Récupération des favoris de l'utilisateur et vérification si l'annonce est déjà favorite
    useEffect(() => {
        const fetchFavorites = async () => {
        if (user && id) {
            try {
                const res = await fetch(
                    `http://localhost:3000/favori/utilisateur/${user.id_utilisateur}`
                );
                if (res.ok) {
                    const data = await res.json(); // On attend un tableau de favoris
                    if (Array.isArray(data) && data.length > 0) {
                        const fav = data.find(
                            (f: any) => String(f.id_annonce) === id
                        );
                        setFavoriteId(fav ? fav.id_favori : null);
                    } else {
                        setFavoriteId(null);
                    }
                } else if (res.status === 404) {
                    // Aucun favori trouvé pour cet utilisateur
                    setFavoriteId(null);
                }
            } catch (error) {
                console.error("Erreur lors du fetch des favoris :", error);
            }
        }
        };

        fetchFavorites();
    }, [user, id]);

    // Gestion du clic sur le bouton favori
    const handleFavoriteClick = async () => {
        if (!user) {
            router.push("/connexion");
            return;
        }

        if (favoriteId) {
            // L'annonce est déjà dans les favoris : nous effectuons une suppression
            try {
                    const res = await fetch(`http://localhost:3000/favori/${favoriteId}`, {
                        method: "DELETE",
                        credentials: "include",
                    });
                    if (res.ok) {
                        setFavoriteId(null);
                    } else {
                        console.error("Erreur lors de la suppression du favori");
                    }
                } catch (error) {
                    console.error("Erreur lors de la suppression du favori :", error);
                }
            } else {
            // L'annonce n'est pas encore favorite : on l'ajoute aux favoris
            try {
                const res = await fetch("http://localhost:3000/favori", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    id_annonce: Number(id),
                    id_utilisateur: user.id_utilisateur,
                }),
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.newFavori && data.newFavori.id_favori) {
                        setFavoriteId(data.newFavori.id_favori);
                    }
                } else {
                    console.error("Erreur lors de l'ajout du favori");
                }
            } catch (error) {
                console.error("Erreur lors de l'ajout du favori :", error);
            }
        }
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
                {/* Informations de l'utilisateur qui a posté l'annonce */}
                <ClassifiedUser
                    id={annonce.utilisateur.id_utilisateur}
                    lastName={annonce.utilisateur.nom}
                    firstName={annonce.utilisateur.prenom}
                    link={`/message?seller=${annonce.utilisateur.id_utilisateur}`}
                />
                {/* Informations de l'annonce */}
                <ClassifiedInformations
                    title={annonce.titre}
                    category={annonce.categorie}
                    location={annonce.localisation}
                    price={parseFloat(annonce.prix)}
                    description={annonce.description}
                />
                {/* Bouton Favori avec style conditionnel */}
                <LinkButton
                    onClick={handleFavoriteClick}
                    className={`${styles.favoriteButton} ${
                        favoriteId ? styles.favoriteActive : ""
                }`}
                    text={favoriteId ? "❤️ Favori" : "🤍 Ajouter aux favoris"}
                />
            </div>
        </div>
    );
}
