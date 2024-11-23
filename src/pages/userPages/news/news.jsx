import React from 'react';
import './news.css'
import test_img from '../../../assets/img/Group 18.svg'

const News = () => {
    return (
        <div className="user_news container">
            <div className="user_news_item">
                <div className="user_news_img">
                    <img src={'https://placehold.co/600x400/png'} alt=""/>
                </div>
                <div className="user_news_title">NEWS</div>
                <div className="user_news_text">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem blanditiis dolor eos</p>
                    <p>20.02.2024 20:00</p>
                </div>
            </div>
        </div>
    );
};

export default News;