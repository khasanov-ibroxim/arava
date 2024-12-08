import React from 'react';
import "./back_button.css"
import {LeftOutlined} from "@ant-design/icons";
import {Link, useParams} from "react-router-dom";
import {Title} from "@mui/icons-material";
const BackButton = ({url , title}) => {
    const {user_id , language} = useParams()
    return (
        <div className="back-button">
            <Link className="back-button_icon" to={url.replace(":user_id", user_id).replace(":language", language)}>
                <LeftOutlined />
            </Link>
            <div className="back-button_text" >
                {title && title}
            </div>
        </div>
    );
};

export default BackButton;