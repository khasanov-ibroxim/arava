import React from 'react';
import {Link, useParams} from "react-router-dom";
import {USER_HOME} from "../../utils/const.jsx";

const ErrorLoading = ({
                          error_code,
                          error_title,
                          error_message,
                          refresh,
     errorData
                      }) => {
    const {user_id, language} = useParams()
    return (

        <div className={"error"}>
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="col-sm-10 col-sm-offset-1  text-center">
                                <div className="four_zero_four_bg">
                                    {errorData}
                                    {error_code ? <h1 className="text-center ">{error_code}</h1> : ""}

                                </div>
                                <div className="contant_box_404">
                                    {error_title ? <h3 className="h2">{error_title}</h3> : ""}

                                    {error_message ? <p>{error_message}</p> : ""}

                                    {refresh ? <div
                                            onClick={()=>window.location.reload()}
                                            className="link_404">Qayta urunib korish</div> :
                                        <Link  className="link_404"
                                              to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}>Bosh
                                            sahifaga qaytish</Link>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ErrorLoading;