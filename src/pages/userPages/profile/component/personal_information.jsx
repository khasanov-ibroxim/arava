import React, {useState, useEffect} from 'react';
import BackButton from "../../../../component/back_button/back_button.jsx";
import {USER_LOCATION, USER_PROFILE} from "../../../../utils/const.jsx";
import {Button, Input, message, Popconfirm} from "antd";
import {userStore} from "../../../../zustand/userStore.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {$API} from "../../../../utils/http.jsx";

const PersonalInformation = () => {
    const {data, updateUser} = userStore();
    const navigate = useNavigate();
    const {user_id, language} = useParams();

    const [initialState, setInitialState] = useState(data);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state qo'shildi

    // Sync state with data when it changes
    useEffect(() => {
        setInitialState(data);
    }, [data]);

    // Check if changes were made
    useEffect(() => {
        setIsChanged(JSON.stringify(data) !== JSON.stringify(initialState));
    }, [data, initialState]);

    // Format phone number helper function
    const formatPhoneNumber = (value) => {
        const formattedValue = value.replace(/\D/g, '');
        let formattedNumber = '+998';
        if (formattedValue.length > 3) formattedNumber += ' ' + formattedValue.substring(3, 5);
        if (formattedValue.length > 5) formattedNumber += ' ' + formattedValue.substring(5, 8);
        if (formattedValue.length > 8) formattedNumber += ' ' + formattedValue.substring(8, 10);
        if (formattedValue.length > 10) formattedNumber += ' ' + formattedValue.substring(10, 12);
        return formattedNumber;
    };

    const confirm = async () => {
        try {
            console.log(initialState)
            setLoading(true); // Loading boshlandi
            const res = await $API.patch('/users/profile', {initialState}, {
                params: {
                    user_id: user_id
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
            message.success("O'zgarishlar saqlandi!");

        } catch (err) {
            console.error("Error in data fetch:", err);
            message.error("Xatolik yuz berdi!");
        } finally {
            setLoading(false); // Loading tugadi
            // navigate(USER_LOCATION.replace(":user_id", user_id).replace(":language", language));
        }
    };

    const handleSave = async () => {
        setLoading(true); // Loading boshlandi
        try {
            await updateUser(initialState);
            message.success("O'zgarishlar saqlandi!");
        } catch (err) {
            console.error(err);
            message.error("Xatolik yuz berdi!");
        } finally {
            setLoading(false); // Loading tugadi
        }
    };


    return (
        <>
            <BackButton url={USER_PROFILE} title={"Shaxsiy ma'lumot"}/>
            <div className="container">
                <div className="personal_user_box">
                    {/* Username */}
                    <div className="personal_user_item">
                        <p>Username</p>
                        <Input
                            type="text"
                            value={initialState.username}
                            onChange={(e) => setInitialState({...initialState, username: e.target.value})}
                        />
                    </div>

                    {/* First Name */}
                    <div className="personal_user_item">
                        <p>Ismingiz</p>
                        <Input
                            type="text"
                            value={initialState.first_name}
                            onChange={(e) => setInitialState({...initialState, first_name: e.target.value})}
                        />
                    </div>

                    {/* Last Name */}
                    <div className="personal_user_item">
                        <p>Familyangiz</p>
                        <Input
                            type="text"
                            value={initialState.last_name}
                            onChange={(e) => setInitialState({...initialState, last_name: e.target.value})}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="personal_user_item">
                        <p>Telefon raqamingiz</p>
                        <Input
                            type="text"
                            value={formatPhoneNumber(initialState.contact)}
                            onChange={(e) =>
                                setInitialState({...initialState, contact: formatPhoneNumber(e.target.value)})
                            }
                        />
                    </div>

                    {/* Update Button */}
                    <div className="personal_user_item">

                            <button type="primary" onClick={confirm}>
                                Manzilni o'zgartirish
                            </button>

                    </div>

                    {/* Save Button */}
                    <div className="personal_user_send">
                        <Button
                            disabled={!isChanged}
                            loading={loading} // Loading holati bog'landi
                            onClick={handleSave}
                        >
                            Saqlash
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PersonalInformation;
