import { createHashRouter, RouterProvider } from "react-router-dom";
// Pages
import Landing from "./pages/Landing";
import Rezultate from "./pages/Rezultate";
import TermsOfUse from "./pages/TermsOfUse";
import Privacy from "./pages/Privacy";
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
  return (
    <TagsProvider>
      <RouterProvider router={router} />
    </TagsProvider>
  );
}

export default App;
