import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Clarity from "@microsoft/clarity";
// Pages
import Landing from "./pages/Landing";
import Rezultate from "./pages/Rezultate";
import TermsOfUse from "./pages/TermsOfUse";
import Privacy from "./pages/Privacy";
import CompanyProfile from "./pages/CompanyProfile";
import Page404 from "./pages/Page404";
// context
import { TagsProvider } from "./context/TagsContext";

const router = createHashRouter(
  [
    {
      path: "",
      element: <Landing />
    },
    {
      path: "company/:id",
      element: <CompanyProfile />
    },
    {
      path: "rezultate",
      element: <Rezultate />
    },
    {
      path: "conditii-de-utilizare",
      element: <TermsOfUse />
    },
    {
      path: "politica-de-confidentialitate",
      element: <Privacy />
    },
    {
      path: "*",
      element: <Page404 />
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

function App() {
  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID;

    if (import.meta.env.PROD && clarityId) {
      Clarity.init(clarityId);
    }

    // Local testing
    // if (clarityId) { Clarity.init(clarityId); }
  }, []);

  return (
    <TagsProvider>
      <RouterProvider router={router} />
    </TagsProvider>
  );
}

export default App;
