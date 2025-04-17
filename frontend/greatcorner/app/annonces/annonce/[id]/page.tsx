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

    const [annonce, setAnnonce] = useState<any>(null);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);

    // Fetch de l'annonce + catégorie + auteur
    useEffect(() => {
        if (!id) return;
        (async () => {
            const res = await fetch(`http://localhost:3000/annonce/${id}`);
            if (!res.ok) return console.error("Annonce non trouvée");
            const data = await res.json();
            const [catRes, userRes] = await Promise.all([
                fetch(`http://localhost:3000/categorie/${data.id_categorie}`),
                fetch(`http://localhost:3000/utilisateur/${data.id_utilisateur}`)
            ]);
            const cat = catRes.ok ? await catRes.json() : null;
            const usr = userRes.ok ? await userRes.json() : null;
            setAnnonce({
                ...data,
                categorie: cat?.nom ?? "Catégorie inconnue",
                utilisateur: usr ?? { id_utilisateur: 0, prenom: "Prénom", nom: "Nom" },
            });
        })();
    }, [id]);

    // Fetch des favoris pour voir si déjà en favori
    useEffect(() => {
        if (!user || !id) return;
        (async () => {
            const res = await fetch(
                `http://localhost:3000/favori/utilisateur/${user.id_utilisateur}`
            );
            if (!res.ok) return setFavoriteId(null);
            const favs = await res.json();
            const f = favs.find((f: any) => String(f.id_annonce) === id);
            setFavoriteId(f?.id_favori ?? null);
        })();
    }, [user, id]);

    // Contact callback
    const handleContactClick = async () => {
        if (!user) {
            router.push("/connexion");
            return;
        }
        if (!annonce) return;
            const ok = window.confirm(
            "Envoyer un message au vendeur ?"
        );
        if (!ok) return;

        const contenu = 
        `Bonjour, je suis intéressé par votre annonce "${annonce.titre}" à ${parseFloat(annonce.prix).toFixed(2)} €.` +
        " Est-elle encore disponible ?";

        try {
            const res = await fetch("http://localhost:3000/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    contenu,
                    date_envoi: new Date().toISOString(),
                    id_expediteur: user.id_utilisateur,
                    id_recepteur: annonce.utilisateur.id_utilisateur,
                }),
            });
            if (!res.ok) throw new Error("Erreur envoi message");
            alert("Message envoyé !");
        } catch (err:any) {
            console.error(err);
            alert("Impossible d'envoyer le message");
        }
    };

    // Favori toggle
    const handleFavoriteClick = async () => {
        if (!user) { router.push("/connexion"); return; }
        if (favoriteId) {
            await fetch(`http://localhost:3000/favori/${favoriteId}`, { method: "DELETE", credentials:"include" });
            setFavoriteId(null);
        } else {
            const res = await fetch("http://localhost:3000/favori", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id_annonce: Number(id),
                    id_utilisateur: user.id_utilisateur,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setFavoriteId(data.newFavori.id_favori);
            }
        }
    };

    if (!annonce) return <div>Chargement…</div>;

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
                    onContact={handleContactClick}
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
