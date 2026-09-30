import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/variables.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/preloader.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/intro.css';
import './styles/services.css';
import './styles/experience.css';
import './styles/demos.css';
import './styles/technical.css';
import './styles/skills.css';
import './styles/background.css';
import './styles/philosophy.css';
import './styles/contact.css';
import './styles/cursor.css';
import './styles/overlay.css';
import './styles/notfound.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
