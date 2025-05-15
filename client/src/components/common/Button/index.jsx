import React from "react";
import styles from "./Button.module.scss";
import multiModuleStyles from "../../../utility/multiModuleStyles.js";
function Button({ children, onClick = () => {}, danger, className, disabled, disableBefore, ...props }) {
    return (
        <button
            onClick={() => {
                onClick();
            }}
            className={multiModuleStyles(
                styles.root,
                danger ? styles.danger : "",
                disableBefore ? styles.disablebefore : "",
                className
            )}
            disabled={disabled}
            {...props}
        >
            <span>{children}</span>
        </button>
    );
}

export default Button;
