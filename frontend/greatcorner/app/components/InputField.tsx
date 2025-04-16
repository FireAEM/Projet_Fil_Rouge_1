import React from "react";
import styles from './InputField.module.css';

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
    value = "",
    onChange
}) => {
    return (
        <div className={styles.inputField}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                placeholder={label}
                required={required}
                value={value}
                onChange={onChange}
                className={styles.inputField}
            />
        </div>
    );
};

export default InputField;
