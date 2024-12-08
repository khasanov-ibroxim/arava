import React from 'react';
import BackButton from "../../../../component/back_button/back_button.jsx";
import {USER_PROFILE} from "../../../../utils/const.jsx";
import No_data from "../../../../component/no_data/no_data.jsx";


const FavoriteUser = () => {
    return (
        <>
            <BackButton title={"Sevimli Maxsulotlar"} url={USER_PROFILE}/>
            <No_data no_data_title={"Sevimli Maxsulotlar"} no_data_msg={"Sizda saqlangan sevimli mahsulotlaringiz yo'q"}/>
        </>
    );
};

export default FavoriteUser;