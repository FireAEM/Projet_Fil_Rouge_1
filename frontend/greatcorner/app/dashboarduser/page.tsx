"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import Classified from "../components/Classified";

export default function Home() {
  const [annonces, setAnnonces] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const res = await fetch("http://localhost:3000/annonce");
        if (res.ok) {
          const data = await res.json();

          const annoncesWithDetails = await Promise.all(
            latestAnnonces.map(async (annonce: any) => {
              const resCat = await fetch(`http://localhost:3000/categorie/${annonce.id_categorie}`);
              const categoryData = resCat.ok ? await resCat.json() : null;

              return {
                ...annonce,
                categorie: categoryData ? categoryData.nom : "Catégorie inconnue",
                utilisateur: userData || { prenom: "Prénom", nom: "Nom" },
              };
            })
          );

          setAnnonces(annoncesWithDetails);
          console.log("Annonces avec détails :", annoncesWithDetails);
        } else {
          console.error("Erreur lors de la récupération des annonces :", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
      }
    };

    fetchAnnonces();
  }, []);

  return (  
    <div className={styles.page}>
      {/* Section Hero */}
      <div className={styles.heroSection}>
        <div className={styles.overlayContent}>
          <h1>Achetez, vendez, échangez : tout commence ici</h1>
          <form onSubmit={handleSearchSubmit} className={styles.heroSearch}>
            <input
              type="text"
              placeholder="Recherche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <img
              src="/images/recherche.png"
              alt="Recherche"
              className={styles.heroSearchIcon}
            />
          </form>
        </div>
      </div>

      {/* Section Dernières annonces */}
      <div className={styles.newClassifiedSection}>
        <h2>Dernières annonces</h2>
        <div className={styles.annoncesListContainer}>
          {annonces.length > 0 ? (
            annonces.map((annonce) => (
              <Classified
                key={annonce.id_annonce}
                id={annonce.id_annonce}  // Passez l'identifiant ici
                title={annonce.titre}
                category={annonce.categorie}
                location={annonce.localisation}
                price={parseFloat(annonce.prix)}
                image={`/images/${annonce.image_annonce}`} 
                creationDate={new Date(annonce.date_creation)}
                firstName={annonce.utilisateur?.prenom}
                lastName={annonce.utilisateur?.nom}
              />
            ))
          ) : (
            <p>Aucune annonce trouvée</p>
          )}
        </div>
      </div>
    </div>
  );
}
