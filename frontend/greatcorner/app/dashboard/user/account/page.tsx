"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconLinkButton from "@/app/components/IconLinkButton";
import LinkButton from "@/app/components/LinkButton";
import Form, { FormProps } from "@/app/components/Form";
import { AuthContext } from "@/app/context/AuthContext";
import styles from "./page.module.css";

const DashboardUserAccountPage = () => {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    // Si l'utilisateur n'est pas connecté, rediriger vers /connexion
    useEffect(() => {
        if (!user) {
            router.push("/connexion");
        }
    }, [user, router]);

    // Assurez-vous d'initialiser le formulaire avec les données existantes de l'utilisateur
    const [userFormData, setUserFormData] = useState({
        nom: user?.nom || "",
        prenom: user?.prenom || "",
        email: user?.email || "",
        mot_de_passe: "", // Laisser vide s'il n'est pas modifié
        role: user?.role || "client", // important de conserver le rôle
    });

    // Remarque : pour gérer correctement la modification, on étend le type de handleChange
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userFormData.nom || !userFormData.prenom || !userFormData.email) {
            setErrorMessage("Tous les champs doivent être remplis.");
            return;
        }
        setErrorMessage("");
        try {
            const res = await fetch(`http://localhost:3000/utilisateur/${user.id_utilisateur}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                nom: userFormData.nom,
                prenom: userFormData.prenom,
                email: userFormData.email,
                // Envoyer le mot de passe uniquement s'il a été modifié
                ...(userFormData.mot_de_passe && { mot_de_passe: userFormData.mot_de_passe }),
                role: userFormData.role, // Conserver le rôle existant
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erreur lors de la mise à jour.");
            }
            router.push("/dashboard/user");
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const formConfig: FormProps["data"] = {
        fields: [
            {
                id: "nom",
                label: "Nom",
                type: "text",
                required: true,
                value: userFormData.nom,
                onChange: handleChange,
            },
            {
                id: "prenom",
                label: "Prénom",
                type: "text",
                required: true,
                value: userFormData.prenom,
                onChange: handleChange,
            },
            {
                id: "email",
                label: "Email",
                type: "email",
                required: true,
                value: userFormData.email,
                onChange: handleChange,
            },
            {
                id: "mot_de_passe",
                label: "Mot de passe",
                type: "password",
                required: true,
                value: userFormData.mot_de_passe,
                onChange: handleChange,
            },
        ],
        buttons: [
            {
                textContent: "Enregistrer",
                type: "submit",
                class: "submitButton",
                color: "white",
                backgroundColor: "black",
            },
        ],
    };

    // Fonction pour la suppression du compte avec confirmation
    const handleDeleteAccount = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.")) {
            try {
                    const res = await fetch(`http://localhost:3000/utilisateur/${user.id_utilisateur}`, {
                    method: "DELETE",
                    credentials: "include",
                });
                    if (res.ok) {
                    logout();
                    router.push("/connexion");
                } else {
                    alert("Erreur lors de la suppression du compte.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Confirmation de déconnexion
    const handleLogout = () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            logout();
            router.push("/connexion");
        }
    };

    return (
        <div className={styles.accountContainer}>
            {/* En-tête */}
            <div className={styles.accountHeader}>
                <h1>Mon compte</h1>
                <LinkButton
                    text="📝 Voir mes annonces"
                    buttonType="button"
                    onClick={() => router.push("/dashboard/user")}
                />
                <IconLinkButton
                    image="/images/utilisateur.png"
                    imageAlt="Utilisateur"
                    title={`${user?.nom} ${user?.prenom}`}
                    text={user?.email}
                    link="/dashboard/user/account"
                />
            </div>

            <div className={styles.accountContent}>
                {/* Sidebar avec liens pour Mes informations, Déconnexion et Suppression du compte */}
                <div className={styles.sidebar}>
                    <IconLinkButton
                        image="/images/utilisateur.png"
                        imageAlt="Information"
                        title="Mes informations"
                        text=""
                        link="#"
                    />
                    <IconLinkButton
                        image="/images/deconnexion.png"
                        imageAlt="Déconnexion"
                        title="Se déconnecter"
                        text=""
                        link="#"
                        onClick={handleLogout}
                    />
                    <IconLinkButton
                        image="/images/supprimer.png"
                        imageAlt="Supprimer"
                        title="Supprimer le compte"
                        text=""
                        link="#"
                        onClick={handleDeleteAccount}
                    />
                </div>
                <div className={styles.formContainer}>
                    <h2>Modifier mes informations</h2>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <Form data={formConfig} onSubmit={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default DashboardUserAccountPage;
