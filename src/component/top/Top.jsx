import React from 'react'
import "./Top.css"
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
export default function Top() {
    return (
        <section className='top'>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                      <div className="box">
                      <div className="text">
                            <p className="top">
                                Yetkazib berish:
                            </p>
                            <p className="bottom">toshkent - sergeli 7 - mahala</p>
                        </div>
                      </div>
                        <form action="">
                            <SearchRoundedIcon />
                            <input type="text" placeholder="Har qanday do'kon yoki mahsulotni qidiring" />
                        </form>

                    </div>
                </div>
            </div>
        </section>
    )
}
