"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form, { FormProps } from "@/app/components/Form";
import styles from "./page.module.css";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext"; // Chemin à adapter selon votre projet

const InscriptionPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    // Si déjà connecté, rediriger immédiatement vers /dashboard
    useEffect(() => {
        if (user) {
        router.push("/dashboard/user");
        }
    }, [user, router]);

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        role: "client", // Rôle par défaut
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Vérifier que tous les champs obligatoires sont remplis
        if (!formData.nom || !formData.prenom || !formData.email || !formData.mot_de_passe) {
        setErrorMessage("Tous les champs doivent être remplis.");
        return;
        }
        setErrorMessage("");

        try {
            const res = await fetch("http://localhost:3000/utilisateur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Permet la gestion de session
                body: JSON.stringify({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    mot_de_passe: formData.mot_de_passe,
                    role: formData.role, // Déjà défini à "client"
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur lors de l'inscription.");
            }
            const data = await res.json();
            setSuccessMessage("Inscription réussie !");
            // Une fois l'inscription réussie, la session est créée côté backend.
            router.push("/dashboard/user");
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    const formConfig: FormProps["data"] = {
        fields: [
            {
                id: "nom",
                label: "Nom",
                type: "text",
                required: true,
                value: formData.nom,
                onChange: handleChange,
            },
            {
                id: "prenom",
                label: "Prénom",
                type: "text",
                required: true,
                value: formData.prenom,
                onChange: handleChange,
            },
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
                textContent: "S'inscrire",
                type: "submit", // Déclarez la valeur en tant que littérale
                class: "submitButton",
                color: "white",
                backgroundColor: "black",
            },
        ],
    };

    return (
        <div className={styles.inscriptionSection}>
            <div className={styles.inscriptionContainer}>
                <h1>Inscription</h1>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
                <Form data={formConfig} onSubmit={handleSubmit} />
                <p>Déjà un compte ? <Link href="/connexion">Connectez-vous</Link></p>
            </div>
        </div>
    );
};

export default InscriptionPage;
