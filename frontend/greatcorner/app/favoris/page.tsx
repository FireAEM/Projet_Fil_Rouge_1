"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import Classified from "../components/Classified";

export default function Favoris({ id_utilisateur }: { id_utilisateur: string }) {
  const [favoris, setFavoris] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const res = await fetch(`http://localhost:3000/favori/utilisateur/${id_utilisateur}`);
        if (res.ok) {
          const data = await res.json();
          setFavoris(data);
        } else {
        }
      } catch (error) {
      }
    };

    fetchFavoris();
  }, [id_utilisateur]);

  return (
    <div>
      {/* Section Mes Favoris */}
      <div className={styles.newClassifiedSection}>
        <h2>Mes favoris</h2>
        <div className={styles.annoncesListContainer}>
          {favoris.length > 0 ? (
            favoris.map((favori) => (
              <Classified
                key={favori.id_annonce}
                id={favori.id_annonce} // Passez l'identifiant ici
                title={favori.titre}
                category={favori.categorie}
                location={favori.localisation}
                price={parseFloat(favori.prix)}
                image={`/images/${favori.image_annonce}`}
                creationDate={new Date(favori.date_creation)}
                firstName={favori.utilisateur?.prenom}
                lastName={favori.utilisateur?.nom}
              />
            ))
          ) : (
            <p>Aucun favori trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
}
