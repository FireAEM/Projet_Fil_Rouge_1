import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LinkButton from "@/app/components/LinkButton";
import styles from "./AdminDashboardClassified.module.css";

type AdminDashboardClassifiedProps = {
    id: number;
    title?: string;
    category?: string;
    location?: string;
    price?: number;
    image?: string;
    firstName?: string;
    lastName?: string;
    creationDate?: Date;
    onButtonClick?: () => void;
};

const AdminDashboardClassified: React.FC<AdminDashboardClassifiedProps> = ({
    id,
    title = "Titre annonce",
    category = "Catégorie",
    location = "Localisation",
    price = 0.00,
    image = "/images/logo.png",
    firstName = "Prénom",
    lastName = "Nom",
    creationDate = new Date(),
    onButtonClick,
}) => {
    const [loading, setLoading] = useState(true);

    const formattedDate = creationDate.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className={styles.adminDashboardClassified}>
            <Link href={`/annonces/annonce/${id}`} className={styles.adminDashboardClassifiedLink}>
                <div className={styles.classified}>
                    <div className={loading ? styles.skeleton : ""}>
                        <Image 
                            src={image}
                            alt={`Image de ${title}`}
                            width={300}
                            height={200}
                            className={styles.classifiedImage}
                            placeholder="blur"
                            blurDataURL="/images/logo.png"
                            onLoadingComplete={() => setLoading(false)}
                        />
                    </div>
                    <h3>{title}</h3>
                    <p className={styles.classifiedCategoryLocation}>{category} • {location}</p>
                    <p className={styles.classifiedPrice}>{price.toFixed(2)} €</p>
                    <p className={styles.classifiedNameDate}>{lastName} {firstName} • {formattedDate}</p>
                </div>
            </Link>
            <LinkButton 
                text="🗑️ Supprimer" 
                onClick={onButtonClick} 
                className={styles.deleteButton}
            />
        </div>
    );      
};

export default AdminDashboardClassified;
