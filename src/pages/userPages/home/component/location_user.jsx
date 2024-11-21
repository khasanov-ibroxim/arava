import React, {useState, useEffect, useRef} from 'react';
import {MapContainer, TileLayer, Marker, Popup, GeoJSON} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import uzbekistan from './uzbekistan.json';
import "./location_user.css"
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NearMeIcon from '@mui/icons-material/NearMe';
import {Link, useParams} from "react-router-dom";
import {USER_HOME} from "../../../../utils/const.jsx";
import {$API} from "../../../../utils/http.jsx";
import {useTranslation} from "react-i18next";


const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const customMarkerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationUser = ({user}) => {
    const {username, isMarket} = user;
    const [showBottomBar, setShowBottomBar] = useState(false);
    const [address, setAddress] = useState('');
    const {user_id, language} = useParams();
    const [position, setPosition] = useState({
        lat: user.lat,
        long: user.long,
    });
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [clicked, setClicked] = useState(false);
    const mapRef = useRef(null);
    const {t} = useTranslation();


    const tashkentRegion = uzbekistan.features.find(
        (feature) => feature.properties.ADM1_EN === 'Tashkent city'
    );

    const outsideRegions = {
        type: 'FeatureCollection',
        features: uzbekistan.features.filter(
            (feature) => feature.properties.ADM1_EN !== 'Tashkent city'
        ),
    };

    const tashkentStyle = {
        weight: 2,
        fillOpacity: 0,
    };

    const outsideTashkentStyle = {
        fillColor: 'green',
        weight: 1,
        color: 'green',
        fillOpacity: 0.3,
    };

    const marketIcon = new L.Icon({
        iconUrl: 'https://example.com/market-icon.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    });

    const search = async () => {
        const params = {
            q: searchText,
            format: "json",
            addressdetails: 1,
            polygon_geojson: 0,
            countrycodes: "UZ", // O‘zbekistonni cheklash
            bounded: 1, // Qidiruvni bounding box bilan cheklash
            viewbox: "55.208748,45.588097,73.148606,37.182116",
        };
        const queryString = new URLSearchParams(params).toString();
        try {
            const res = await axios.get(`${NOMINATIM_BASE_URL}${queryString}`);
            setSearchResults(res.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleMarkerDrag = (e) => {
        const newPosition = e.target.getLatLng();
        setPosition({
            lat: newPosition.lat,
            long: newPosition.lng,
        });
        setShowBottomBar(true);
    };

    const handleSearchSelect = (place) => {
        setPosition({
            lat: parseFloat(place.lat),
            long: parseFloat(place.lon),
        });
        setClicked(true);
        setSearchResults([])
        setShowBottomBar(true);

    };

    const updateLocation = async () => {
        try {
            const res = await $API.patch('/users/profile', {
                lat: position.lat,
                long: position.long
            }, {params: {user_id}})
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        search();
    }, [searchText]);

    useEffect(() => {
        const map = mapRef.current;
        if (map && position.lat && position.long) {
            map.flyTo([position.lat, position.long], map.getZoom());
        }
    }, [position]);
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.long}&zoom=18&addressdetails=1`
                );

                console.log(res.data);
                setAddress(res.data.display_name)
            } catch (error) {
                console.error('Error fetching address:', error);
            }
        };

        if (position.lat && position.long) {
            fetchAddress();
        }
    }, [position]); // `position` o‘zgarganida qayta ishga tushadi

    return (
        <div className={"user_map_box"}>
            <div className={"user_map_top_bar"}>
                <Link className="user_map_top_back"
                      to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}>
                    <ChevronLeftIcon/>
                </Link>
                <div className="user_map_top_input">
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder={t("location.search")}
                    />
                    <NearMeIcon/>
                </div>

                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map((place, index) => (
                            <li
                                style={{cursor: 'pointer', margin: '5px 0'}}
                                onClick={() => handleSearchSelect(place)}
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                )}

            </div>
            {showBottomBar && (
                <div className="user_map_bottom_bar">
                    <button onClick={updateLocation}>{t("location.save")}</button>
                </div>
            )}
            <MapContainer
                ref={mapRef}
                center={[position.lat, position.long]}
                zoom={15}
                className={"user_map"}

            >
                <TileLayer
                    url={'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />

                {tashkentRegion && (
                    <GeoJSON
                        data={tashkentRegion}
                        style={tashkentStyle}
                    />
                )}

                <GeoJSON
                    data={outsideRegions}
                    style={outsideTashkentStyle}
                />

                <Marker
                    position={[position.lat, position.long]}
                    icon={isMarket ? marketIcon : customMarkerIcon}
                    draggable={true}
                    eventHandlers={{
                        dragend: handleMarkerDrag,
                    }}
                >
                    <Popup open={true}>
                        {address || 'Manzil aniqlanmagan'}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationUser;
