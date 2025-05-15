import React, { useState } from "react";
import styles from "./MainPage.module.scss";
import Input from "../../components/common/Input/index.jsx";
import Button from "../../components/common/Button/index.jsx";
import Spinner from "../../components/Spinner/index.jsx";
import { useNavigate } from "react-router-dom";
import { showNotification } from "../../utility/showNotification.js";
import { create } from "../../api/http/ticketAPI.js";

function MainPage() {
    const [address, setAddress] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h1>Создать заявку</h1>
            <div className={styles.mainpage}>
                <span className={styles.desc}>Создайте заявку и Диспетчер обработает ее в течение 5 минут</span>
                <div className={styles.wrapper}>
                    <label>Адрес</label>

                    <Input
                        placeholder="Ваш адрес"
                        value={address}
                        onChange={({ target }) => {
                            setAddress(target.value);
                        }}
                    />
                </div>
                <div className={styles.wrapper}>
                    <label>Тема</label>
                    <Input
                        placeholder="Опишите тематику проблемы"
                        value={topic}
                        onChange={({ target }) => {
                            setTopic(target.value);
                        }}
                    />
                </div>
                <Button
                    onClick={() => {
                        setLoading(true);
                        create(topic, address)
                            .then(data => {
                                navigate(`ticket/${data.id}`);
                            })
                            .catch(err => {
                                showNotification(err?.response?.data?.message || err.message);
                            })
                            .finally(() => setLoading(false));
                    }}
                >
                    Создать заявку
                </Button>
            </div>
        </div>
    );
}

export default MainPage;
