"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Form, { FormProps } from "@/app/components/Form";
import styles from "./page.module.css";
import Link from "next/link";
import { AuthContext } from "@/app/context/AuthContext";

const InscriptionPage = () => {
    const { user, login } = useContext(AuthContext);
    const router = useRouter();

    // Si déjà connecté, rediriger vers /dashboard
    useEffect(() => {
        if (user) router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
    }, [user, router]);

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        mot_de_passe: "",
        role: "client",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nom || !formData.prenom || !formData.email || !formData.mot_de_passe) {
        setErrorMessage("Tous les champs doivent être remplis.");
        return;
        }
        setErrorMessage("");

        try {
            const res = await fetch("http://localhost:3000/utilisateur", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erreur lors de l'inscription.");
            }
            const { newUser } = await res.json();
            // On appelle login() pour remplir le contexte et le localStorage
            login(newUser);
            setSuccessMessage("Inscription et connexion réussies !");
            // redirection selon le rôle
            router.push(newUser.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
        } catch (err: any) {
            setErrorMessage(err.message);
        }
    };

    const formConfig: FormProps["data"] = {
        fields: [
            {
                id: "nom",
                label: "Nom", type:
                "text", required: true,
                value: formData.nom,
                onChange: handleChange
            },
            {
                id: "prenom",
                label: "Prénom",
                type: "text",
                required: true,
                value: formData.prenom,
                onChange: handleChange
            },
            {
                id: "email",
                label: "Email",
                type: "email",
                required: true,
                value: formData.email,
                onChange: handleChange
            },
            {
                id: "mot_de_passe",
                label: "Mot de passe",
                type: "password",
                required: true,
                value: formData.mot_de_passe,
                onChange: handleChange
            },
            ],
        buttons: [
            {
                textContent: "S'inscrire",
                type: "submit",
                class: "submitButton",
                color: "white",
                backgroundColor: "black"
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
