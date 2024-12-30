import React from 'react';
import "./back_button.css"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {Link, useParams} from "react-router-dom";

const BackButton = ({url , title}) => {
    const {user_id , language,shop_id} = useParams()
    return (
        <div className="back-button">
            {shop_id ?
                <Link className="back-button_icon" to={url.replace(":user_id", user_id).replace(":language", language).replace(":shop_id" , shop_id)}>
                    <ChevronLeftIcon />
                </Link> :
                <Link className="back-button_icon" to={url.replace(":user_id", user_id).replace(":language", language)}>
                    <ChevronLeftIcon />
                </Link>
            }

            <div className="back-button_text" >
                {title && title}
            </div>
        </div>
    );
};

export default BackButton;