import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import {LanguageProvider} from "./utils/lang/LangContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LanguageProvider>
            <App/>
        </LanguageProvider>
    </StrictMode>,
)
