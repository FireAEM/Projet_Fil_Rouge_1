import React from "react";
import Select, { Option } from "@/app/components/Select"

export type CategorySelectProps = {
    value: string;
    onChange: (newValue: string) => void;
    options: string[];
};

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, options }) => {
    const selectOptions: Option[] = [
        { value: "", label: "Toutes les catégories" },
        ...options.map((option) => ({
            value: option,
            label: option,
        })),
    ];

    return <Select value={value} onChange={onChange} options={selectOptions} />;
};

export default CategorySelect;
