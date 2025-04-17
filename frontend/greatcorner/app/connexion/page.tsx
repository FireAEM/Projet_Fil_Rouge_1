"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form, { FormProps } from "@/app/components/Form";
import styles from "./page.module.css";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext";

const ConnexionPage = () => {
  const { user, login } = useContext(AuthContext);
  const router = useRouter();

  // Si déjà connecté, rediriger immédiatement vers /dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard/user");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.email || !formData.mot_de_passe) {
      setErrorMessage("Tous les champs doivent être remplis.");
      return;
    }
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:3000/utilisateur/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Permet de transmettre le cookie de session
        body: JSON.stringify({
          email: formData.email,
          mot_de_passe: formData.mot_de_passe,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur de connexion");
      }
      const data = await response.json();
      // Mettre à jour le contexte d'authentification si nécessaire
      login(data.utilisateur);
      router.push("/dashboard/user");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const formConfig: FormProps["data"] = {
    fields: [
      {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
        value: formData.email,
        onChange: handleChange,
      },
      {
        id: "mot_de_passe",
        label: "Mot de passe",
        type: "password",
        required: true,
        value: formData.mot_de_passe,
        onChange: handleChange,
      },
    ],
    buttons: [
      {
        textContent: "Se connecter",
        type: "submit",
        class: "submitButton",
        color: "white",
        backgroundColor: "black",
      },
    ],
  };

  return (
    <div className={styles.connexionSection}>
      <div className={styles.connexionContainer}>
        <h1>Connexion</h1>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <Form data={formConfig} onSubmit={handleSubmit} />
        <p>
          Pas de compte ? <Link href="/inscription">Inscrivez-vous</Link>
        </p>
      </div>
    </div>
  );
};

export default ConnexionPage;
