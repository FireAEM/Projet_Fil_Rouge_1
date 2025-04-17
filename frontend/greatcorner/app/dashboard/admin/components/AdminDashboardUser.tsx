import React from "react";
import LinkButton from "@/app/components/LinkButton";
import styles from "./AdminDashboardUser.module.css";

type AdminDashboardUserProps = {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    onButtonClick?: () => void;
};

const AdminDashboardUser: React.FC<AdminDashboardUserProps> = ({
    firstName = "Prénom",
    lastName = "Nom",
    email = "email@example.com",
    role = "Utilisateur",
    onButtonClick,
}) => {
    return (
        <div className={styles.adminDashboardUser}>
            <h3>{lastName} {firstName}</h3>
            <p className={styles.userDetails}>{email} • {role}</p>
            <LinkButton 
                text="🗑️ Supprimer" 
                onClick={onButtonClick} 
                className={styles.deleteButton} 
            />
        </div>
    );
};

export default AdminDashboardUser;
