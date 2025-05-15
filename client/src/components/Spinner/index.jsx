import { useEffect, useState } from "react";
import styles from "./Spinner.module.scss";
function Spinner({ isLoading, delay = 300 }) {
    const [showSpinner, setShowSpinner] = useState(false);
    useEffect(() => {
        let timer;

        if (isLoading) {
            timer = setTimeout(() => {
                setShowSpinner(true);
            }, delay);
        } else {
            setShowSpinner(false);
            clearTimeout(timer);
        }

        return () => clearTimeout(timer);
    }, [isLoading, delay]);

    return showSpinner ? (
        <div className={styles.root}>
            <div className={styles.spinner}></div>
        </div>
    ) : (
        <></>
    );
}

export default Spinner;
