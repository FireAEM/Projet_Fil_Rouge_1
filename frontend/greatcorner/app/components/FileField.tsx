import React from "react";
import styles from "./FileField.module.css";

type FileFieldProps = {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
};

const FileField: React.FC<FileFieldProps> = ({ name, onChange, accept = "image/*" }) => {
    return (
        <div className={styles.fileField}>
            <input type="file" name={name} onChange={onChange} accept={accept} />
        </div>
    );
};

export default FileField;