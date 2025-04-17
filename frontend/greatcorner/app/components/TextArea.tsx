import React from "react";
import styles from "./TextArea.module.css";

type TextAreaProps = {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
};

const TextArea: React.FC<TextAreaProps> = ({ name, value, onChange, required }) => {
    return (
        <textarea
            name={name}
            placeholder={name}
            value={value}
            onChange={onChange}
            required={required}
            className={styles.textArea}
        />
    );
};

export default TextArea;
