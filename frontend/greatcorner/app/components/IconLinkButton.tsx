import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./IconLinkButton.module.css";

type IconLinkButtonProps = {
    image?: string;
    imageAlt?: string;
    title?: string;
    text?: string;
    link?: string;
    target?: "_self" | "_blank";
    onClick?: () => void;
};

const IconLinkButton: React.FC<IconLinkButtonProps> = ({
    image = "/images/logo.png",
    imageAlt = "Image",
    title = "Titre",
    text,
    link = "#",
    target = "_self",
    onClick,
}) => {
    // Détermine s'il faut rendre un bouton ou un lien
    const isButton = Boolean(onClick) || !link || link === "#";

    // Structure commune du rendu (icône + informations)
    const content = (
        <>
            <div className={styles.iconLinkButtonImageBackground}>
                <Image
                src={image}
                alt={imageAlt}
                width={25}
                height={25}
                className={styles.iconLinkButtonImage}
                />
            </div>
            <div className={styles.iconLinkButtonInformations}>
                <p className={styles.iconLinkButtonTitle}>{title}</p>
                <p className={styles.iconLinkButtonText}>{text}</p>
            </div>
        </>
    );

    if (isButton) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={styles.iconLinkButton}
            >
                {content}
            </button>
        );
    }

    return (
        <Link href={link} target={target} className={styles.iconLinkButton}>
            {content}
        </Link>
    );
};

export default IconLinkButton;