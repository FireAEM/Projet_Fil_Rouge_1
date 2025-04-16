import Link from "next/link";
import React from "react";
import styles from "./LinkButton.module.css";

type LinkButtonProps = {
    link?: string;
    text?: string;
    target?: "_self" | "_blank";
    className?: string;
    color?: string;
    backgroundColor?: string;
    onClick?: () => void;
    buttonType?: "button" | "submit" | "reset";
};

const LinkButton: React.FC<LinkButtonProps> = ({
    link,
    text = "Bouton",
    target = "_self",
    className = "",
    color = "var(--text-color)",
    backgroundColor = "var(--background-color2)",
    onClick,
    buttonType = "button",
}) => {
    const style = {
        color,
        backgroundColor,
    };

    const isButton = Boolean(onClick) || !link || link === "#";

    if (isButton) {
        return (
            <button
                type={buttonType}
                onClick={onClick}
                className={`${styles.linkButton} ${className}`}
                style={style}
            >
                {text}
            </button>
        );
    }

    return (
        <Link
            href={link}
            target={target}
            className={`${styles.linkButton} ${className}`}
            style={style}
        >
            {text}
        </Link>
    );
};

export default LinkButton;