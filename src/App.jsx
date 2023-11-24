import React from 'react';
import './App.scss';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { SerpPage } from './pages/serp/serp.component';
import { LandingPage } from './pages/landing/landing.component';
import { Error404 } from './pages/error404/error404.component';
import { FiltersPage } from './pages/filters-page/filter-page.component';

function App() {
  return (

    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="rezultate/*" element={<SerpPage />} />
        <Route path="rezultate/filtre" element={<FiltersPage />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// https://www.figma.com/file/gY6yYTFjC0fuZ4bTRlUaH6/Pe-viitor?node-id=1029%3A1063 