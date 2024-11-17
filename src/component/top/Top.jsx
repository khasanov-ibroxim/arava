import React, {useEffect, useState} from 'react'
import "./Top.css"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {USER_HOME, USER_LOCATION} from "../../utils/const.jsx";


export default function Top({user}) {
    const {user_id, language} = useParams();
    const [address, setAddress] = useState("Aniqlanmoqda...");

    useEffect(() => {
        if (user?.lat && user?.long) {
            // OpenStreetMap orqali geokodlash
            const fetchAddress = async () => {
                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse`,
                        {
                            params: {
                                lat: user.lat,
                                lon: user.long,
                                format: "json",
                            },
                        }
                    );
                    const location = response.data.address;
                    console.log(location)
                    const formattedAddress =
                        `${location.city || ""} - ${
                        location.residential || location.neighbourhood || location.road
                    } - ${location.house_number || location.neighbourhood || location.road}`;
                    setAddress(formattedAddress);
                } catch (error) {
                    console.error("Geokodlashda xatolik:", error);
                    setAddress("Manzilni aniqlab bo'lmadi.");
                }
            };
            fetchAddress();
        }
    }, [user?.lat, user?.long]);
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
                                    Yetkazib berish:
                                </p>
                                <p className="bottom">{address}</p>
                            </div>
                        </Link>
                        <form action="">
                            <SearchRoundedIcon/>
                            <input type="text" placeholder="Har qanday do'kon yoki mahsulotni qidiring"/>
                        </form>

                    </div>
                </div>
            </div>
        </section>
    )
}
