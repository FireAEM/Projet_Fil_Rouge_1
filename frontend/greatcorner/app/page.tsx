"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParam = encodeURIComponent(searchQuery);

    // Redirige vers "/annonces" avec le paramètre de recherche
    router.push(`/annonces?search=${queryParam}`);
  };

  return (
    <div className={styles.page}>
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

      <div className={styles.newClassifiedSection}>
        <h2>Dernières annonces</h2>
        
      </div>
    </div>
  );
}
