import React from "react";
import styles from "./InputField.module.css";

type InputFieldProps = {
    label?: string;
    type?: string;
    name?: string;
    required?: boolean;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({
    label = "Champ",
    type = "text",
    name = "",
    required = false,
    value,
    onChange,
}) => {
    // Construire l'objet props à appliquer à l'input
    const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
        id: name,
        type,
        name,
        placeholder: label,
        required,
        onChange,
        className: styles.inputField,
    };

    // Si le type n'est pas "file", on ajoute la prop value
    if (type !== "file") {
        inputProps.value = value ?? "";
    }

    return (
        <div className={styles.inputField}>
            <label htmlFor={name}>{label}</label>
            <input {...inputProps} />
        </div>
    );
};

export default InputField;
