import React from 'react';
import './App.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { SerpPage } from './pages/serp/serp.component';
import { LandingPage } from './pages/landing/landing.component';
import { Error404 } from './pages/error404/error404.component';
import { FiltersPage } from './pages/filters-page/filter-page.component';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,

  },
  {
    path: "rezultate/",
    element: <SerpPage />,
  },
  {
    path: "rezultate/filtre",
    element: <FiltersPage />,
  },
  {
    path: "*",
    element: <Error404 />,
  }
]);

function App() {
  return (
    <section className="App">
      <RouterProvider router={router} />
    </section>
  );
}

export default App;

// https://www.figma.com/file/gY6yYTFjC0fuZ4bTRlUaH6/Pe-viitor?node-id=1029%3A1063 