"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Classified from "@/app/components/Classified";
import CategorySelect from "@/app/annonces/components/CategorySelect";
import PriceRangeSlider from "@/app/annonces/components/PriceRangeSlider";
import SortSelect from "@/app/annonces/components/SortSelect";

export default function Annonces() {
  const [allAnnonces, setAllAnnonces] = useState<any[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<any[]>([]);

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortOption, setSortOption] = useState("default");

  const searchParams = useSearchParams();
  useEffect(() => {
    const s = searchParams.get("search") || "";
    setSearchQuery(s);
  }, [searchParams]);

  // Récupération des annonces
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const res = await fetch("http://localhost:3000/annonce");
        if (res.ok) {
          const annonces = await res.json();
          // Pour chaque annonce, récupérer la catégorie et l'utilisateur associés
          const annoncesWithDetails = await Promise.all(
            annonces.map(async (annonce: any) => {
              const resCat = await fetch(`http://localhost:3000/categorie/${annonce.id_categorie}`);
              const categoryData = resCat.ok ? await resCat.json() : null;

              const resUser = await fetch(`http://localhost:3000/utilisateur/${annonce.id_utilisateur}`);
              const userData = resUser.ok ? await resUser.json() : null;

              return {
                ...annonce,
                categorie: categoryData ? categoryData.nom : "Catégorie inconnue",
                utilisateur: userData || { prenom: "Prénom", nom: "Nom" },
              };
            })
          );
          setAllAnnonces(annoncesWithDetails);
        } else {
          console.error("Erreur lors de la récupération des annonces :", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors du fetch :", error);
      }
    };

    fetchAnnonces();
  }, []);

  // Appliquer les filtres et tri
  useEffect(() => {
    let temp = allAnnonces;

    // Filtrer par titre
    if (searchQuery) {
      temp = temp.filter((a) =>
        a.titre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrer par catégorie
    if (selectedCategory) {
      temp = temp.filter((a) => a.categorie === selectedCategory);
    }

    // Filtrer par prix
    temp = temp.filter((a) => {
      const price = parseFloat(a.prix);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Tri
    if (sortOption === "newest") {
      temp.sort(
        (a, b) =>
          new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
      );
    } else if (sortOption === "oldest") {
      temp.sort(
        (a, b) =>
          new Date(a.date_creation).getTime() - new Date(b.date_creation).getTime()
      );
    } else if (sortOption === "price-asc") {
      temp.sort((a, b) => parseFloat(a.prix) - parseFloat(b.prix));
    } else if (sortOption === "price-desc") {
      temp.sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix));
    }
    
    setFilteredAnnonces(temp);
  }, [allAnnonces, searchQuery, selectedCategory, priceRange, sortOption]);

  const categoryOptions = Array.from(
    new Set(allAnnonces.map((a) => a.categorie))
  ).filter((c) => c && c !== "Catégorie inconnue");

  return (
    <div>
      <div className={styles.classifiedSection}>
        <h1>Toutes nos annonces</h1>
        <div className={styles.filterBar}>
          <div>
            <CategorySelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
            />
            <PriceRangeSlider
              min={0}
              max={1000}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>

          <SortSelect value={sortOption} onChange={setSortOption} />
        </div>
        <div className={styles.annoncesListContainer}>
          {filteredAnnonces.length > 0 ? (
            filteredAnnonces.map((annonce) => (
              <Classified
                key={annonce.id_annonce}
                id={annonce.id_annonce}
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
