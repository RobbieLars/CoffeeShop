import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './config/ThemeContext';
import './wwwroot/css/Common/styles.css';
import './wwwroot/css/Common/TableComponent.css';
import './wwwroot/css/Common/ModalComponent.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </StrictMode>
);
