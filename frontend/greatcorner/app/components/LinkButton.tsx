import Link from "next/link";
import React from "react";
import styles from './LinkButton.module.css';

type LinkButtonProps = {
    link?: string;
    text?: string;
    target?: "_self" | "_blank";
    className?: string;
    color?: string;
    backgroundColor?: string;
};

const LinkButton: React.FC<LinkButtonProps> = ({
    link = "#",
    text = "Bouton",
    target = "_self",
    className = "",
    color = "var(--text-color)",
    backgroundColor = "var(--background-color2)",
}) => {
    const style = {
        color: color,
        backgroundColor: backgroundColor,
    };

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