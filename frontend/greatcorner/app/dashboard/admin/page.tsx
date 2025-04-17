"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/AuthContext";
import styles from "./page.module.css";

interface AnnonceType {
  id_annonce: number;
  titre: string;
  description: string;
  prix: string;
  localisation: string;
  image_annonce: string;
  date_creation: string;
  categorie: string;
  id_categorie: number;
}

interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

const DashboardAdminPage = () => {
  const { admin } = useContext(AuthContext);
  const router = useRouter();
  const [displayMode, setDisplayMode] = useState<"annonces" | "utilisateurs" | null>(null);
  const [annonces, setAnnonces] = useState<AnnonceType[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);

  // Vérifier si l'utilisateur connecté est bien un admin.
 
  // Récupérer les données selon le mode d'affichage sélectionné
  useEffect(() => {
    if (displayMode === "annonces") {
      const fetchAnnonces = async () => {
        try {
          const res = await fetch("http://localhost:3000/annonce", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setAnnonces(data);
          } else {
            console.error("Erreur lors de la récupération des annonces");
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchAnnonces();
    } else if (displayMode === "utilisateurs") {
      const fetchUtilisateurs = async () => {
        try {
          const res = await fetch("http://localhost:3000/utilisateur", { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setUtilisateurs(data);
          } else {
            console.error("Erreur lors de la récupération des utilisateurs");
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUtilisateurs();
    }
  }, [displayMode]);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Tableau de Bord</h1>
        <div className={styles.buttonContainer}>
          <button onClick={() => setDisplayMode("annonces")} className={styles.actionButton}>
            Afficher toutes les annonces
          </button>
          <button onClick={() => setDisplayMode("utilisateurs")} className={styles.actionButton}>
            Afficher tous les utilisateurs
          </button>
        </div>
      </header>

      <main className={styles.dashboardContent}>
        {displayMode === "annonces" && (
          <div className={styles.dataContainer}>
            <h2>Toutes les annonces</h2>
            {annonces.length > 0 ? (
              annonces.map((annonce) => (
                <div key={annonce.id_annonce} className={styles.dataItem}>
                  <h3>{annonce.titre}</h3>
                  <p>{annonce.description}</p>
                  <p>Prix : {annonce.prix} €</p>
                  <p>Localisation : {annonce.localisation}</p>
                </div>
              ))
            ) : (
              <p>Aucune annonce trouvée.</p>
            )}
          </div>
        )}

        {displayMode === "utilisateurs" && (
          <div className={styles.dataContainer}>
            <h2>Tous les utilisateurs</h2>
            {utilisateurs.length > 0 ? (
              utilisateurs.map((usr) => (
                <div key={usr.id_utilisateur} className={styles.dataItem}>
                  <h3>
                    {usr.nom} {usr.prenom}
                  </h3>
                  <p>Email : {usr.email}</p>
                </div>
              ))
            ) : (
              <p>Aucun utilisateur trouvé.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardAdminPage;
