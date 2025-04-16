import React from "react";
import styles from './ClassifiedInformations.module.css';

type ClassifiedInformationsProps = {
    title?: string;
    category?: string;
    location?: string;
    price?: number;
    description?: string;
};

const ClassifiedInformations: React.FC<ClassifiedInformationsProps> = ({
    title = "Titre annonce",
    category = "Catégorie",
    location = "Localisation",
    price = 0.00,
    description = "Description",
}) => {
    return (
        <div className={styles.classifiedInformations}>
            <div>
                <h2>{title}</h2>
                <p className={styles.classifiedInformationsCategoryLocation}>
                    {category} • {location}
                </p>
            </div>
            <p className={styles.classifiedInformationsPrice}>{price.toFixed(2)} €</p>
            <p className={styles.classifiedInformationsDescription}>{description}</p>
        </div>
    );
};

export default ClassifiedInformations;
