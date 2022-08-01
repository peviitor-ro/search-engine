import React from 'react';
import './App.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from './pages/landing/landing.component';
import Serp from './pages/serp/serp.component';
import Error404 from './pages/404/404.component';

const App = () => {

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
