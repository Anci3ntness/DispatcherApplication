import React from "react";
import styles from "./MainLayout.module.scss";
import Header from "./components/header/index.jsx";
import Footer from "./components/footer/index.jsx";

function MainLayout({ children }) {
    return (
        <div className={styles.root}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
        </div>
    );
}

export default MainLayout;
