import React from "react";
import Select, { Option } from "@/app/components/Select";

export type SortSelectProps = {
    value: string;
    onChange: (newValue: string) => void;
};

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
    const sortOptions: Option[] = [
        { value: "default", label: "Par défaut" },
        { value: "newest", label: "Plus récent" },
        { value: "oldest", label: "Plus ancien" },
        { value: "price-asc", label: "Prix croissant" },
        { value: "price-desc", label: "Prix décroissant" },
    ];

    return <Select value={value} onChange={onChange} options={sortOptions} />;
};

export default SortSelect;
