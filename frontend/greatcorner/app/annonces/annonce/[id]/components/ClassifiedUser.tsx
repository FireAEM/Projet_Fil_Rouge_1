import React from "react";
import Image from "next/image";
import styles from './ClassifiedUser.module.css';
import LinkButton from "@/app/components/LinkButton";

type ClassifiedUserProps = {
    id: number;
    lastName?: string;
    firstName?: string;
    onContact?: () => void;
};

const ClassifiedUser: React.FC<ClassifiedUserProps> = ({
    id,
    lastName = "Nom",
    firstName = "Prénom",
    onContact,
}) => {
    return (
        <div className={styles.classifiedUser}>
            <div className={styles.classifiedUserImageBackground}>
                <Image
                    src="/images/utilisateur.png"
                    alt="Utilisateur"
                    width={25}
                    height={25}
                    className={styles.classifiedUserImage}
                />
            </div>
            <h2>{lastName} {firstName}</h2>
            <LinkButton
                onClick={onContact}
                className="classifiedUserMessageButton"
                text="Contacter"
                color="white"
                backgroundColor="black"
            />
        </div>
    );
};

export default ClassifiedUser;
