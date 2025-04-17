"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconLinkButton from "@/app/components/IconLinkButton";
import LinkButton from "@/app/components/LinkButton";
import Form, { FormProps } from "@/app/components/Form";
// Nous n'utilisons pas FileField ici puisque le composant input pour les fichiers
// est géré via le champ "InputField" dans Form.tsx.
import TextArea from "@/app/components/TextArea";
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
  id_categorie: number;
  categorie?: string;
}

const DashboardUserPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [annonces, setAnnonces] = useState<AnnonceType[]>([]);
  const [selectedAnnonce, setSelectedAnnonce] = useState<AnnonceType | null>(null);
  const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
  const [messages, setMessages] = useState<{ error?: string; success?: string }>({});
  const [formData, setFormData] = useState({
    titre: "",
    categorie: "",
    description: "",
    prix: "",
    localisation: "",
    image: "",
  });

  useEffect(() => {
    if (!user) router.push("/connexion");
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      // Récupérer les annonces de l'utilisateur
      const resA = await fetch(
        `http://localhost:3000/annonce/utilisateur/${user.id_utilisateur}`,
        { credentials: "include" }
      );
      const dataA: AnnonceType[] = await resA.json();
      const withCat = await Promise.all(
        dataA.map(async (a) => {
          const resC = await fetch(`http://localhost:3000/categorie/${a.id_categorie}`);
          const cat = await resC.json();
          return { ...a, categorie: cat.nom };
        })
      );
      setAnnonces(withCat);

      // Récupérer et préparer les catégories
      const resCats = await fetch("http://localhost:3000/categorie");
      const cats = await resCats.json();
      // On ajoute une option par défaut pour forcer le choix
      setCategories([
        { id: "", nom: "Sélectionnez une catégorie" },
        ...cats.map((c: any) => ({ id: c.id_categorie.toString(), nom: c.nom })),
      ]);
    };
    if (user) fetchData();
  }, [user]);

  const onAnnonceClick = (a: AnnonceType) => {
    setSelectedAnnonce(a);
    setMessages({});
    setFormData({
      titre: a.titre,
      categorie: a.id_categorie.toString(),
      description: a.description,
      prix: a.prix,
      localisation: a.localisation,
      image: a.image_annonce,
    });
  };

  const onFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // On ajuste le handler pour accepter l'union des types et vérifier que l'on traite bien un input file.
  const onFileChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = (e) => {
    if (e.target instanceof HTMLInputElement && e.target.files?.length) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0].name }));
    }
  };

  const handleDeleteAnnonce = async () => {
    if (!selectedAnnonce) return;
    if (!window.confirm("Voulez-vous supprimer cette annonce ?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/annonce/${selectedAnnonce.id_annonce}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setMessages({ success: "Annonce supprimée" });
      setSelectedAnnonce(null);
      setFormData({
        titre: "",
        categorie: "",
        description: "",
        prix: "",
        localisation: "",
        image: "",
      });
      router.refresh();
    } catch (err: any) {
      setMessages({ error: err.message });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages({});

    // Vérifier qu'une catégorie a bien été sélectionnée
    if (!formData.categorie) {
      setMessages({ error: "Veuillez sélectionner une catégorie valide." });
      return;
    }

    // Construction explicite du payload, en n'incluant que les clés attendues par le serveur
    const payload = {
      titre: formData.titre,
      description: formData.description,
      // Convertir le prix en nombre (parseFloat renvoie NaN si invalide)
      prix: parseFloat(formData.prix),
      localisation: formData.localisation,
      // Transmettre le nom du fichier pour l'image
      image_annonce: formData.image,
      date_creation: selectedAnnonce ? selectedAnnonce.date_creation : new Date().toISOString(),
      id_categorie: Number(formData.categorie),
      id_utilisateur: user.id_utilisateur,
    };

    try {
      const url = selectedAnnonce
        ? `http://localhost:3000/annonce/${selectedAnnonce.id_annonce}`
        : "http://localhost:3000/annonce";
      const method = selectedAnnonce ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setMessages({
        success: selectedAnnonce ? "Annonce modifiée" : "Annonce publiée",
      });
      router.refresh();
    } catch (err: any) {
      setMessages({ error: err.message });
    }
  };

  const onAdd = () => {
    setSelectedAnnonce(null);
    setMessages({});
    setFormData({ titre: "", categorie: "", description: "", prix: "", localisation: "", image: "" });
  };

  const formConfig: FormProps["data"] = {
    fields: [
      { id: "titre", label: "Titre", value: formData.titre, onChange: onFormChange, required: true },
      {
        id: "categorie",
        label: "Catégorie",
        component: "select",
        value: formData.categorie,
        onChange: onFormChange,
        required: true,
        options: categories,
      },
      {
        id: "description",
        label: "Description",
        component: "textarea",
        value: formData.description,
        onChange: onFormChange,
        required: true,
      },
      { id: "prix", label: "Prix", type: "number", value: formData.prix, onChange: onFormChange, required: true },
      { id: "localisation", label: "Localisation", type: "text", value: formData.localisation, onChange: onFormChange, required: true },
      // Pour l'image, on ne passe pas de "value" afin d'éviter les erreurs d'hydratation et de compatibilité browsers
      { id: "image", label: "Image", type: "file", onChange: onFileChange },
    ],
    buttons: [
      {
        textContent: selectedAnnonce ? "Enregistrer" : "Publier",
        type: "submit",
        color: "white",
        backgroundColor: "black",
      },
    ],
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Mes annonces</h1>
        <LinkButton text="➕ Ajouter une annonce" buttonType="button" onClick={onAdd} />
        <IconLinkButton
          image="/images/utilisateur.png"
          imageAlt="Utilisateur"
          title={`${user?.nom} ${user?.prenom}`}
          text={user?.email}
          link="/dashboard/user/account"
        />
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.sidebar}>
          {annonces.map((a) => (
            <div
              key={a.id_annonce}
              onClick={() => onAnnonceClick(a)}
              style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
            >
              <IconLinkButton
                image="/images/annonce.png"
                imageAlt="Annonce"
                title={a.titre}
                text={`${a.categorie} • ${a.prix} €`}
                link="#"
              />
            </div>
          ))}
        </div>
        <div className={styles.formContainer}>
          {messages.error && <p className={styles.error}>{messages.error}</p>}
          {messages.success && <p className={styles.success}>{messages.success}</p>}
          <Form data={formConfig} onSubmit={onSubmit} />
          {selectedAnnonce && (
            <LinkButton
              text="🗑️ Supprimer l'annonce"
              buttonType="button"
              onClick={handleDeleteAnnonce}
              className={styles.deleteButton}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardUserPage;
