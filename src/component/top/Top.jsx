import React, {useEffect, useState} from 'react'
import "./Top.css"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {USER_HOME, USER_LOCATION} from "../../utils/const.jsx";
import {useTranslation} from "react-i18next";
import {userLocationStore, userStore} from "../../zustand/userStore.jsx";


export default function Top({user}) {
    const {user_id, language} = useParams();
    const { getLocation, address, success, error } = userLocationStore();
    const {t} = useTranslation();
    const { getUser, data, loading } = userStore();


    useEffect(() => {
        if (data?.lat && data?.long) {
            getLocation(); // Faqat foydalanuvchi joylashuvi bo‘lsa chaqiradi
        }
    }, [data, getLocation]);
    return (
        <section className='top'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <Link
                            className="box"
                            to={USER_LOCATION.replace(":user_id", user_id).replace(":language", language)}
                        >
                            <div className="text">
                                <p className="top">
                                    {t("top.text")}
                                </p>
                                <p className="bottom">{address}</p>
                            </div>
                        </Link>
                        <form action="">
                            <SearchRoundedIcon/>
                            <input type="text" placeholder={t("top.search")}/>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    )
}
