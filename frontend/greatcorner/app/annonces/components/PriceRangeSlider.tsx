import React from "react";
import styles from "./PriceRangeSlider.module.css";

export type PriceRangeSliderProps = {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
};

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
}) => {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange([Number(e.target.value), value[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange([value[0], Number(e.target.value)]);
    };

    return (
        <div className={styles.sliderContainer}>
            <label className={styles.label}>
                Prix min:
                <input
                    type="number"
                    value={value[0]}
                    min={min}
                    max={max}
                    onChange={handleMinChange}
                    className={styles.input}
                />
            </label>
            <label className={styles.label}>
                Prix max:
                <input
                    type="number"
                    value={value[1]}
                    min={min}
                    max={max}
                    onChange={handleMaxChange}
                    className={styles.input}
                />
            </label>
        </div>
    );
};

export default PriceRangeSlider;
