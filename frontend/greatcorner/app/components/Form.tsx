import React from "react";
import InputField from "@/app/components/InputField";
import LinkButton from "@/app/components/LinkButton";
import Select from "@/app/components/Select";
import styles from "./Form.module.css";

export type Field = {
    label: string;
    type?: string;
    id: string;
    required?: boolean;
    value?: string;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    component?: string;
    options?: { id: string; nom: string }[];
};

export type ButtonProps = {
    textContent: string;
    type?: "button" | "submit" | "reset";
    class?: string;
    onClick?: () => void;
    color?: string;
    backgroundColor?: string;
    link?: string;
};

export type FormProps = {
    data: {
        fields: Field[];
        buttons: ButtonProps[];
    };
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const Form: React.FC<FormProps> = ({ data, onSubmit }) => {
    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {data.fields.map((field, index) => {
                if (field.component === "select" && field.options) {
                    const selectOptions = field.options.map((opt) => ({
                        value: opt.id,
                        label: opt.nom,
                    }));
                    return (
                        <Select
                            key={index}
                            value={field.value || ""}
                            onChange={(val) => {
                                if (field.onChange) {
                                // Création d'un événement synthétique pour respecter l'interface
                                const event = {
                                    target: {
                                    name: field.id,
                                    value: val,
                                    },
                                } as React.ChangeEvent<HTMLSelectElement>;
                                field.onChange(event);
                                }
                            }}
                            options={selectOptions}
                        />
                    );
                }
                return (
                    <InputField
                        key={index}
                        label={field.label}
                        type={field.type || "text"}
                        name={field.id}
                        required={field.required}
                        value={field.value || ""}
                        onChange={field.onChange}
                    />
                );
            })}

            {data.buttons.map((button, index) => (
                <LinkButton
                    key={index}
                    text={button.textContent}
                    buttonType={button.type || "button"}
                    className={button.class || ""}
                    onClick={button.onClick}
                    color={button.color}
                    backgroundColor={button.backgroundColor}
                    link={button.link}
                />
            ))}
        </form>
    );
};

export default Form;
