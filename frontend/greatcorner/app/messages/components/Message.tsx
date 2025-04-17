import React from "react";
import styles from "./Message.module.css";

type MessageProps = {
    lastName?: string;
    firstName?: string;
    email?: string;
    message?: string;
    date?: string | Date;
};

const Message: React.FC<MessageProps> = ({
    lastName = "Nom",
    firstName = "Prénom",
    email = "Email",
    message = "Message",
    date = new Date(),
}) => {
    const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={styles.message}>
            <div className={styles.messageInformations}>
                <h2>{lastName} {firstName}</h2>
                <a href={`mailto:${email}`} className={styles.emailLink}>{email}</a>
                <p>{formattedDate}</p>
            </div>
            <p className={styles.messageContent}>{message}</p>
        </div>
    );
};

export default Message;
