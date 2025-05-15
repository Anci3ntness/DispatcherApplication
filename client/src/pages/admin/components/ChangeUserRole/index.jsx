import React, { useEffect, useState } from "react";
import styles from "./ChangeUserRole.module.scss";
import Select from "../../../../components/common/Select/index.jsx";
import { USER_ROLES } from "../../../../utility/constants.js";
import Spinner from "../../../../components/Spinner/index.jsx";
import Button from "../../../../components/common/Button/index.jsx";
import { getUsers, updateRole } from "../../../../api/http/userAPI.js";
import { showNotification } from "../../../../utility/showNotification.js";
function ChangeUserRole() {
    const [selected, setSelected] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    async function usersRequest() {
        setLoading(true);
        getUsers()
            .then(res => {
                if (!res) return;
                setUsers(res);
            })
            .catch(err => {
                showNotification(err?.response?.data?.message || err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    useEffect(() => {
        usersRequest();
    }, []);

    return (
        <div className={styles.root}>
            <Spinner isLoading={loading} />
            <h2>Изменить роль пользователя</h2>
            <div className={styles.adminpage}>
                <div className={styles.adminheader}>
                    <h3>Выберите пользователя</h3>
                    <Select
                        value={selected}
                        options={users.map(({ id, email }) => {
                            return { name: email, value: id };
                        })}
                        onChange={({ target }) => {
                            setSelected(target.value);
                        }}
                        className={styles.inputcomponent}
                    />
                    <h3>Выберите роль</h3>
                    <Select
                        value={selectedRole}
                        options={Object.values(USER_ROLES).map(e => {
                            return { name: e, value: e };
                        })}
                        onChange={({ target }) => {
                            setSelectedRole(target.value);
                        }}
                        className={styles.inputcomponent}
                    />
                </div>

                {selected !== "" && (
                    <Button
                        className={styles.createbtn}
                        onClick={() => {
                            setLoading(true);
                            updateRole(selected, selectedRole)
                                .then(() => {
                                    setSelected("");
                                    setSelectedRole("");
                                })
                                .catch(err => {
                                    showNotification(err?.response?.data?.message || err.message);
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        }}
                    >
                        Изменить
                    </Button>
                )}
            </div>
        </div>
    );
}

export default ChangeUserRole;
