import React from "react";
import styles from "./Select.module.css";

export type Option = {
    value: string;
    label: string;
};

export type SelectProps = {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
};

const Select: React.FC<SelectProps> = ({ value, onChange, options, className = "" }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${styles.select} ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;
