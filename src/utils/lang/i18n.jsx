import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const urlParts = window.location.href.split("/");
const urlLanguage = urlParts[urlParts.length - 1];

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: urlLanguage,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            uz: {
                translation:{
                    location:{
                        search:"Qidirish",
                        save:"Saqlash"
                    },
                    bottomBar:{
                        home:"Bosh Sahifa",
                        search:"Qidiruv",
                        basket:"Savat",
                        news:"Yangiliklar",
                        profile:"Profile"
                    },
                    top:{
                        text:"Manzilingiz",
                        search:"Har qanday do'kon yoki mahsulotni qidiring",
                    }
                }
            },
            rus: {
                translation:{
                    location:{
                        search:"поиск",
                        save:"Сохранять"
                    },
                    bottomBar:{
                        home:"Главная",
                        search:"Поиск",
                        basket:"Корзина",
                        news:"Новости",
                        profile:"Профиль"
                    },
                    top:{
                        text:"Ваш адрес",
                        search:"Найдите любой магазин или товар",
                    }
                }
            },
        },
    });

export default i18n;
