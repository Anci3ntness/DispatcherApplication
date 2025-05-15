import React from "react";
import styles from "./Input.module.scss";
import multiModuleStyles from "../../../utility/multiModuleStyles.js";
function Input({ value, placeholder, className, onChange, ...props }) {
    return (
        <input
            className={multiModuleStyles(styles.root, className)}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    );
}

export default Input;
