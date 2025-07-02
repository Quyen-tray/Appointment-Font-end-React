import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthProvider } from "./AuthContext";
// import 'animate.css';
// import 'jquery.easing';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
// import '@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
