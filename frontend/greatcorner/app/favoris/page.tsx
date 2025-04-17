"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Classified from "@/app/components/Classified";
import styles from "./page.module.css";
import { AuthContext } from "@/app/context/AuthContext";

export default function FavorisPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [favoriteAnnonces, setFavoriteAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Si l'utilisateur n'est pas connecté, rediriger vers /connexion
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/connexion");
    }
  }, [user, loading, router]);

  // Récupérer les favoris de l'utilisateur et les annonces associées
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const res = await fetch(
            `http://localhost:3000/favori/utilisateur/${user.id_utilisateur}`,
            { credentials: "include" }
          );
          if (!res.ok) {
            console.error(
              "Erreur lors de la récupération des favoris :",
              res.statusText
            );
            return;
          }
          const favoris = await res.json();

          // Pour chaque favori, récupérer les détails de l'annonce
          const annonces = await Promise.all(
            favoris.map(async (fav: { id_annonce: number }) => {
              const resAnnonce = await fetch(
                `http://localhost:3000/annonce/${fav.id_annonce}`,
                { credentials: "include" }
              );
              if (resAnnonce.ok) {
                const annonce = await resAnnonce.json();
                return annonce;
              } else {
                return null;
              }
            })
          );
          // Filtrer les éventuels résultats nulls
          setFavoriteAnnonces(annonces.filter((a) => a));
        } catch (error) {
          console.error("Erreur lors du fetch des favoris :", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) return <p className={styles.loading}>Chargement...</p>;

  return (
    <div className={styles.favorisSection}>
      <h1>Mes favoris</h1>
      <div className={styles.favorisListContainer}>
        {favoriteAnnonces.length > 0 ? (
          favoriteAnnonces.map((annonce) => (
            <Classified
              key={annonce.id_annonce}
              id={annonce.id_annonce}
              title={annonce.titre}
              category={annonce.categorie || "Catégorie inconnue"}
              location={annonce.localisation}
              price={parseFloat(annonce.prix)}
              image={`/images/${annonce.image_annonce}`}
              creationDate={new Date(annonce.date_creation)}
              firstName={annonce.utilisateur?.prenom || "Prénom"}
              lastName={annonce.utilisateur?.nom || "Nom"}
            />
          ))
        ) : (
          <p>Aucun favori trouvé</p>
        )}
      </div>
    </div>
  );
}
