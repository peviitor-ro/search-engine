import React from 'react';
import './App.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import baseUrl from './axios/baseUrl';

import LandingPage from './pages/landing/landing.component';
import Serp from './pages/serp/serp.component';
import Error404 from './pages/404/404.component';

const App = () => {
  baseUrl.get('total')
    .then((response) => {
      console.log(response)
    })

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="rezultate" element={<Serp />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
