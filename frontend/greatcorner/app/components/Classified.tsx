import React, { useState } from "react";
import Link from "next/link";
import styles from './Classified.module.css';
import Image from "next/image";

type ClassifiedProps = {
    id: number;
    title?: string;
    category?: string;
    location?: string;
    price?: number;
    image?: string;
    firstName?: string;
    lastName?: string;
    creationDate?: Date;
};

const Classified: React.FC<ClassifiedProps> = ({
    id,
    title = "Titre annonce",
    category = "Catégorie",
    location = "Localisation",
    price = 0.00,
    image = "/images/logo.png",
    firstName = "Prénom",
    lastName = "Nom",
    creationDate = new Date(),
}) => {
    const [loading, setLoading] = useState(true);

    const formattedDate = creationDate.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/annonce/${id}`} className={styles.classifiedLink}>
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
    );      
};

export default Classified;
